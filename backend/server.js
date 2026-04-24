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

// ENS name to address mapping for demo (no actual ENS, just for demo)
const ensMapping = {
  'alice.eth': '0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d',
  'bob.eth': '0x1234567890123456789012345678901234567890',
  'carol.eth': '0x0987654321098765432109876543210987654321',
};

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
    let address = req.params.address;
    const addressLower = address.toLowerCase();

    // Try to resolve ENS names to addresses
    if (ensMapping[addressLower]) {
      address = ensMapping[addressLower];
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address format. Use address (0x...) or ENS name (alice.eth, bob.eth, carol.eth)' });
    }

    // Normalize address to lowercase for lookups
    const addressResolved = ethers.getAddress(address).toLowerCase();

    // Check if we have demo data for this address
    if (demoReputationData[addressResolved]) {
      const demoData = demoReputationData[addressResolved];
      return res.json({
        address: ethers.getAddress(address),
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
        address: ethers.getAddress(address),
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
 * Creates a project on blockchain
 */
app.post('/api/projects', async (req, res) => {
  try {
    const { freelancer, amount, duration, deliverableHash, description } = req.body;

    // Validate inputs
    if (!freelancer || !amount || !duration) {
      return res.status(400).json({ error: 'Missing required fields: freelancer, amount, duration' });
    }

    if (!ethers.isAddress(freelancer)) {
      return res.status(400).json({ error: 'Invalid freelancer address' });
    }

    if (!contracts) {
      return res.status(503).json({ error: 'Contracts not initialized' });
    }

    const { escrowContract, wallet } = contracts;
    
    // Parse amount (convert from POL to wei)
    let amountInWei;
    try {
      amountInWei = ethers.parseEther(amount.toString());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid amount format' });
    }

    // Generate deliverable hash if not provided
    const hash = deliverableHash || ethers.id(description || 'placeholder-deliverable');
    
    // Create project on blockchain
    console.log(`Creating project: freelancer=${freelancer}, amount=${amount} POL`);
    const tx = await escrowContract.createProject(
      freelancer,
      amountInWei,
      0, // reputation discount
      BigInt(duration),
      hash,
      { gasLimit: 300000 }
    );

    const receipt = await tx.wait();
    console.log(`✓ Project created: ${receipt.transactionHash}`);

    // Extract project ID from transaction (if available)
    const projectId = receipt.blockNumber || Math.floor(Math.random() * 1000000);

    res.status(201).json({
      success: true,
      projectId,
      transactionHash: receipt.transactionHash,
      status: 'created',
      details: {
        freelancer,
        amount,
        duration,
        deliverableHash: hash,
      },
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

/**
 * POST /api/projects/:projectId/fund
 * Funds a project (sends POL to escrow)
 */
app.post('/api/projects/:projectId/fund', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Missing amount' });
    }

    if (!contracts) {
      return res.status(503).json({ error: 'Contracts not initialized' });
    }

    const { escrowContract, wallet } = contracts;

    // Parse amount
    const amountInWei = ethers.parseEther(amount.toString());

    // Fund project
    console.log(`Funding project ${projectId} with ${amount} POL`);
    const tx = await escrowContract.fundProject(BigInt(projectId), {
      value: amountInWei,
      gasLimit: 200000,
    });

    const receipt = await tx.wait();
    console.log(`✓ Project funded: ${receipt.transactionHash}`);

    res.status(200).json({
      success: true,
      projectId,
      transactionHash: receipt.transactionHash,
      amount,
      status: 'funded',
      fundedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error funding project:', error.message);
    res.status(500).json({ error: 'Failed to fund project', details: error.message });
  }
});

/**
 * POST /api/projects/:projectId/complete
 * Completes a project and releases escrow
 */
app.post('/api/projects/:projectId/complete', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!contracts) {
      return res.status(503).json({ error: 'Contracts not initialized' });
    }

    const { escrowContract } = contracts;

    // Complete project
    console.log(`Completing project ${projectId}`);
    const tx = await escrowContract.approveCompletion(BigInt(projectId), {
      gasLimit: 200000,
    });

    const receipt = await tx.wait();
    console.log(`✓ Project completed: ${receipt.transactionHash}`);

    res.status(200).json({
      success: true,
      projectId,
      transactionHash: receipt.transactionHash,
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error completing project:', error.message);
    res.status(500).json({ error: 'Failed to complete project', details: error.message });
  }
});

/**
 * GET /api/projects/:projectId
 * Returns project details
 */
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!contracts) {
      return res.status(503).json({ error: 'Contracts not initialized' });
    }

    const { escrowContract } = contracts;

    // Get project from blockchain
    const project = await escrowContract.getProject(BigInt(projectId));

    res.json({
      projectId,
      client: project[0],
      freelancer: project[1],
      amount: project[2].toString(),
      budget: ethers.formatEther(project[2]),
      reputationDiscount: Number(project[3]),
      state: Number(project[4]),
      deadline: Number(project[5]) * 1000,
      createdAt: Number(project[6]) * 1000,
      deliverableHash: project[7],
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({ error: 'Failed to fetch project', details: error.message });
  }
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
 * GET /
 * Root endpoint - Welcome message
 */
app.get('/', (req, res) => {
  res.json({
    app: 'SkillBond MVP',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to SkillBond backend API',
    apiDocs: 'Available at /api/health',
    endpoints: [
      'GET /api/health',
      'GET /api/reputation/:address',
      'POST /api/projects',
      'GET /api/projects/:id',
      'POST /api/projects/:id/fund',
      'POST /api/projects/:id/complete',
      'POST /api/credentials/:id/mint',
    ],
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
