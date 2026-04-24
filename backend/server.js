require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const { initializeContracts } = require('./contracts');

const app = express();
const PORT = process.env.PORT || 3001;

// Contract instances (initialized on startup)
let contracts = null;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data for demo accounts (cached from blockchain or demo data)
const demoReputationData = {
  '0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d': {
    score: 9500, // 95% - Alice: High reputation
    credentialCount: 5,
    averageRating: 4.9,
    lastActivity: new Date(Date.now() - 3600 * 1000).toISOString(),
    source: 'demo',
  },
  '0x1234567890123456789012345678901234567890': {
    score: 7200, // 72% - Bob: Medium reputation
    credentialCount: 3,
    averageRating: 4.3,
    lastActivity: new Date(Date.now() - 86400 * 2 * 1000).toISOString(),
    source: 'demo',
  },
  '0x0987654321098765432109876543210987654321': {
    score: 4000, // 40% - Carol: Low reputation
    credentialCount: 1,
    averageRating: 3.5,
    lastActivity: new Date(Date.now() - 86400 * 7 * 1000).toISOString(),
    source: 'demo',
  },
};

// Mock credentials for demo
const mockCredentials = {};

// API Routes

/**
 * GET /api/reputation/:address
 * Returns reputation score for a freelancer (blockchain first, then demo/mock data)
 */
app.get('/api/reputation/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const addressLower = address.toLowerCase();

    // Validate address format
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address format' });
    }

    // Check if we have demo data for this address
    if (demoReputationData[addressLower]) {
      const demoData = demoReputationData[addressLower];
      return res.json({
        address,
        score: demoData.score,
        scorePercent: (demoData.score / 10000 * 100).toFixed(1),
        credentialCount: demoData.credentialCount,
        averageRating: demoData.averageRating,
        lastActivity: demoData.lastActivity,
        source: 'demo',
      });
    }

    // If contracts not initialized, return random data
    if (!contracts) {
      console.warn('⚠ Contracts not initialized, returning random data for', address);
      const randomScore = 4000 + Math.floor(Math.random() * 4000);
      return res.json({
        address,
        score: randomScore,
        scorePercent: (randomScore / 10000 * 100).toFixed(1),
        credentialCount: Math.floor(Math.random() * 10),
        averageRating: (2 + Math.random() * 3).toFixed(1),
        lastActivity: new Date(Date.now() - Math.random() * 86400 * 30 * 1000).toISOString(),
        source: 'random',
      });
    }

    // Try to get reputation score from blockchain
    try {
      const { reputationContract } = contracts;
      const reputationScore = await reputationContract.calculateReputationScore(address);
      
      // Convert BigInt to number safely
      const scoreNumber = Number(reputationScore);
      const scorePercent = (scoreNumber / 10000) * 100;

      // Get credentials
      const credentialHashes = await reputationContract.getCredentialHashes(address);

      res.json({
        address,
        score: scoreNumber,
        scorePercent: scorePercent.toFixed(1),
        credentialCount: credentialHashes.length,
        credentials: credentialHashes,
        lastUpdated: new Date().toISOString(),
        source: 'blockchain',
      });
    } catch (contractError) {
      // If blockchain call fails, return random data as fallback
      console.warn('⚠ Blockchain read failed, returning random data:', contractError.message);
      const randomScore = 4000 + Math.floor(Math.random() * 4000);
      return res.json({
        address,
        score: randomScore,
        scorePercent: (randomScore / 10000 * 100).toFixed(1),
        credentialCount: Math.floor(Math.random() * 10),
        averageRating: (2 + Math.random() * 3).toFixed(1),
        lastActivity: new Date(Date.now() - Math.random() * 86400 * 30 * 1000).toISOString(),
        source: 'random',
      });
    }
  } catch (error) {
    console.error('Error fetching reputation:', error.message);
    res.status(500).json({ error: 'Failed to fetch reputation score', details: error.message });
  }
});

/**
 * POST /api/projects
 * Creates a project (off-chain metadata)
 */
app.post('/api/projects', (req, res) => {
  const { clientAddress, freelancerAddress, amount, duration, description } = req.body;

  if (!clientAddress || !freelancerAddress || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const projectId = Math.floor(Math.random() * 1000000);
  const project = {
    id: projectId,
    clientAddress,
    freelancerAddress,
    amount,
    duration,
    description,
    createdAt: new Date(),
    state: 'created',
  };

  res.status(201).json(project);
});

/**
 * GET /api/projects/:projectId
 * Returns project details
 */
app.get('/api/projects/:projectId', (req, res) => {
  const { projectId } = req.params;

  res.json({
    id: projectId,
    state: 'completed',
    freelancer: '0x1234567890123456789012345678901234567890',
    client: '0x0987654321098765432109876543210987654321',
    amount: '1000000000000000000', // 1 ETH in wei
    reputationDiscount: 2000,
    createdAt: Date.now() - 86400 * 7 * 1000,
    deadline: Date.now() + 86400 * 7 * 1000,
  });
});

/**
 * POST /api/credentials/:projectId/mint
 * Mints a completion credential
 */
app.post('/api/credentials/:projectId/mint', (req, res) => {
  const { projectId } = req.params;
  const { freelancerAddress, clientAddress, satisfaction } = req.body;

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://skillbond.example/contexts/completion-v1',
    ],
    id: `https://skillbond.example/credentials/${projectId}`,
    type: ['VerifiableCredential', 'ProjectCompletionCredential'],
    issuer: {
      id: `did:ethr:${clientAddress}`,
    },
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: `did:ethr:${freelancerAddress}`,
      projectId,
      projectType: 'web-development',
      durationDays: 7,
      outcome: 'completed-satisfactorily',
      clientSatisfaction: satisfaction || 5,
    },
    proof: {
      type: 'EcdsaSecp256k1Signature2019',
      created: new Date().toISOString(),
      verificationMethod: `did:ethr:${clientAddress}#controller`,
      proofPurpose: 'assertionMethod',
      jws: 'mock-signature-' + Math.random().toString(36).substring(7),
    },
  };

  mockCredentials[projectId] = credential;

  res.status(201).json({
    credentialId: credential.id,
    hash: ethers.id(JSON.stringify(credential)),
    credential,
  });
});

/**
 * GET /api/credentials/:credentialId/verify
 * Verifies a credential
 */
app.get('/api/credentials/:credentialId/verify', (req, res) => {
  const { credentialId } = req.params;

  // Find credential in mock data
  const credential = Object.values(mockCredentials).find(c => c.id === `https://skillbond.example/credentials/${credentialId}`);

  if (!credential) {
    return res.status(404).json({ error: 'Credential not found' });
  }

  res.json({
    valid: true,
    credential,
    verifiedAt: new Date().toISOString(),
  });
});

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    contractsInitialized: contracts !== null,
  });
});

// Initialize contracts and start server
async function startServer() {
  try {
    console.log('\n🚀 SkillBond Backend Starting...\n');

    // Initialize contract connections
    contracts = await initializeContracts();
    console.log('✓ All contracts initialized successfully\n');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
}

startServer();
