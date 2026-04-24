// Deploy contracts to testnet
async function main() {
  const hre = require("hardhat");

  console.log("Deploying SkillBond contracts...");

  // Deploy ReputationRegistry first
  const ReputationRegistry = await hre.ethers.getContractFactory("ReputationRegistry");
  const reputationRegistry = await ReputationRegistry.deploy();
  await reputationRegistry.waitForDeployment();
  const regAddress = await reputationRegistry.getAddress();
  console.log("? ReputationRegistry deployed to:", regAddress);

  // Deploy EscrowContract
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");
  const escrowContract = await EscrowContract.deploy();
  await escrowContract.waitForDeployment();
  const escrowAddress = await escrowContract.getAddress();
  console.log("? EscrowContract deployed to:", escrowAddress);

  // Save addresses for frontend
  const addresses = {
    reputationRegistry: regAddress,
    escrowContract: escrowAddress,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
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
