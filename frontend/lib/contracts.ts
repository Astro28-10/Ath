export const CONTRACT_ABIS = {
  EscrowContract: [
    {
      "inputs": [
        { "internalType": "address", "name": "_freelancer", "type": "address" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" },
        { "internalType": "uint256", "name": "_reputationDiscount", "type": "uint256" },
        { "internalType": "uint256", "name": "_durationDays", "type": "uint256" },
        { "internalType": "bytes32", "name": "_deliverableHash", "type": "bytes32" }
      ],
      "name": "createProject",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
      "name": "fundProject",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_projectId", "type": "uint256" },
        { "internalType": "bytes32", "name": "_newHash", "type": "bytes32" }
      ],
      "name": "submitDeliverable",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_projectId", "type": "uint256" }],
      "name": "approveCompletion",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_projectId", "type": "uint256" },
        { "internalType": "string", "name": "_reason", "type": "string" }
      ],
      "name": "initiateDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_projectId", "type": "uint256" },
        { "internalType": "bool", "name": "_favorFreelancer", "type": "bool" }
      ],
      "name": "resolveDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_projectId", "type": "uint256" }],
      "name": "getProject",
      "outputs": [
        { "internalType": "address", "name": "freelancer", "type": "address" },
        { "internalType": "address", "name": "client", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "uint256", "name": "reputationDiscount", "type": "uint256" },
        { "internalType": "enum EscrowContract.ProjectState", "name": "state", "type": "uint8" },
        { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" },
        { "internalType": "bytes32", "name": "deliverableHash", "type": "bytes32" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  ReputationRegistry: [
    {
      "inputs": [
        { "internalType": "address", "name": "_freelancer", "type": "address" },
        { "internalType": "bytes32", "name": "_credentialHash", "type": "bytes32" },
        { "internalType": "address", "name": "_issuer", "type": "address" },
        { "internalType": "uint256", "name": "_weight", "type": "uint256" }
      ],
      "name": "registerCredential",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_freelancer", "type": "address" }],
      "name": "getCredentialHashes",
      "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_freelancer", "type": "address" }],
      "name": "calculateReputationScore",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};
