// Deploy contracts to testnet
async function main() {
  const hre = require("hardhat");

  console.log("Deploying SkillBond contracts...");

  // Deploy ReputationRegistry first
  const ReputationRegistry = await hre.ethers.getContractFactory("ReputationRegistry");
  const reputationRegistry = await ReputationRegistry.deploy();
  await reputationRegistry.deployed();
  console.log("✓ ReputationRegistry deployed to:", reputationRegistry.address);

  // Deploy EscrowContract
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");
  const escrowContract = await EscrowContract.deploy();
  await escrowContract.deployed();
  console.log("✓ EscrowContract deployed to:", escrowContract.address);

  // Save addresses for frontend
  const addresses = {
    reputationRegistry: reputationRegistry.address,
    escrowContract: escrowContract.address,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(addresses, null, 2));

  return addresses;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
