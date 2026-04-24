// Demo Account Population Script
// Creates test accounts with reputation credentials on blockchain

const { ethers } = require('ethers');
require('dotenv').config();

const RPC_URL = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const REPUTATION_ADDRESS = process.env.REPUTATION_REGISTRY_ADDRESS;

// Reputation Registry ABI
const REPUTATION_ABI = [
  'function registerCredential(address _freelancer, bytes32 _credentialHash, address _issuer, uint256 _weight) public',
  'function getCredentialHashes(address _freelancer) public view returns (bytes32[])',
  'function calculateReputationScore(address _freelancer) public view returns (uint256)',
  'event CredentialRegistered(indexed address freelancer, bytes32 credentialHash, address issuer)',
];

// Demo accounts with different reputation levels
const DEMO_ACCOUNTS = [
  {
    name: 'alice.eth',
    address: '0x72f32C9b10e8669b5Fd139a00e03004eE4bd3b1D',
    targetScore: 95,
    projectsToCreate: 5, // Reduced from 50 to conserve gas
    description: 'High reputation freelancer (95%)',
  },
  {
    name: 'bob.eth',
    address: '0x1234567890123456789012345678901234567890', // Demo address
    targetScore: 72,
    projectsToCreate: 3, // Reduced from 15
    description: 'Medium reputation freelancer (72%)',
  },
  {
    name: 'carol.eth',
    address: '0x0987654321098765432109876543210987654321', // Demo address
    targetScore: 40,
    projectsToCreate: 1, // Reduced from 2
    description: 'Low reputation freelancer (40%)',
  },
];

async function main() {
  try {
    console.log('\n🚀 SkillBond Demo Account Population Script\n');
    console.log('📍 Network: Polygon Amoy');
    console.log(`📍 ReputationRegistry: ${REPUTATION_ADDRESS}`);
    console.log('-------------------------------------------\n');

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`✓ Wallet: ${wallet.address}\n`);

    // Connect to reputation contract
    const reputationRegistry = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, wallet);

    // Process each demo account
    for (const account of DEMO_ACCOUNTS) {
      console.log(`\n📋 Populating: ${account.name}`);
      console.log(`   Address: ${account.address}`);
      console.log(`   Target Score: ${account.targetScore}%`);
      console.log(`   Credentials: ${account.projectsToCreate}`);
      console.log('   Status: Starting credential registration...\n');

      let successCount = 0;
      let failureCount = 0;

      // Register credentials for this account
      for (let i = 0; i < account.projectsToCreate; i++) {
        try {
          // Create a unique credential hash for each project
          const credentialData = `${account.address}-project-${i}-${Date.now()}`;
          const credentialHash = ethers.id(credentialData);

          // Random weight between 8000-10000 (80-100%) to simulate varying quality
          const weight = 8000 + Math.floor(Math.random() * 2000);

          // Send transaction to register credential
          // Note: In production, these would be actual W3C Verifiable Credentials
          const tx = await reputationRegistry.registerCredential(
            account.address,
            credentialHash,
            wallet.address,
            weight,
            {
              gasLimit: 200000,
            }
          );

          await tx.wait();

          successCount++;
          const progressBar = '█'.repeat(Math.floor((i + 1) / account.projectsToCreate * 20));
          const percentDone = Math.floor(((i + 1) / account.projectsToCreate) * 100);
          console.log(`   [${progressBar.padEnd(20, '░')}] ${percentDone}% (${i + 1}/${account.projectsToCreate})`);
        } catch (error) {
          failureCount++;
          console.error(`   ✗ Credential ${i + 1} failed: ${error.message.substring(0, 50)}...`);
        }
      }

      // Verify reputation score
      try {
        const reputationScore = await reputationRegistry.calculateReputationScore(account.address);
        const scorePercent = (reputationScore / 10000) * 100;

        console.log(`\n   ✓ Results for ${account.name}:`);
        console.log(`     - Credentials registered: ${successCount}`);
        console.log(`     - Failed: ${failureCount}`);
        console.log(`     - Reputation score: ${scorePercent.toFixed(1)}%`);
        console.log(`     - On-chain score: ${reputationScore}`);
      } catch (error) {
        console.log(`\n   ⚠ Could not fetch reputation: ${error.message.substring(0, 40)}...`);
      }
    }

    console.log('\n\n✅ Demo account population COMPLETE!\n');
    console.log('Next steps:');
    console.log('1. Start backend: npm start');
    console.log('2. Test endpoints: curl http://localhost:3001/api/health');
    console.log('3. Check reputation: curl http://localhost:3001/api/reputation/{address}');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Population script failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
