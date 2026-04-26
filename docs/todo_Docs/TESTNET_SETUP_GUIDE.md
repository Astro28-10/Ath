# SkillBond Testnet Setup & Presentation Guide
**For Judges, Teams, and Demo Setup**

---

## 🎯 Overview

This guide explains how to set up and demonstrate SkillBond using **Polygon Amoy Testnet** (free, no real funds required). It includes wallet creation, test fund distribution, reputation population, and a complete demo script.

**Cost:** $0 (Testnet only - completely free)  
**Time to Setup:** ~30-45 minutes  
**Difficulty:** Beginner-friendly (step-by-step)

---

## Part 1: Prerequisites & Environment Setup

### What You Need
- Computer with internet connection
- MetaMask or similar wallet extension installed
- Node.js 18+ (for running backend/contracts)
- Git for cloning repository
- Browser (Chrome/Edge/Firefox recommended)

### Installation Steps

#### 1.1 Install MetaMask (If Not Already Installed)
1. Go to https://metamask.io/download/
2. Download extension for your browser
3. Create new wallet and save seed phrase safely
4. DO NOT use real funds - this is testnet only

#### 1.2 Add Polygon Amoy Network to MetaMask
1. Open MetaMask
2. Click network dropdown (top-left) → "Add network"
3. Enter details:
   - **Network Name:** Polygon Amoy
   - **RPC URL:** https://rpc-amoy.polygon.technology
   - **Chain ID:** 80002
   - **Currency Symbol:** MATIC
   - **Block Explorer:** https://amoy.polygonscan.com/

4. Click "Save"
5. Switch to Polygon Amoy network

#### 1.3 Get Your Wallet Address
1. In MetaMask, click on your account
2. Select "Copy account address"
3. Save for next steps (looks like: `0x742d35Cc6634C0532925a3b844Bc9e7595f42438`)

---

## Part 2: Create Multiple Test Wallets & Fund with Testnet MATIC

### Why Multiple Wallets?
To show different scenarios:
- **Client Wallet:** Creates and funds projects
- **Freelancer Wallet:** Completes work, earns reputation
- **Verifier Wallet:** Tests credential verification

### Method 1: Create Multiple Accounts in MetaMask (Recommended)

**Step 1: Create New Account**
1. MetaMask → Click account icon (top-right)
2. Click "Create account"
3. Name it: "Client Account"
4. Copy the address

**Repeat 3-4 times to create:**
- Client Account 1 (0xClient...)
- Freelancer Account 1 (0xFreelancer1...)
- Freelancer Account 2 (0xFreelancer2...)
- Verifier Account (0xVerifier...)

**Step 2: Save All Addresses**
```
CLIENT_WALLET_1=0x...
FREELANCER_WALLET_1=0x...
FREELANCER_WALLET_2=0x...
VERIFIER_WALLET=0x...
```

### Method 2: Use a Test Wallet Generator (Alternative)

If you prefer to generate wallets programmatically:

```bash
# Install ethers.js if needed
npm install ethers

# Create file: generateTestWallets.js
const { ethers } = require('ethers');

for (let i = 0; i < 5; i++) {
  const wallet = ethers.Wallet.createRandom();
  console.log(`Wallet ${i + 1}:`);
  console.log(`  Address: ${wallet.address}`);
  console.log(`  Private Key: ${wallet.privateKey}`);
  console.log('---');
}

# Run it
node generateTestWallets.js
```

### Step 3: Fund Wallets with Testnet MATIC

**Using Polygon Faucet:**

1. Go to https://faucet.polygon.technology/
2. Select **Polygon Amoy** (dropdown)
3. Enter your wallet address (Client Account 1)
4. Solve CAPTCHA
5. Click "Submit"
6. Wait 1-2 minutes - you'll receive **0.5 MATIC** (free!)
7. **Repeat for each wallet** (do 3-5 wallets minimum)

**Verification:**
- Open MetaMask
- You should see balance of 0.5 MATIC
- Can view on Amoy PolygonScan: https://amoy.polygonscan.com/

**Note:** Faucet may have daily limits. If needed, try these alternatives:
- https://www.alchemy.com/faucets/polygon-amoy (Alchemy faucet)
- Twitter/Discord faucets (may vary)

---

## Part 3: Deploy Smart Contracts to Testnet

### Step 1: Clone & Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd SkillBond_MVP/contracts

# Install dependencies
npm install

# Verify compilation
npm run compile
```

### Step 2: Create Environment File

Create `/contracts/.env`:

```env
# Polygon Amoy RPC
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology

# Your deployer wallet private key (from a test wallet - NO REAL FUNDS!)
# Get from MetaMask: Settings → Account Details → Show Private Key
PRIVATE_KEY=0xYourTestWalletPrivateKeyHere

# Optional: Etherscan API Key for verification
ETHERSCAN_API_KEY=your_key_here
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` to git
- Never use real wallet private keys
- Test wallets only
- Add `.env` to `.gitignore`

### Step 3: Deploy Contracts

```bash
# Deploy to Polygon Amoy testnet
npm run deploy

# Expected output:
# ✓ ReputationRegistry deployed to: 0xABC...
# ✓ EscrowContract deployed to: 0xDEF...
# 
# Deployment Summary:
# {
#   "reputationRegistry": "0xABC123...",
#   "escrowContract": "0xDEF456...",
#   "network": "amoy",
#   "chainId": 80002,
#   "timestamp": "2026-04-24T..."
# }
```

### Step 4: Save Contract Addresses

Copy the deployed addresses to `.env`:

```env
NEXT_PUBLIC_REPUTATION_REGISTRY=0xABC123...
NEXT_PUBLIC_ESCROW_CONTRACT=0xDEF456...
NEXT_PUBLIC_CHAIN_ID=80002
```

### Step 5: Verify on PolygonScan

1. Go to https://amoy.polygonscan.com/
2. Search for your contract address
3. You should see:
   - Creation transaction
   - Contract code
   - Function list
   - Events

**Example:** https://amoy.polygonscan.com/address/0xABC123...

---

## Part 4: Setup Backend Server

### Step 1: Navigate to Backend

```bash
cd SkillBond_MVP/backend
npm install
```

### Step 2: Create Environment File

Create `/backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Polygon Amoy
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
PRIVATE_KEY=0xYourBackendWalletPrivateKey

# Contract Addresses (from deployment above)
ESCROW_CONTRACT_ADDRESS=0xDEF456...
REPUTATION_REGISTRY_ADDRESS=0xABC123...

# Database (optional - not required for MVP)
DATABASE_URL=sqlite:./skillbond.db

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start Backend Server

```bash
npm start

# Expected output:
# Server running on port 3001
# ✓ Connected to Polygon Amoy RPC
# ✓ Contract listeners initialized
# Ready to accept requests!
```

### Step 4: Test Backend

```bash
# In another terminal, test the API
curl http://localhost:3001/api/reputation/0x742d35Cc6634C0532925a3b844Bc9e7595f42438

# Expected response:
# {
#   "address": "0x742d35cc...",
#   "reputationScore": 8500,
#   "credentialCount": 12,
#   "averageRating": 4.8
# }
```

---

## Part 5: Setup Frontend

### Step 1: Navigate to Frontend

```bash
cd SkillBond_MVP/frontend
npm install
```

### Step 2: Create Environment File

Create `/frontend/.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Contract Addresses
NEXT_PUBLIC_ESCROW_CONTRACT=0xDEF456...
NEXT_PUBLIC_REPUTATION_REGISTRY=0xABC123...
NEXT_PUBLIC_CHAIN_ID=80002

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Step 3: Start Frontend

```bash
npm run dev

# Expected output:
# ▲ Next.js 16.2.4
# - Local: http://localhost:3000
# - Environments: .env.local
# ✓ Ready in 2.5s
```

### Step 4: Test Frontend

1. Open browser to http://localhost:3000
2. You should see:
   - SkillBond homepage
   - Leaderboard with demo freelancers
   - Navigation menu

---

## Part 6: Populate Reputation Data for Demo

### Why Populate Data?
- Show realistic freelancer profiles with history
- Demonstrate reputation-weighted escrow discounts
- Prove the reputation system works

### Method 1: Use Backend Script

**Create `/backend/scripts/populateData.js`:**

```javascript
const { ethers } = require('ethers');

// Contract ABIs (simplified)
const REPUTATION_ABI = [
  'function registerCredential(address freelancer, bytes32 hash, address issuer, uint256 weight) external'
];

async function main() {
  const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const registry = new ethers.Contract(
    process.env.REPUTATION_REGISTRY_ADDRESS,
    REPUTATION_ABI,
    wallet
  );

  // Demo freelancers
  const freelancers = [
    { name: 'Alice', address: '0xFreelancer1Address', score: 95 },
    { name: 'Bob', address: '0xFreelancer2Address', score: 87 },
    { name: 'Carol', address: '0xFreelancer3Address', score: 72 },
  ];

  for (const freelancer of freelancers) {
    console.log(`Registering credentials for ${freelancer.name}...`);
    
    // Register 10 credentials for each freelancer
    for (let i = 0; i < 10; i++) {
      const credentialHash = ethers.id(`credential-${freelancer.address}-${i}`);
      
      const tx = await registry.registerCredential(
        freelancer.address,
        credentialHash,
        wallet.address,  // issuer
        8000 + Math.random() * 2000  // weight 80-100%
      );
      
      await tx.wait();
      console.log(`  ✓ Credential ${i + 1} registered`);
    }
  }
  
  console.log('✅ All credentials populated!');
}

main().catch(console.error);
```

**Run it:**
```bash
node scripts/populateData.js
```

### Method 2: Use Hardhat Console (Interactive)

```bash
npx hardhat console --network amoy

# In console:
> const registry = await ethers.getContractAt('ReputationRegistry', '0xABC123...')
> const freelancer = '0xFreelancer1Address'
> const hash = ethers.id('credential-1')
> const tx = await registry.registerCredential(freelancer, hash, signer.address, 9000)
> await tx.wait()
> console.log('✓ Credential registered!')
```

### Method 3: Direct API Call (Easiest)

If backend has seeded data built-in:

```bash
curl -X POST http://localhost:3001/api/seed-demo-data

# Expected response:
# {
#   "status": "success",
#   "freelancers": [
#     { "address": "0x...", "credentials": 10, "score": 95 },
#     ...
#   ]
# }
```

---

## Part 7: Create Multiple Account Scenarios

### Scenario 1: High-Reputation Freelancer

**Create a "superstar" account with:**
- 50+ completed projects
- Average rating: 4.9/5.0
- Reputation score: 9500 (95%)
- Gets 25% escrow discount

**Demo talking points:**
- "This freelancer has proven track record"
- "Higher discount on escrow costs"
- "Lower risk for client"

### Scenario 2: New Freelancer

**Create a "newcomer" account with:**
- 2-3 completed projects
- Average rating: 3.5/5.0
- Reputation score: 4000 (40%)
- Gets 0% escrow discount (new user)

**Demo talking points:**
- "This freelancer just starting out"
- "Needs to build reputation"
- "Pay full escrow to verify legitimacy"

### Scenario 3: Mid-Tier Freelancer

**Create a "growing" account with:**
- 15-20 completed projects
- Average rating: 4.3/5.0
- Reputation score: 7200 (72%)
- Gets 10% escrow discount

**Demo talking points:**
- "Solid performer, consistently reliable"
- "Moderate discount on fees"
- "Good balance of risk vs. efficiency"

### Setup Script Template

```bash
#!/bin/bash
# setup-demo-accounts.sh

echo "Creating demo accounts..."

# Scenario 1: Superstar
SUPERSTAR_ADDR="0xSuperstarAddress"
curl -X POST http://localhost:3001/api/freelancers \
  -H "Content-Type: application/json" \
  -d "{
    \"address\": \"$SUPERSTAR_ADDR\",
    \"name\": \"alice.eth\",
    \"credentials\": 50,
    \"averageRating\": 4.9,
    \"reputationScore\": 9500,
    \"bio\": \"Full-stack developer with 50+ successful projects\"
  }"

# Scenario 2: Newcomer
NEWCOMER_ADDR="0xNewcomerAddress"
curl -X POST http://localhost:3001/api/freelancers \
  -H "Content-Type: application/json" \
  -d "{
    \"address\": \"$NEWCOMER_ADDR\",
    \"name\": \"bob.eth\",
    \"credentials\": 2,
    \"averageRating\": 3.5,
    \"reputationScore\": 4000,
    \"bio\": \"Emerging developer, eager to build reputation\"
  }"

# Scenario 3: Mid-tier
MIDTIER_ADDR="0xMidtierAddress"
curl -X POST http://localhost:3001/api/freelancers \
  -H "Content-Type: application/json" \
  -d "{
    \"address\": \"$MIDTIER_ADDR\",
    \"name\": \"carol.sol\",
    \"credentials\": 18,
    \"averageRating\": 4.3,
    \"reputationScore\": 7200,
    \"bio\": \"Reliable developer with growing portfolio\"
  }"

echo "✅ Demo accounts created!"
echo "Superstar: $SUPERSTAR_ADDR"
echo "Newcomer: $NEWCOMER_ADDR"
echo "Mid-tier: $MIDTIER_ADDR"
```

---

## Part 8: Complete Demo Script (5-Minute Walkthrough)

### Pre-Demo Checklist ✅

- [ ] All three local servers running (backend, frontend, contracts)
- [ ] MetaMask connected to Polygon Amoy
- [ ] Test wallets funded with MATIC
- [ ] Demo accounts populated with reputation data
- [ ] Browser open to http://localhost:3000
- [ ] Terminal ready to show contract interactions

### Demo Timeline (Exactly 5 Minutes)

**Time 0:00-0:30 (Problem) - 30 seconds**

"Freelancers lose $X billion annually to non-payment. Payment holds cost 5-10% in fees. How do we build trust?"

*Show slide: "58% of freelancers face non-payment"*

---

**Time 0:30-1:30 (Solution Overview) - 60 seconds**

*Switch to SkillBond homepage*

"SkillBond uses reputation as collateral. Proven freelancers qualify for lower escrow costs. Upon completion, both parties get portable, verifiable credentials."

*Highlight on screen:*
- Leaderboard showing Alice (95%), Bob (87%), Carol (72%)
- Show reputation scores
- Point out potential discount amounts

---

**Time 1:30-2:30 (Live Demo - Create Project) - 60 seconds**

*Switch MetaMask to "Client Account"*

"Let's create a project. I'll hire Alice - our top performer."

1. Click "Client Dashboard"
2. Fill form:
   - Freelancer: `0xAlice...`
   - Amount: 100 MATIC
   - Duration: 14 days
   - Description: "Build landing page"
3. Click "Create Project"
4. MetaMask popup appears
5. Sign transaction
6. Show confirmation: "✓ Project created, ID: #12345"

*Point to screen:*
- "Notice the escrow discount: 25% off for high-reputation freelancer"
- "Without reputation, this would cost 110 MATIC (10% fee). Now costs 75 MATIC!"

---

**Time 2:30-3:30 (Live Demo - Complete Project) - 60 seconds**

*Switch MetaMask to "Freelancer Account (Alice)"*

"Alice receives the project and completes the work."

1. Go to Freelancer Dashboard
2. Show project: "$100 MATIC for landing page"
3. Click "Submit Deliverable"
4. Submit hash: `QmXxxx...` (IPFS hash)
5. Sign transaction
6. Show confirmation

*Switch back to Client Account*

"As the client, I verify the work and approve."

1. Go to Project History
2. Click "Approve Completion"
3. Sign approval transaction
4. Show: "✓ Payment released to freelancer"

---

**Time 3:30-4:30 (Credentials & Portability) - 60 seconds**

*Switch to Freelancer Account → Portfolio page*

"Most importantly - Alice now has a verifiable credential."

1. Show Portfolio page
2. Click on newly-created credential
3. Show the W3C Verifiable Credential JSON:
   ```json
   {
     "issuer": "0xClientAddress",
     "subject": "0xAliceAddress",
     "projectType": "web-development",
     "outcome": "completed-satisfactorily",
     "clientSatisfaction": 5,
     "proof": "0x1234..."
   }
   ```
4. Click "Share" → Show QR code
5. Click "Verify" on another device/browser to show verification

*Point to screen:*
- "This credential is portable - works across ANY platform"
- "Not locked into one service like Upwork or Fiverr"
- "The signature proves the client issued it"

---

**Time 4:30-5:00 (Impact & Next Steps) - 30 seconds**

"With SkillBond, freelancers build reputation independently. Smart platforms can verify credentials and offer lower costs."

*Show final slide with metrics:*
- Freelancers: ↑ 25% lower fees, faster payments
- Clients: ↑ Confidence in hiring, transparent disputes
- Platforms: ↑ Lower support costs, better retention

**Questions?**

---

## Part 9: Backup Plan (If Something Breaks)

### If Smart Contract Deployment Fails

```bash
# Option 1: Use local Hardhat network
npm run deploy:local

# Option 2: Use pre-deployed addresses
# Create .env with known working addresses
# Ask organizers for test contract addresses
```

### If Backend Server Crashes

```bash
# Restart it
cd backend
npm start

# Or show API responses from terminal logs
# Demonstrate with curl commands instead
curl http://localhost:3001/api/reputation/0x...
```

### If Frontend Won't Load

```bash
# Check port not in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Restart
npm run dev
```

### If MetaMask Connection Fails

1. Manually switch to Polygon Amoy in MetaMask
2. Show that it's already connected
3. Demonstrate API calls via terminal/curl
4. Show credentials on PolygonScan directly

### If Running Out of Time

**Minimum 3-minute demo:**
1. Show homepage + leaderboard (30 sec)
2. Show contract on PolygonScan (30 sec)
3. Show credential JSON in browser (30 sec)
4. Show code: EscrowContract.sol (30 sec)
5. Explain architecture (30 sec)

**Total:** 3 minutes, no live transactions needed

---

## Part 10: Presenting Key Metrics to Judges

### Reputation Score Calculation

```
Reputation Score = Weighted Average of all credentials

Formula:
score = (sum of (credential_weight × credential_value)) / sum(weights)

Example for Alice:
- 50 credentials from verified clients
- Average rating: 4.9/5 → value = 98%
- Recent projects weighted higher
- Result: 95% reputation score

Escrow Discount Calculation:
discount = (reputation_score - 50%) / 2
- Alice (95%): (95 - 50) / 2 = 22.5% discount
- Bob (87%): (87 - 50) / 2 = 18.5% discount
- Carol (72%): (72 - 50) / 2 = 11% discount
```

### Show on Screen

```
PROJECT: Web Development Landing Page
═════════════════════════════════════════════════

Freelancer: Alice (alice.eth)
Reputation Score: ⭐⭐⭐⭐⭐ 95/100
Projects Completed: 47
Average Rating: 4.9/5

Escrow Details:
  Base Amount: 100 MATIC
  Traditional Fee (10%): 10 MATIC
  Total with traditional: 110 MATIC
  
  SkillBond Discount: -22% (for Alice's reputation)
  SkillBond Fee: 7.8 MATIC
  Total with SkillBond: 107.8 MATIC
  
💰 SAVINGS: 2.2 MATIC (2% lower cost!)
⚡ BENEFIT: Faster payment release (automated)
```

---

## Part 11: Contract Interaction Tracking (Show on PolygonScan)

### After Running Demo, Show These on PolygonScan

Go to: https://amoy.polygonscan.com/

**Example Transaction URLs:**

1. **Contract Deployment:**
   - https://amoy.polygonscan.com/tx/0xXXX
   - "Shows the contract was successfully deployed"

2. **Create Project:**
   - https://amoy.polygonscan.com/tx/0xYYY
   - "Shows project creation with escrow lock"
   - Highlight: Input data showing function call

3. **Register Credential:**
   - https://amoy.polygonscan.com/tx/0xZZZ
   - "Shows credential hash stored on-chain"

4. **Contract Address:**
   - https://amoy.polygonscan.com/address/0x...
   - "Contract code is visible and verified"
   - "Anyone can read the logic"

---

## Part 12: Common Judge Questions & Answers

### Q1: "Why use blockchain instead of a centralized database?"

**A:** "Blockchain provides:
- **Cryptographic proof** - signatures can't be forged
- **Portability** - freelancer can prove reputation on ANY platform
- **Immutability** - cannot retroactively change reputation
- **No single point of failure** - doesn't depend on our company staying in business"

### Q2: "How do you prevent reputation fraud?"

**A:** "Three mechanisms:
1. **Issuer verification** - only clients who paid can issue credentials
2. **Weight system** - credentials from top platforms worth more
3. **On-chain hash** - full VC stored off-chain, hash on-chain prevents tampering
4. **Future: Decentralized arbitration** - disputes resolved by jury, not our company"

### Q3: "What happens if Polygon network goes down?"

**A:** "SkillBond can:
1. **Immediately switch** to Arbitrum, Optimism, or other chains
2. **Use alternative RPC** providers (Alchemy, Infura, QuickNode)
3. **Fall back** to centralized database for new transactions
4. **Sync** blockchain state once network recovers"

### Q4: "How do you scale this to millions of users?"

**A:** "Multiple strategies:
1. **Layer 2 solutions** - Polygon already costs <$0.01/transaction
2. **Batching** - combine 100 credentials into 1 transaction
3. **Sidechains** - domain-specific chains for specific use cases
4. **Rollups** - near-instant finality with monthly settlement
5. **Off-chain credentials** - IPFS for full VC, blockchain only for hash"

### Q5: "Is this actually decentralized?"

**A:** "We've designed it to be:
- **Today (MVP)** - Centralized backend, decentralized credentials
- **Tomorrow** - Decentralized backend via IPFS
- **Later** - Decentralized dispute resolution via DAO
- **The key:** Credentials remain portable even if we shut down"

### Q6: "What about regulatory compliance?"

**A:** "We're addressing:
- **KYC/AML** - freelancer verification (future: ZK-proof of ID)
- **Tax reporting** - transactions on-chain for audits
- **Dispute resolution** - arbitration rules documented on-chain
- **Data privacy** - selective disclosure of credentials"

---

## Part 13: Testnet Troubleshooting

| Problem | Solution |
|---------|----------|
| MetaMask won't connect to Polygon Amoy | Try different RPC: https://1rpc.io/matic or https://polygon-rpc.com |
| Faucet rate limited / "Try again later" | Wait 24 hours or try alternative faucet (Alchemy) |
| Transaction failed - "Insufficient gas" | Increase gas limit or request more testnet MATIC |
| Contract deployment fails | Check Solidity version matches hardhat config (0.8.24) |
| Backend can't connect to RPC | Check internet connection, try different RPC endpoint |
| Frontend shows blank page | Check browser console for errors, ensure backend is running |
| Wallet won't sign transaction | Unlock MetaMask, make sure on correct network |
| PolygonScan shows "Not verified" | Contracts automatically verified if deployed with Hardhat/Foundry |

---

## Final Notes

### Remember:
- ✅ All testnet funds are free and worthless
- ✅ No real money is at risk
- ✅ Anyone can create unlimited test wallets
- ✅ Transactions are instant (2-5 seconds)
- ✅ Can reset by creating new wallets anytime

### Best Practices:
- Keep `.env` with private keys in separate, non-committed file
- Use different wallet for backend (contract interactions) vs demo
- Save all contract addresses in documentation
- Take screenshots of successful deployments as backup
- Record screen before showing to judges (backup video)

### Resources:
- Polygon Docs: https://polygon.technology/developers
- Ethers.js: https://docs.ethers.org
- MetaMask Docs: https://docs.metamask.io
- Amoy Faucet: https://faucet.polygon.technology
- PolygonScan: https://amoy.polygonscan.com

---

**Document Version:** 1.0  
**Created:** 2026-04-24  
**Valid for:** Polygon Amoy Testnet  
**Network Cost:** $0.00 (completely free)
