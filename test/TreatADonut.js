const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { any } = require("hardhat/internal/core/params/argumentTypes");

describe("Treat A Donut", () => {
  const deployTADFixture = async () => {
    const TAD = await ethers.getContractFactory("TreatADonut");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatTAD = await TAD.deploy();

    await hardhatTAD.deployed();

    return { TAD, hardhatTAD, owner, addr1, addr2 };
  };

  describe("Deployment", () => {
    it("Success on deployment of smart contract", async () => {
      const { hardhatTAD } = await loadFixture(deployTADFixture);
      const contractAddress = hardhatTAD.address;

      expect(contractAddress).not.to.equal("");
      expect(contractAddress).not.to.equal(null);
      expect(contractAddress).not.to.equal(undefined);
      expect(contractAddress).not.to.equal("0x0");
    });

    it("Success on setting right owner", async () => {
      const { hardhatTAD, owner } = await loadFixture(deployTADFixture);

      expect(await hardhatTAD.owner()).to.equal(owner.address);
    });

    it("Success on setting donut price", async () => {
      const { hardhatTAD } = await loadFixture(deployTADFixture);

      const donut = await hardhatTAD.DONUT();
      expect(donut).to.equal(ethers.utils.parseEther("0.003"));
    });

    it("Success on registration of owner as user", async () => {
      const { hardhatTAD, owner } = await loadFixture(deployTADFixture);

      const ok = await hardhatTAD.isUser(owner.address);
      expect(ok).to.equal(true);
      // assert.equal(ok, true);

      const users = await hardhatTAD.getUsers();
      expect(users.length).to.equal(1);
      expect(users[0]).to.equal(owner.address);

      const box = await hardhatTAD.boxOf(owner.address);
      expect(box.state.toString()).to.equal("1");
    });
  });

  describe("Ownership", () => {
    it("Success on transferal of ownership", async () => {
      const { hardhatTAD, owner, addr1 } = await loadFixture(deployTADFixture);

      const txHash = hardhatTAD.transferOwnership(addr1.address);

      expect(txHash)
        .to.emit(hardhatTAD, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);

      const newOwner = await hardhatTAD.owner();

      expect(newOwner).to.equal(addr1.address);
    });

    it("Failure on transferal of ownership called by non valid owner", async () => {
      const { hardhatTAD, addr1, addr2 } = await loadFixture(deployTADFixture);

      await expect(
        hardhatTAD.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWith("only allowed for owner");
    });
  });

  describe("Account", () => {
    it("Success on registration of user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      const txHash = await hardhatTAD.connect(addr1).register();

      expect(txHash)
        .to.emit(hardhatTAD, "UserRegistered")
        .withArgs(addr1.address, true, anyValue);
      expect(txHash)
        .to.emit(hardhatTAD, "DonutBoxActivated")
        .withArgs(addr1.address, anyValue);

      const users = await hardhatTAD.getUsers();

      expect(users[users.length - 1]).to.equal(addr1.address);

      const box = await hardhatTAD.boxOf(addr1.address);

      expect(box.state.toString()).to.equal("1");
    });

    it("Success on unregistration of user", async () => {
      const { hardhatTAD, addr1, addr2 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();
      await hardhatTAD.connect(addr2).register();

      const txHash = await hardhatTAD.connect(addr1).unregister();

      expect(txHash)
        .to.emit(hardhatTAD, "UserUnregistered")
        .withArgs(addr1.address, true, anyValue);
      expect(txHash)
        .to.emit(hardhatTAD, "DonutBoxDeactivated")
        .withArgs(addr1.address, true, anyValue);

      const users = await hardhatTAD.getUsers();

      expect(users.length).to.equal(2);

      const box = await hardhatTAD.boxOf(addr1.address);

      expect(box.state.toString()).to.equal("0");
    });

    it("Failure on re-registration of user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);
      await hardhatTAD.connect(addr1).register();
      await expect(hardhatTAD.connect(addr1).register()).to.be.revertedWith(
        "yet a valid user"
      );
    });

    it("Failure on unregistration of non valid user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);
      await expect(hardhatTAD.connect(addr1).unregister()).to.be.revertedWith(
        "not a valid user"
      );
    });

    it("Failure on unregistration of owner", async () => {
      const { hardhatTAD } = await loadFixture(deployTADFixture);
      await expect(hardhatTAD.unregister()).to.be.revertedWith(
        "not allowed for owner"
      );
    });
  });

  describe("Donut Box", () => {
    it("Success on deactivation of donut box", async () => {
      const { hardhatTAD, owner } = await loadFixture(deployTADFixture);
      const txHash = await hardhatTAD.deactivateBox();

      expect(txHash)
        .to.emit(hardhatTAD, "DonutBoxDeactivated")
        .withArgs(owner.address, anyValue);
    });

    it("Success on activation of donut box", async () => {
      const { hardhatTAD, owner } = await loadFixture(deployTADFixture);
      await hardhatTAD.deactivateBox();
      const txHash = await hardhatTAD.activateBox();

      expect(txHash)
        .to.emit(hardhatTAD, "DonutBoxActivated")
        .withArgs(owner.address, anyValue);
    });

    it("Failure on activation of activated box", async () => {
      const { hardhatTAD } = await loadFixture(deployTADFixture);

      await expect(hardhatTAD.activateBox()).to.be.revertedWith(
        "yet a activated box"
      );
    });

    it("Failure on deactivation of deactivated box", async () => {
      const { hardhatTAD } = await loadFixture(deployTADFixture);

      await hardhatTAD.deactivateBox();

      await expect(hardhatTAD.deactivateBox()).to.be.revertedWith(
        "not activated box"
      );
    });

    it("Failure on activation of non valid user's box", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await expect(hardhatTAD.connect(addr1).activateBox()).to.be.revertedWith(
        "not a valid user"
      );
    });

    it("Failure on deactivation of non valid user's box", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await expect(
        hardhatTAD.connect(addr1).deactivateBox()
      ).to.be.revertedWith("not a valid user");
    });
  });

  describe("Support", () => {
    it("Success on supporting five donuts to user from user", async () => {
      const { hardhatTAD, owner, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let from = owner.address;
      let to = addr1.address;
      let amount = 5;
      let message = "user supporting five donuts";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      const txHash = await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      expect(txHash)
        .to.emit(hardhatTAD, "DonutSupported")
        .withArgs(from, to, amount, anyValue);
    });

    it("Success on supporting five donuts to user from non valid user", async () => {
      const { hardhatTAD, addr1, addr2 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let from = addr2.address;
      let to = addr1.address;
      let amount = 5;
      let message = "non valid user supporting five donuts";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      const txHash = await hardhatTAD
        .connect(addr2)
        .supportDonut(to, amount, message, {
          value: payment,
        });

      expect(txHash)
        .to.emit(hardhatTAD, "DonutSupported")
        .withArgs(from, to, amount, anyValue);
    });

    it("Success on retreiving support receipts", async () => {
      const { hardhatTAD, owner, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let from = owner.address;
      let to = addr1.address;
      let amount = 5;
      let message = "user supporting five donuts";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      const receiptsOfSupporter = await hardhatTAD.getReceiptsOfSupporter(from);

      expect(receiptsOfSupporter.length).to.equal(1);
      expect(receiptsOfSupporter[0].from).to.equal(from);
      expect(receiptsOfSupporter[0].to).to.equal(to);
      expect(receiptsOfSupporter[0].amount).to.equal(amount);
      expect(receiptsOfSupporter[0].message).to.equal(message);

      const receiptsOfBeneficiary = await hardhatTAD.getReceiptsOfBeneficiary(
        to
      );

      expect(receiptsOfBeneficiary.length).to.equal(1);
      expect(receiptsOfBeneficiary[0].from).to.equal(from);
      expect(receiptsOfBeneficiary[0].to).to.equal(to);
      expect(receiptsOfBeneficiary[0].amount).to.equal(amount);
      expect(receiptsOfBeneficiary[0].message).to.equal(message);
    });

    it("Success on transferring payment except fee", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "user supporting five donuts";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      let fee = payment.div(ethers.BigNumber.from("100"));
      let transferred = payment.sub(fee);

      const box = await hardhatTAD.boxOf(to);
      expect(box.balance).to.equal(transferred);
    });

    it("Failure on supporting zero donuts to user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      let to = addr1.address;
      let amount = 0;
      let message = "user supporting five donuts to user with deactivated box";

      await expect(
        hardhatTAD.supportDonut(to, amount, message, {
          value: 0,
        })
      ).to.be.revertedWith("zero amount not allowed");
    });

    it("Failure on supporting donuts to oneself", async () => {
      const { hardhatTAD, owner } = await loadFixture(deployTADFixture);

      const donut = await hardhatTAD.DONUT();
      let to = owner.address;
      let amount = 5;
      let message = "user supporting five donuts to oneself";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await expect(
        hardhatTAD.supportDonut(to, amount, message, {
          value: payment,
        })
      ).to.be.revertedWith("supporting yourself not allowed");
    });

    it("Failure on supporting five donuts to non valid user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "user supporting five donuts to non valid user";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await expect(
        hardhatTAD.supportDonut(to, amount, message, {
          value: payment,
        })
      ).to.be.revertedWith("not a valid user");
    });

    it("Failure on supporting five donuts to user with deactivated box", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();
      await hardhatTAD.connect(addr1).deactivateBox();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "user supporting five donuts to user with deactivated box";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await expect(
        hardhatTAD.supportDonut(to, amount, message, {
          value: payment,
        })
      ).to.be.revertedWith("not activated box");
    });

    it("Failure on supporting five donuts to user with insufficient payment", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "user supporting five donuts to user with deactivated box";
      let payment = ethers.BigNumber.from(amount - 1).mul(donut);

      await expect(
        hardhatTAD.supportDonut(to, amount, message, {
          value: payment,
        })
      ).to.be.revertedWith("not enough payment");
    });
  });

  describe("Withdraw", () => {
    it("Success on balance withdrawal of user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      let beforeAccountBalance = await addr1.getBalance();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "withdraw balance";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      const box = await hardhatTAD.boxOf(to);
      let withdrawAmount = box.balance;

      const txHash = await hardhatTAD.connect(addr1).withdraw(withdrawAmount);

      expect(txHash)
        .to.emit(hardhatTAD, "Withdrawn")
        .withArgs(addr1.address, withdrawAmount, anyValue);

      let afterAccountBalance = await addr1.getBalance();

      let diff = afterAccountBalance.sub(beforeAccountBalance);

      expect(diff).to.be.gt(0);
    });

    it("Failure on balance withdrawal with zero amount", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "withdraw non valid user balance";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      await expect(hardhatTAD.connect(addr1).withdraw(0)).to.be.revertedWith(
        "zero amount not allowed"
      );
    });

    it("Failure on balance withdrawal of non valid user", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "withdraw non valid user balance";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      const box = await hardhatTAD.boxOf(to);
      let withdrawAmount = box.balance;

      await hardhatTAD.connect(addr1).unregister();

      await expect(
        hardhatTAD.connect(addr1).withdraw(withdrawAmount)
      ).to.be.revertedWith("not a valid user");
    });

    it("Failure on balance withdrawal from deactivated box", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "withdraw from deactivated box";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      const box = await hardhatTAD.boxOf(to);
      let withdrawAmount = box.balance;

      await hardhatTAD.connect(addr1).deactivateBox();

      await expect(
        hardhatTAD.connect(addr1).withdraw(withdrawAmount)
      ).to.be.revertedWith("not activated box");
    });

    it("Failure on balance withdrawal of an excess of amount", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "withdraw an excess of amount";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      let withdrawAmount = ethers.BigNumber.from(amount + 1).mul(donut);

      await expect(
        hardhatTAD.connect(addr1).withdraw(withdrawAmount)
      ).to.be.revertedWith("not enough balance");
    });
  });

  describe("Destruction", () => {
    it("Success on smart contract destruction", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await hardhatTAD.connect(addr1).register();

      let beforeAccountBalance = await addr1.getBalance();

      const donut = await hardhatTAD.DONUT();
      let to = addr1.address;
      let amount = 5;
      let message = "smart contract destruction";
      let payment = ethers.BigNumber.from(amount).mul(donut);

      await hardhatTAD.supportDonut(to, amount, message, {
        value: payment,
      });

      await hardhatTAD.destroyContract();

      let afterAccountBalance = await addr1.getBalance();

      let diff = afterAccountBalance.sub(beforeAccountBalance);

      expect(diff).to.be.gt(0);

      await expect(hardhatTAD.DONUT()).to.be.reverted;
    });

    it("Failure on smart contract destruction called by non valid owner", async () => {
      const { hardhatTAD, addr1 } = await loadFixture(deployTADFixture);

      await expect(
        hardhatTAD.connect(addr1).destroyContract()
      ).to.be.revertedWith("only allowed for owner");
    });
  });
});
