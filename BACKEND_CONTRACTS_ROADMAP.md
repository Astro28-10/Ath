# 🔧 Your Backend & Contracts Roadmap (24 Hours)

**You are:** Backend + Smart Contracts Lead

---

## 🎯 Your Mission

Deploy contracts to Polygon Amoy testnet, wire them to the backend API, and create demo data so the Frontend Lead can build a working UI against real blockchain data.

---

## 📋 Phase Breakdown

### Phase 1: Setup (Hours 0-2) - COORDINATE WITH FRONTEND LEAD

**Your Tasks:**

1. **Environment Setup**
   ```bash
   git pull origin develop
   git checkout -b feature/contracts-deploy origin/develop
   cd contracts
   npm install
   ```

2. **Verify Contracts Compile**
   ```bash
   npm run compile
   ```
   - Should complete without errors
   - Check: `artifacts/contracts/` folder has JSON files
   - If errors: Fix them before moving forward

3. **Create .env file** (in `/contracts/` directory)
   ```env
   POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
   PRIVATE_KEY=0x... (your test wallet private key - NOT REAL FUNDS!)
   ```

4. **Create Test Wallet** (if you don't have one)
   - Go to: https://metamask.io (install if needed)
   - Create new wallet
   - Switch to Polygon Amoy network
   - Get address (0x...)
   - Get private key (Settings → Account Details → Show Private Key)

5. **Fund Test Wallet** (FREE!)
   ```
   Go to: https://faucet.polygon.technology/
   Select: Polygon Amoy
   Enter: Your wallet address
   Request: 0.5-1 MATIC
   Wait: 1-2 minutes (free testnet funds!)
   ```

6. **Update Status File**
   ```markdown
   ✅ BACKEND: Phase 1 complete
   - Environment setup: ✅
   - Contracts compiled: ✅
   - Test wallet funded: ✅ (0.5 MATIC)
   - Ready for Phase 2: ✅
   
   Frontend Status: [Check what they report]
   ```

---

### Phase 2: Deploy Contracts (Hours 2-6)

**Your Primary Focus - Frontend Depends on This**

#### Hour 2-3: Deploy to Polygon Amoy

```bash
cd contracts
npm run deploy
```

**Expected Output:**
```
Deploying SkillBond contracts...
✓ ReputationRegistry deployed to: 0xABC123...
✓ EscrowContract deployed to: 0xDEF456...

Deployment Summary:
{
  "reputationRegistry": "0xABC123...",
  "escrowContract": "0xDEF456...",
  "network": "amoy",
  "chainId": 80002,
  "timestamp": "..."
}
```

**What to do with these addresses:**
1. Copy them immediately
2. Save in a secure location (notepad for now)
3. Update `.env` file:
   ```env
   REPUTATION_REGISTRY_ADDRESS=0xABC123...
   ESCROW_CONTRACT_ADDRESS=0xDEF456...
   ```

**Verify on PolygonScan:**
- Go to: https://amoy.polygonscan.com/
- Search for your contract address
- Should see: Creation transaction, contract code, functions

#### Hour 3-4: Export Contract ABIs to Frontend

**Critical Step:** Frontend Lead is waiting for this!

```bash
# Navigate to artifacts
ls contracts/artifacts/contracts/

# You should see:
# - EscrowContract.sol/
#   - EscrowContract.json
# - ReputationRegistry.sol/
#   - ReputationRegistry.json
```

**Create Frontend ABIs File:**

Create file: `/frontend/lib/contractABIs.ts`

```typescript
// Import the ABIs from your artifacts
import EscrowContractJSON from '../../contracts/artifacts/contracts/EscrowContract.sol/EscrowContract.json';
import ReputationRegistryJSON from '../../contracts/artifacts/contracts/ReputationRegistry.sol/ReputationRegistry.json';

export const ESCROW_ABI = EscrowContractJSON.abi;
export const REPUTATION_ABI = ReputationRegistryJSON.abi;

export const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT;
export const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_REGISTRY;
export const CHAIN_ID = 80002;
```

**Push to Git:**
```bash
git add .
git commit -m "BE: Contract deployment complete, ABIs exported to frontend"
git push origin feature/contracts-deploy
```

**Notify Frontend Lead:**
- Send message: "✅ Contracts deployed! ABIs ready at `/frontend/lib/contractABIs.ts`"
- Frontend Lead can now continue with Phase 2c (wallet setup)

**Update Status File:**
```markdown
✅ BACKEND: Contracts deployed to Polygon Amoy
- ReputationRegistry: 0xABC123...
- EscrowContract: 0xDEF456...
- PolygonScan Links: [Paste links]
- ABIs exported to frontend: ✅

Note: Frontend Lead can start wallet integration now!
```

---

#### Hour 4-6: Setup Backend Contract Integration

**File:** `/backend/server.js`

1. **Add contract addresses to environment**
   - Create `/backend/.env`:
     ```env
     PORT=3001
     POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
     PRIVATE_KEY=0x...
     ESCROW_CONTRACT_ADDRESS=0xDEF456...
     REPUTATION_REGISTRY_ADDRESS=0xABC123...
     ```

2. **Create contract instances file:** `/backend/contracts.js`
   ```javascript
   const { ethers } = require('ethers');
   
   const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
   
   // ABIs (copy from /contracts/artifacts/)
   const ESCROW_ABI = [/* ... */];
   const REPUTATION_ABI = [/* ... */];
   
   const escrowContract = new ethers.Contract(
     process.env.ESCROW_CONTRACT_ADDRESS,
     ESCROW_ABI,
     wallet
   );
   
   const reputationContract = new ethers.Contract(
     process.env.REPUTATION_REGISTRY_ADDRESS,
     REPUTATION_ABI,
     wallet
   );
   
   module.exports = { escrowContract, reputationContract, provider, wallet };
   ```

3. **Update backend server.js**
   - Import the contracts file
   - Test contract reads (getReputation, getCredentials)
   - Add logging to verify connections

4. **Test backend**
   ```bash
   cd backend
   npm start
   
   # In another terminal, test:
   curl http://localhost:3001/api/reputation/0xYourAddress
   ```
   
   Should return reputation data from blockchain!

**Push to Git:**
```bash
git add .
git commit -m "BE: Backend connected to contracts, reading from blockchain"
git push origin feature/contracts-deploy
```

---

### Phase 3: Setup Demo Data (Hours 6-12)

**Your Secondary Focus - Critical for Demo**

#### Hour 6-9: Create Demo Account Population Script

**Why:** Frontend needs multiple test accounts with different reputation levels

**Create:** `/backend/scripts/populateReputation.js`

```javascript
const { ethers } = require('ethers');
require('dotenv').config();

const REPUTATION_ABI = [...]; // Copy from artifacts

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const registry = new ethers.Contract(
    process.env.REPUTATION_REGISTRY_ADDRESS,
    REPUTATION_ABI,
    wallet
  );

  // Demo freelancers with different reputation levels
  const demoAccounts = [
    {
      name: 'alice.eth',
      address: '0x111111...', // Use new test wallet
      targetScore: 95,
      projects: 50
    },
    {
      name: 'bob.eth',
      address: '0x222222...',
      targetScore: 72,
      projects: 15
    },
    {
      name: 'carol.eth',
      address: '0x333333...',
      targetScore: 40,
      projects: 2
    }
  ];

  for (const account of demoAccounts) {
    console.log(`\nPopulating credentials for ${account.name}...`);
    
    // Register multiple credentials to build reputation
    for (let i = 0; i < account.projects; i++) {
      const credentialHash = ethers.id(`credential-${account.address}-${i}`);
      
      try {
        const tx = await registry.registerCredential(
          account.address,
          credentialHash,
          wallet.address,
          8000 + Math.random() * 2000 // Random weight 80-100%
        );
        
        await tx.wait();
        console.log(`  ✓ Credential ${i + 1}/${account.projects} registered`);
      } catch (error) {
        console.error(`  ✗ Failed:`, error.message);
      }
    }
  }
  
  console.log('\n✅ Demo account population complete!');
}

main().catch(console.error);
```

**Fund Multiple Test Wallets:**
```bash
# For each demo account address (alice, bob, carol):
# Go to: https://faucet.polygon.technology/
# Request 0.5 MATIC for each
```

**Run Population Script:**
```bash
node scripts/populateReputation.js
```

**Verify Data Created:**
```bash
# Test endpoint
curl http://localhost:3001/api/reputation/0xalice...
# Should show: score: 9500, credentialCount: 50, averageRating: 4.8
```

**Update Status File:**
```markdown
✅ BACKEND: Demo accounts created
- alice.eth (0x111...): 95% reputation, 50 projects
- bob.eth (0x222...): 72% reputation, 15 projects  
- carol.eth (0x333...): 40% reputation, 2 projects
- All test wallets funded with 0.5 MATIC each

Frontend can now test with realistic data!
```

#### Hour 9-12: Credential Generation & Event Listeners

**Setup Event Listeners:**
- When project completes on blockchain
- Generate W3C Verifiable Credential (JSON format)
- Store on-chain hash

**File:** `/backend/eventListener.js`

```javascript
const { escrowContract } = require('./contracts');

function startEventListeners() {
  console.log('Starting contract event listeners...');
  
  escrowContract.on('CredentialMinted', (projectId, freelancer) => {
    console.log(`Credential minted for project ${projectId}`);
    console.log(`Freelancer: ${freelancer}`);
    // TODO: Generate W3C VC and store
  });
  
  console.log('Event listeners active!');
}

module.exports = { startEventListeners };
```

**Integration:**
- Start listeners in `server.js` on startup
- Log when credentials are emitted
- Test with actual transactions from frontend

---

### Phase 4: Testing & Validation (Hours 12-20)

**Your Focus: Ensure APIs Work**

#### API Testing Checklist

1. **Reputation Endpoint**
   ```bash
   curl http://localhost:3001/api/reputation/0xalice...
   # Should return: score, credentialCount, averageRating, lastActivity
   ```

2. **Project Endpoint**
   ```bash
   curl -X POST http://localhost:3001/api/projects \
     -H "Content-Type: application/json" \
     -d '{"freelancer":"0x...","client":"0x...","amount":100}'
   # Should return: projectId
   ```

3. **Credential Verification**
   ```bash
   curl http://localhost:3001/api/credentials/1/verify
   # Should return: credential data with proof
   ```

4. **Response Time**
   - All endpoints should respond in <500ms
   - If slower, optimize or add caching

#### Real Transaction Testing

1. **Create Project via Contract**
   - Have Frontend Lead create a project
   - Verify it appears in backend API
   - Show on PolygonScan

2. **Submit Deliverable**
   - Freelancer submits work
   - Verify backend records it
   - Log transaction hash

3. **Approve & Release**
   - Client approves completion
   - Verify payment released
   - Check contract state updated

**Document any bugs found:**
```markdown
## Bugs Found During Testing
- [ ] API timeout on /reputation endpoint (hour 15)
- [ ] Contract event not emitting (hour 16)
- All bugs fixed by hour 19
```

---

### Phase 5: Final Preparation (Hours 20-24)

#### Documentation

1. **Update README.md** with:
   - How to start backend: `npm start` (port 3001)
   - Contract addresses on Amoy
   - Demo account addresses
   - API endpoint list

2. **Create DEMO_SCRIPT.md**
   - Step-by-step flow
   - What to expect at each step
   - Fallback if something fails

#### Final Checks

- [ ] All APIs responding
- [ ] Contract deployments verified on PolygonScan
- [ ] Demo accounts with reputation data
- [ ] Credentials generating correctly
- [ ] Response times acceptable
- [ ] No console errors
- [ ] Code in git with clear commits

#### Merge to Develop

```bash
git checkout develop
git pull origin develop
git merge feature/contracts-deploy --no-ff
git push origin develop

# Tag for submission
git tag v1.0.0-mvp
git push origin v1.0.0-mvp
```

---

## 🔄 Coordination with Frontend Lead

### Status File Updates (Post These)

**Hour 2:** `✅ BACKEND: Setup complete, starting deployment`

**Hour 4:** `✅ BACKEND: Contracts deployed! ABIs exported to frontend`
- Frontend Lead sees this and unblocks

**Hour 6:** `✅ BACKEND: Backend integration complete, demo data seeding started`

**Hour 12:** `✅ BACKEND: Demo accounts populated, ready for E2E testing`

**Hour 20:** `✅ BACKEND: All APIs tested, data validated, ready for demo`

### When Frontend Lead Gets Blocked

**They'll post:**
```
⏸️ FRONTEND: Blocked on contract ABIs
```

**You respond:**
```
✅ BACKEND: ABIs ready at /frontend/lib/contractABIs.ts (time: 3:45 PM)
```

And they can continue!

---

## 🆘 Troubleshooting

### Contracts Won't Compile
- Check Solidity version: `npm list`
- Should be 0.8.24
- If wrong: `npm install solc@0.8.24`

### Deploy Fails
- Check wallet has enough MATIC (at least 0.1)
- Try alternative RPC: `https://1rpc.io/matic`
- Check .env PRIVATE_KEY format (must start with 0x)

### Contract Not on PolygonScan
- Wait 1-2 minutes (indexing time)
- Verify address is correct
- Try refreshing page

### APIs Timing Out
- Check backend is running: `npm start`
- Check port 3001 not in use: `lsof -i :3001`
- Check RPC connection: add console.log to verify

### Demo Data Not Showing
- Verify script ran successfully
- Check contract address correct
- Query blockchain directly: `npx hardhat console --network amoy`

---

## 📝 Success Criteria

By end of 24 hours:
- ✅ Contracts deployed to Polygon Amoy testnet
- ✅ Contract addresses verified on PolygonScan
- ✅ Backend running and all APIs working
- ✅ Demo accounts created with reputation data
- ✅ Event listeners setup and working
- ✅ End-to-end flow tested
- ✅ All code in git with clear commits
- ✅ Documentation complete
- ✅ Ready for demo presentation

---

## 📋 Minute-by-Minute Rough Timeline

```
Hour 0: Start
Hour 0-2: Setup (git, dependencies, test wallet)
Hour 2-3: Deploy contracts to Amoy
Hour 3-4: Export ABIs, notify frontend
Hour 4-6: Backend integration
Hour 6-9: Demo account population
Hour 9-12: Event listeners & testing
Hour 12-20: Full testing & bug fixes
Hour 20-24: Final polish, merge, demo prep
```

---

## 🚀 You've Got This!

Remember:
- ✅ You're 78% done already
- ✅ Contracts and backend are mostly written
- ✅ Just need to wire them together
- ✅ Frontend Lead handles the UI
- ✅ You focus on blockchain/backend
- ✅ Status file keeps you in sync

**Start now. Good luck! 🚀**

---

**Your Start Time:** NOW  
**Target Completion:** 24 hours  
**Status Updates:** Every 2 hours to status file
