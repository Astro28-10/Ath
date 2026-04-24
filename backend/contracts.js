// Backend contract instance initialization
// Connects to deployed contracts on Polygon Amoy

const { ethers } = require('ethers');
require('dotenv').config();

// Get environment variables
const RPC_URL = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ESCROW_ADDRESS = process.env.ESCROW_CONTRACT_ADDRESS;
const REPUTATION_ADDRESS = process.env.REPUTATION_REGISTRY_ADDRESS;

// Contract ABIs
const ESCROW_ABI = [
  'function createProject(address _freelancer, uint256 _amount, uint256 _reputationDiscount, uint256 _durationDays, bytes32 _deliverableHash) public returns (uint256)',
  'function fundProject(uint256 _projectId) public payable',
  'function submitDeliverable(uint256 _projectId, bytes32 _newHash) public',
  'function approveCompletion(uint256 _projectId) public',
  'function initiateDispute(uint256 _projectId, string memory _reason) public',
  'function resolveDispute(uint256 _projectId, bool _favorFreelancer) public',
  'function getProject(uint256 _projectId) public view returns (address, address, uint256, uint256, uint8, uint256, uint256, bytes32)',
  'function getProjectCount() public view returns (uint256)',
  'event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 amount, uint256 deadline)',
  'event ProjectFunded(uint256 indexed projectId)',
  'event DeliverableSubmitted(uint256 indexed projectId, bytes32 hash)',
  'event ProjectCompleted(uint256 indexed projectId)',
  'event CredentialMinted(uint256 indexed projectId, address indexed freelancer)',
];

const REPUTATION_ABI = [
  'function registerCredential(address _freelancer, bytes32 _credentialHash, address _issuer, uint256 _weight) public',
  'function getCredentialHashes(address _freelancer) public view returns (bytes32[])',
  'function calculateReputationScore(address _freelancer) public view returns (uint256)',
  'event CredentialRegistered(address indexed freelancer, bytes32 credentialHash, address issuer)',
];

// Initialize provider and signer
let provider;
let wallet;
let escrowContract;
let reputationContract;

async function initializeContracts() {
  try {
    console.log('Initializing contracts...');
    
    // Setup provider
    provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Verify provider connection
    const network = await provider.getNetwork();
    console.log(`✓ Connected to network: ${network.name} (ChainID: ${network.chainId})`);
    
    // Setup wallet from private key
    if (!PRIVATE_KEY || PRIVATE_KEY === '0x') {
      throw new Error('PRIVATE_KEY not configured in .env');
    }
    
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`✓ Wallet initialized: ${wallet.address}`);
    
    // Verify contract addresses
    if (!ESCROW_ADDRESS || !REPUTATION_ADDRESS) {
      throw new Error('Contract addresses not configured in .env');
    }
    
    // Initialize contract instances
    escrowContract = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, wallet);
    reputationContract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, wallet);
    
    console.log(`✓ EscrowContract: ${ESCROW_ADDRESS}`);
    console.log(`✓ ReputationRegistry: ${REPUTATION_ADDRESS}`);
    
    // Test contract reads
    try {
      const projectCount = await escrowContract.getProjectCount();
      console.log(`✓ Contract read test successful: ${projectCount} projects`);
    } catch (error) {
      console.warn('⚠ Contract read test failed (contract may not have this function yet)');
    }
    
    return { escrowContract, reputationContract, wallet, provider };
  } catch (error) {
    console.error('❌ Contract initialization failed:', error.message);
    throw error;
  }
}

// Export for use in other modules
module.exports = {
  initializeContracts,
  getContracts: () => ({
    escrowContract,
    reputationContract,
    wallet,
    provider,
  }),
};
