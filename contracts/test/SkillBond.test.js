const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillBond - Core Contracts", function () {
  let escrowContract;
  let reputationRegistry;
  let client, freelancer, other;

  before(async () => {
    [client, freelancer, other] = await ethers.getSigners();

    // Deploy contracts
    const EscrowContract = await ethers.getContractFactory("EscrowContract");
    escrowContract = await EscrowContract.deploy();

    const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
    reputationRegistry = await ReputationRegistry.deploy();
  });

  describe("EscrowContract", () => {
    it("should create a project", async () => {
      const tx = await escrowContract.connect(client).createProject(
        freelancer.address,
        ethers.parseEther("1.0"),
        2000, // 20% discount
        7,
        ethers.id("QmTest")
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it("should fund a project", async () => {
      const amount = ethers.parseEther("1.0");
      const discount = 2000;
      const discountedAmount = (amount * (10000n - BigInt(discount))) / 10000n;

      await escrowContract.connect(client).createProject(
        freelancer.address,
        amount,
        discount,
        7,
        ethers.id("QmTest2")
      );

      const tx = await client.sendTransaction({
        to: await escrowContract.getAddress(),
        value: discountedAmount,
      });

      await expect(
        escrowContract.connect(client).fundProject(0, { value: discountedAmount })
      ).to.be.reverted; // Already funded
    });

    it("should calculate reputation discount", async () => {
      const amount = ethers.parseEther("1.0");
      const reputationScore = 8500; // 85%
      const discount = 10000 - reputationScore; // 1500 = 15% discount

      const discountedAmount = (amount * BigInt(10000 - discount)) / 10000n;
      expect(discountedAmount).to.equal(ethers.parseEther("0.85"));
    });
  });

  describe("ReputationRegistry", () => {
    it("should register a credential", async () => {
      const credentialHash = ethers.id("VC-001");
      const weight = 8500;

      const tx = await reputationRegistry.registerCredential(
        freelancer.address,
        credentialHash,
        client.address,
        weight
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it("should retrieve credential hashes", async () => {
      const credentialHash1 = ethers.id("VC-002");
      const credentialHash2 = ethers.id("VC-003");

      await reputationRegistry.registerCredential(
        freelancer.address,
        credentialHash1,
        client.address,
        8000
      );

      await reputationRegistry.registerCredential(
        freelancer.address,
        credentialHash2,
        client.address,
        8500
      );

      const hashes = await reputationRegistry.getCredentialHashes(freelancer.address);
      expect(hashes.length).to.equal(2);
    });

    it("should calculate reputation score", async () => {
      const score = await reputationRegistry.calculateReputationScore(freelancer.address);
      expect(score).to.be.greaterThan(0);
      expect(score).to.be.lessThanOrEqual(10000);
    });
  });
});
