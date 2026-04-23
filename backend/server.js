require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data for reputation scores
const reputationScores = {
  '0x1234567890123456789012345678901234567890': {
    score: 8500, // 85%
    credentialCount: 12,
    averageRating: 4.8,
    lastActivity: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  '0x0987654321098765432109876543210987654321': {
    score: 7200, // 72%
    credentialCount: 5,
    averageRating: 4.2,
    lastActivity: new Date(Date.now() - 86400 * 3 * 1000).toISOString(),
  },
};

// Mock credentials for demo
const mockCredentials = {};

// API Routes

/**
 * GET /api/reputation/:address
 * Returns reputation score for a freelancer
 */
app.get('/api/reputation/:address', (req, res) => {
  const address = req.params.address.toLowerCase();

  if (reputationScores[address]) {
    return res.json({
      address,
      ...reputationScores[address],
    });
  }

  // Generate random reputation for unknown addresses (for demo)
  const randomScore = 4000 + Math.floor(Math.random() * 4000); // 40-80%
  res.json({
    address,
    score: randomScore,
    credentialCount: Math.floor(Math.random() * 10),
    averageRating: (2 + Math.random() * 3).toFixed(1),
    lastActivity: new Date(Date.now() - Math.random() * 86400 * 30 * 1000).toISOString(),
  });
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
