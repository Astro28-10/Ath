// Smart Contract ABIs for SkillBond Frontend
// Auto-generated from contract artifacts

// EscrowContract ABI
export const ESCROW_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "freelancer", "type": "address"}
    ],
    "name": "CredentialMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
      {"indexed": false, "internalType": "bytes32", "name": "hash", "type": "bytes32"}
    ],
    "name": "DeliverableSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "DisputeInitiated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "favorFreelancer", "type": "bool"}
    ],
    "name": "DisputeResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"}
    ],
    "name": "ProjectCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "client", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "freelancer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "ProjectCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"}
    ],
    "name": "ProjectFunded",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_projectId", "type": "uint256"}],
    "name": "approveCompletion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_freelancer", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"},
      {"internalType": "uint256", "name": "_reputationDiscount", "type": "uint256"},
      {"internalType": "uint256", "name": "_durationDays", "type": "uint256"},
      {"internalType": "bytes32", "name": "_deliverableHash", "type": "bytes32"}
    ],
    "name": "createProject",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_projectId", "type": "uint256"}],
    "name": "fundProject",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_projectId", "type": "uint256"}],
    "name": "getProject",
    "outputs": [
      {"internalType": "address", "name": "freelancer", "type": "address"},
      {"internalType": "address", "name": "client", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "reputationDiscount", "type": "uint256"},
      {"internalType": "enum EscrowContract.ProjectState", "name": "state", "type": "uint8"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bytes32", "name": "deliverableHash", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProjectCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_projectId", "type": "uint256"},
      {"internalType": "string", "name": "_reason", "type": "string"}
    ],
    "name": "initiateDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "projectCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_projectId", "type": "uint256"},
      {"internalType": "bool", "name": "_favorFreelancer", "type": "bool"}
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_projectId", "type": "uint256"},
      {"internalType": "bytes32", "name": "_newHash", "type": "bytes32"}
    ],
    "name": "submitDeliverable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ReputationRegistry ABI
export const REPUTATION_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "freelancer", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "credentialHash", "type": "bytes32"},
      {"indexed": false, "internalType": "address", "name": "issuer", "type": "address"}
    ],
    "name": "CredentialRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_freelancer", "type": "address"},
      {"internalType": "bytes32", "name": "_credentialHash", "type": "bytes32"},
      {"internalType": "address", "name": "_issuer", "type": "address"},
      {"internalType": "uint256", "name": "_weight", "type": "uint256"}
    ],
    "name": "registerCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_freelancer", "type": "address"}],
    "name": "getCredentialHashes",
    "outputs": [{"internalType": "bytes32[]", "name": "", "type": "bytes32[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_freelancer", "type": "address"}],
    "name": "calculateReputationScore",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  ESCROW_CONTRACT: process.env.NEXT_PUBLIC_ESCROW_CONTRACT || "0x7a7AC9CC881D975F4bFD10094C1C3C2F8f058D0d",
  REPUTATION_REGISTRY: process.env.NEXT_PUBLIC_REPUTATION_REGISTRY || "0x1B1C962B4A4be5B655a8A4588a06282646b7ba02",
};

// Network Configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: 80002,
  NETWORK_NAME: "Polygon Amoy",
  RPC_URL: "https://rpc-amoy.polygon.technology",
  BLOCK_EXPLORER: "https://amoy.polygonscan.com",
};

export default {
  ESCROW_ABI,
  REPUTATION_ABI,
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
};
