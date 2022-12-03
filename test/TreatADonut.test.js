const { assert } = require("chai");

const TreatADonut = artifacts.require("TreatADonut");

require("chai").use(require("chai-as-promised")).should();

contract("TreatADonut", async (accounts) => {
  let contract;
  let owner;
  let donut;
  let from;
  let to;
  let amount;
  let message;
  let payment;
  let box;

  before(async () => {
    contract = await TreatADonut.deployed();
    donut = await contract.DONUT();
  });

  describe("deployment", async () => {
    it("deployed successfully", async () => {
      const address = contract.address;
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, "0x0");
    });

    it("registered owner as user successfully", async () => {
      owner = await contract.owner();
      let ok = await contract.isUser(owner);
      assert.equal(ok, true);

      let users = await contract.getUsers();
      assert.equal(users.length, 1);
    });
  });

  describe("account", async () => {
    it("owner rejected to re-register", async () => {
      await contract.unregister({ from: owner }).should.be.rejected;
    });

    it("owner rejected to unregister", async () => {
      await contract.register({ from: owner }).should.be.rejected;
    });

    it("user registered successfully", async () => {
      await contract.register({ from: accounts[1] });

      let ok = await contract.isUser(accounts[1]);
      assert.equal(ok, true);

      let box = await contract.boxOf(accounts[1]);
      assert.equal(box.state, 1);

      let users = await contract.getUsers();
      assert.equal(users.length, 2);
    });

    it("user rejected to re-register", async () => {
      await contract.register({ from: accounts[1] }).should.be.rejected;
    });

    it("user unregistered successfully", async () => {
      await contract.unregister({ from: accounts[1] });

      let ok = await contract.isUser(accounts[1]);
      assert.equal(ok, false);

      let box = await contract.boxOf(accounts[1]);
      assert.equal(box.state, 0);

      let users = await contract.getUsers();
      assert.equal(users.length, 1);
    });
  });

  describe("support", async () => {
    it("user support five donuts to user successfully", async () => {
      from = accounts[0];
      to = accounts[1];
      amount = 5;
      message = "user";

      await contract.register({ from: to });

      await testSupportDonut(1, 1);
    });

    it("unidentified support five donuts to user successfully", async () => {
      from = accounts[2];
      message = "unidentified";

      await testSupportDonut(2, 1);
    });

    it("rejected to support zero donut to user", async () => {
      from = accounts[0];
      amount = 0;
      message = "zero amount not allowed";

      await supportDonut().should.be.rejected;
    });

    it("rejected to support five donuts to user with insufficient payment", async () => {
      amount = 5;
      message = "not enough payment";

      await contract.supportDonut(to, amount, message, {
        from: from,
        value: payment,
      }).should.be.rejected;
    });

    it("rejected to support on its own", async () => {
      to = accounts[0];
      message = "cannot support yourself";

      await supportDonut().should.be.rejected;
    });

    it("rejected to support five donuts to invalid user", async () => {
      to = accounts[2];
      amount = 5;
      message = "invalid user";

      await supportDonut().should.be.rejected;
    });
  });

  describe("donut box", async () => {
    it("deactivated box successfully", async () => {
      from = accounts[1];
      await contract.deactivateBox({ from: from });
      testBoxState(0);
    });

    it("rejected to deactivate deactivated box", async () => {
      await contract.deactivateBox({ from: from }).should.be.rejected;
    });

    it("rejected to withdraw balance from deactivated box", async () => {
      await contract.withdraw(box.balance, { from: from }).should.be.rejected;
    });

    it("activated box successfully", async () => {
      await contract.activateBox({ from: from });
      testBoxState(1);
    });
  });

  describe("withdraw", async () => {
    it("rejected to withdraw zero amount", async () => {
      await contract.withdraw(0, { from: from }).should.be.rejected;
    });

    it("rejected to withdraw an excess of amount", async () => {
      await contract.withdraw(web3.utils.toWei("1", "ether"), {
        from: from,
      }).should.be.rejected;
    });

    it("withdrawn all available amount from box successfully", async () => {
      box = await contract.boxOf(from);
      let available = box.balance;
      let hash = await contract.withdraw(available, { from: from });

      let withdrawnLog = hash.logs[0].args;

      assert.equal(withdrawnLog.amount, available);

      box = await contract.boxOf(from);
      assert.equal("0", box.balance);
    });
  });

  describe("transfer ownership", async () => {
    it("transferred ownership successfully", async () => {
      let newOwner = accounts[3];
      let previousOwner = owner;
      const hash = await contract.transferOwnership(newOwner, {
        from: previousOwner,
      });
      const ownershipLog = hash.logs[0].args;

      assert.equal(previousOwner, ownershipLog.previousOwner);
      assert.equal(newOwner, ownershipLog.newOwner);

      owner = await contract.owner();
      assert.equal(newOwner, owner);
    });
  });

  describe("destruction", async () => {
    it("destroyed smart contract successfully", async () => {
      from = accounts[0];
      to = accounts[1];
      amount = 5;
      message = "destroy smart contract";

      await supportDonut();

      let beforeDestruction = parseInt(
        await web3.eth.getBalance(accounts[1]),
        10
      );

      await contract.destroyContract({ from: owner });

      let expected = beforeDestruction + payment;

      let afterDestruction = parseInt(
        await web3.eth.getBalance(accounts[1]),
        10
      );

      assert.isAbove(afterDestruction, beforeDestruction);
      assert.isAtMost(afterDestruction, expected);
    });
  });

  const testSupportDonut = async (
    expectedLenOfBeneficiary,
    expectedLenOfSupporter
  ) => {
    box = await contract.boxOf(to);
    let balanceBeforeSupport = box.balance;

    const supportLog = await supportDonut(from, to, amount, message);
    assert.equal(supportLog.from, from);
    assert.equal(supportLog.to, to);
    assert.equal(supportLog.amount, amount);

    let receiptsOfBeneficiary = await contract.getReceiptsOfBeneficiary(to);
    let length = receiptsOfBeneficiary.length;
    assert.equal(expectedLenOfBeneficiary, length);
    assert.equal(receiptsOfBeneficiary[length - 1].message, message);

    let receiptsOfSupporter = await contract.getReceiptsOfSupporter(from);
    length = receiptsOfSupporter.length;
    assert.equal(expectedLenOfSupporter, length);
    assert.equal(receiptsOfSupporter[length - 1].message, message);

    let fee = payment / 100;
    let deposited = payment - fee;
    box = await contract.boxOf(to);

    let expected = web3.utils
      .toBN(balanceBeforeSupport)
      .add(web3.utils.toBN(deposited))
      .toString();
    assert.equal(expected, box.balance);
  };

  const supportDonut = async () => {
    payment = donut.toNumber() * amount;

    const hash = await contract.supportDonut(to, amount, message, {
      from: from,
      value: payment,
    });

    return hash.logs[0].args;
  };

  const testBoxState = async (expected) => {
    box = await contract.boxOf(from);

    assert.equal(expected, box.state);
  };
});
