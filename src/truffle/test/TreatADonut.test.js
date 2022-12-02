const { assert } = require("chai");

const TreatADonut = artifacts.require("TreatADonut");

require("chai").use(require("chai-as-promised")).should();

contract("TreatADonut", async (accounts) => {
  let contract;

  before(async () => {
    contract = await TreatADonut.deployed();
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
      const owner = await contract.owner();
      let ok = await contract.isUser(owner);
      assert.equal(ok, true);

      const users = await contract.getUsers();
      assert.equal(users.length, 1);
    });
  });

  describe("access control", async () => {
    it("owner rejected to re-register", async () => {
      await contract.unregister({ from: accounts[0] }).should.be.rejected;
    });

    it("owner rejected to unregister", async () => {
      await contract.register({ from: accounts[0] }).should.be.rejected;
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
      await contract.register({ from: accounts[1] });

      const donut = await contract.DONUT();
      let amount = 5;
      let payment = donut.toNumber() * amount;
      let message = "user";

      let box = await contract.boxOf(accounts[1]);
      let balance = box.balance;

      const hash = await contract.supportDonut(accounts[1], amount, message, {
        from: accounts[0],
        value: payment,
      });

      const supportLog = hash.logs[0].args;

      assert.equal(supportLog.from, accounts[0]);
      assert.equal(supportLog.to, accounts[1]);
      assert.equal(supportLog.amount, amount);

      let receiptsOfBeneficiary = await contract.getReceiptsOfBeneficiary(
        accounts[1]
      );
      assert.equal(receiptsOfBeneficiary.length, 1);
      assert.equal(receiptsOfBeneficiary[0].message, message);

      let receiptsOfSupporter = await contract.getReceiptsOfSupporter(
        accounts[0]
      );
      assert.equal(receiptsOfSupporter.length, 1);

      let fee = payment / 100;
      let deposited = payment - fee;
      box = await contract.boxOf(accounts[1]);
      balance = web3.utils
        .toBN(balance)
        .add(web3.utils.toBN(deposited))
        .toString();
      assert.equal(box.balance, balance);
    });

    it("unidentified support five donuts to user successfully", async () => {
      const donut = await contract.DONUT();
      let amount = 5;
      let payment = donut.toNumber() * amount;
      let message = "unidentified";

      let box = await contract.boxOf(accounts[1]);
      let balance = box.balance;

      const hash = await contract.supportDonut(accounts[1], amount, message, {
        from: accounts[2],
        value: payment,
      });

      const supportLog = hash.logs[0].args;

      assert.equal(supportLog.from, accounts[2]);
      assert.equal(supportLog.to, accounts[1]);
      assert.equal(supportLog.amount, amount);

      let receiptsOfBeneficiary = await contract.getReceiptsOfBeneficiary(
        accounts[1]
      );
      assert.equal(receiptsOfBeneficiary.length, 2);
      assert.equal(receiptsOfBeneficiary[1].message, message);

      let receiptsOfSupporter = await contract.getReceiptsOfSupporter(
        accounts[2]
      );
      assert.equal(receiptsOfSupporter.length, 1);

      let fee = payment / 100;
      let deposited = payment - fee;
      box = await contract.boxOf(accounts[1]);
      balance = web3.utils
        .toBN(balance)
        .add(web3.utils.toBN(deposited))
        .toString();
      assert.equal(box.balance, balance);
    });

    it("rejected to support zero donut to user", async () => {
      const donut = await contract.DONUT();
      let zeroAmount = 0;
      let payment = donut.toNumber() * zeroAmount;
      let message = "zero amount not allowed";

      await contract.supportDonut(accounts[1], zeroAmount, message, {
        from: accounts[0],
        value: payment,
      }).should.be.rejected;
    });

    it("rejected to support five donuts to user with insufficient payment", async () => {
      const donut = await contract.DONUT();
      let amount = 5;
      let insufficientPayment = donut.toNumber() * (amount - 1);
      let message = "not enough payment";

      await contract.supportDonut(accounts[1], amount, message, {
        from: accounts[0],
        value: insufficientPayment,
      }).should.be.rejected;
    });

    it("rejected to support five donuts to invalid user", async () => {
      const donut = await contract.DONUT();
      let amount = 5;
      let payment = donut.toNumber() * amount;
      let message = "invalid user";

      await contract.supportDonut(accounts[2], amount, message, {
        from: accounts[0],
        value: payment,
      }).should.be.rejected;
    });
  });

  describe("donut box", async () => {
    it("deactivated box successfully", async () => {
      await contract.deactivateBox({ from: accounts[1] });
      let box = await contract.boxOf(accounts[1]);

      assert.equal(box.state, 0);
    });

    it("rejected to deactivate deactivated box", async () => {
      await contract.deactivateBox({ from: accounts[1] }).should.be.rejected;
    });

    it("rejected to withdraw balance from deactivated box", async () => {
      let box = await contract.boxOf(accounts[1]);
      await contract.withdraw(box.balance, { from: accounts[1] }).should.be
        .rejected;
    });

    it("activated box successfully", async () => {
      await contract.activateBox({ from: accounts[1] });
      let box = await contract.boxOf(accounts[1]);

      assert.equal(box.state, 1);
    });

    it("rejected to withdraw zero amount", async () => {
      await contract.withdraw(0, { from: accounts[1] }).should.be.rejected;
    });

    it("rejected to withdraw an excess of amount", async () => {
      await contract.withdraw(web3.utils.toWei("1", "ether"), {
        from: accounts[1],
      }).should.be.rejected;
    });

    it("withdrawn all available amount from box successfully", async () => {
      let box = await contract.boxOf(accounts[1]);
      let amount = box.balance;
      let hash = await contract.withdraw(amount, { from: accounts[1] });

      let withdrawnLog = hash.logs[0].args;

      assert.equal(withdrawnLog.amount, amount);

      box = await contract.boxOf(accounts[1]);
      assert.equal(box.balance, "0");
    });
  });

  describe("destruction", async () => {
    it("destroyed smart contract successfully", async () => {
      await contract.destroyContract().should.be.ok;
    });
  });
});
