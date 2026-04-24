# Developer Work Division Plan - 2 Person Team
**SkillBond MVP - Final 24 Hours**

---

## 📋 Team Structure

### Team Member 1: **Backend/Contracts Lead**
- Primary: Smart Contracts & Backend API
- Secondary: Infrastructure & Testing

### Team Member 2: **Frontend Lead**
- Primary: Frontend & UI Integration
- Secondary: Wallet Integration & User Testing

---

## 🔀 Git Strategy to Prevent Merge Conflicts

### Branch Architecture

```
main (protected, only for final submission)
 ├── develop (integration branch)
 │   ├── feature/contracts (BE Lead)
 │   ├── feature/backend-api (BE Lead)
 │   ├── feature/frontend-ui (FE Lead)
 │   ├── feature/wallet-integration (FE Lead - final integration)
 │   └── feature/credentials (BE + FE - minimal overlap)
```

### Ground Rules to Avoid Conflicts

1. **Separate Folders for Each Developer**
   - Backend Lead: `/backend/`, `/contracts/`
   - Frontend Lead: `/frontend/app/`
   - Shared: `/docs/`, `/package.json` (communicate before editing)

2. **No Overlapping Files** (Pre-agreed)
   - ❌ Both editing same file → merge conflicts
   - ✅ Each person owns specific files → clean merges

3. **Commit Frequently with Clear Messages**
   ```
   git commit -m "BE: Add fund escrow function"
   git commit -m "FE: Add wallet connection button"
   git commit -m "SHARED: Update README deployment section"
   ```

4. **Pull Before Push**
   ```bash
   git pull origin develop
   git push origin feature/your-branch
   ```

5. **Communication Protocol**
   - Before modifying `/docs/`, `/package.json`, or `hardhat.config.js` → Slack/message first
   - Changes to shared files → create PR and review together

---

## 👤 Backend/Contracts Lead - Work Assignment

**Time Allocation:** 24 hours
- Contracts: 6 hours
- Backend: 8 hours  
- Integration: 6 hours
- Testing: 3 hours
- Buffer: 1 hour

### Phase 1: Contracts Setup (Hours 1-6)

**Objective:** Deploy contracts to testnet, verify on explorer

**Tasks:**
1. **Hour 1-2: Contract Compilation & Testing**
   - [ ] Review `EscrowContract.sol` and `ReputationRegistry.sol`
   - [ ] Run `npm run compile` in `/contracts/`
   - [ ] Run `npm run test` to verify all unit tests pass
   - [ ] Fix any compilation errors
   - **Branch:** `feature/contracts`

2. **Hour 2-3: Testnet Configuration**
   - [ ] Create `.env` file in `/contracts/` with:
     ```env
     POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
     PRIVATE_KEY=0x... (your test wallet private key)
     ```
   - [ ] Verify `hardhat.config.js` network settings
   - [ ] Test local deployment: `npx hardhat run scripts/deploy.js --network hardhat`
   - **Branch:** `feature/contracts`

3. **Hour 3-5: Deploy to Amoy Testnet**
   - [ ] Fund test wallet with MATIC from faucet
     - Go to: https://faucet.polygon.technology/
     - Request 0.1-1 MATIC
   - [ ] Deploy: `npm run deploy` (or `npx hardhat run scripts/deploy.js --network amoy`)
   - [ ] Copy deployed contract addresses from output
   - [ ] Create `.env` with contract addresses:
     ```env
     NEXT_PUBLIC_ESCROW_ADDRESS=0x...
     NEXT_PUBLIC_REPUTATION_ADDRESS=0x...
     NEXT_PUBLIC_CHAIN_ID=80002
     ```
   - **Branch:** `feature/contracts`

4. **Hour 5-6: Export ABIs for Frontend**
   - [ ] Copy contract ABIs from `/contracts/artifacts/`
   - [ ] Create `/frontend/lib/contractABIs.ts`:
     ```typescript
     export const ESCROW_ABI = [...]; // From artifacts
     export const REPUTATION_ABI = [...]; // From artifacts
     ```
   - [ ] Verify ABIs in artifacts folder
   - [ ] Test import in frontend: `import { ESCROW_ABI } from '@/lib/contractABIs'`
   - **Branch:** `feature/contracts`
   - **Commit:** `BE: Contracts deployed to Amoy, ABIs exported`

---

### Phase 2: Backend Integration (Hours 6-14)

**Objective:** Connect backend to smart contracts, enable real escrow flow

**Tasks:**

5. **Hour 6-8: Connect to Smart Contracts**
   - [ ] Install ethers.js: `npm install ethers@6.16.0`
   - [ ] Create `/backend/contracts.js`:
     ```javascript
     const { ethers } = require('ethers');
     const ESCROW_ABI = require('./ABIs/EscrowContract.json');
     const REPUTATION_ABI = require('./ABIs/ReputationRegistry.json');
     
     const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
     const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
     
     const escrowContract = new ethers.Contract(
       process.env.ESCROW_ADDRESS,
       ESCROW_ABI,
       wallet
     );
     
     const reputationContract = new ethers.Contract(
       process.env.REPUTATION_ADDRESS,
       REPUTATION_ABI,
       wallet
     );
     
     module.exports = { escrowContract, reputationContract, provider, wallet };
     ```
   - [ ] Test contract connection: `npx hardhat console --network amoy`
   - **Branch:** `feature/backend-api`

6. **Hour 8-10: Implement Event Listeners**
   - [ ] Create `/backend/eventListener.js`:
     ```javascript
     const { escrowContract, reputationContract } = require('./contracts');
     
     function startListeners() {
       escrowContract.on('CredentialMinted', (projectId, freelancer) => {
         console.log(`Credential minted for project ${projectId}`);
         // Trigger credential generation
       });
       
       reputationContract.on('CredentialRegistered', (...args) => {
         console.log('Credential registered');
         // Update reputation cache
       });
     }
     
     module.exports = { startListeners };
     ```
   - [ ] Add listener startup to `server.js`
   - [ ] Test with testnet events
   - **Branch:** `feature/backend-api`

7. **Hour 10-12: Connect to W3C Credential Generation**
   - [ ] Update `POST /api/credentials/:id/mint` to:
     - Query contract for project details
     - Generate W3C VC with real data
     - Include contract addresses and tx hash
   - [ ] Add signature verification using contract signer
   - [ ] Store credential metadata in mock DB or file
   - **Branch:** `feature/credentials`

8. **Hour 12-14: Add Real Escrow State Management**
   - [ ] Update `/api/projects/:id` to:
     - Query contract for real project state
     - Return on-chain data instead of mock
   - [ ] Update `POST /api/projects` to:
     - Submit transaction to `createProject()`
     - Wait for confirmation
     - Return on-chain project ID
   - [ ] Implement reputation recalculation from contract
   - **Branch:** `feature/backend-api`
   - **Commit:** `BE: Full contract integration, real escrow flow`

---

### Phase 3: Testing & Fixes (Hours 14-20)

**Objective:** Ensure all contract interactions work reliably

**Tasks:**

9. **Hour 14-16: Integration Testing**
   - [ ] Create test script in `/backend/testFlow.js`:
     ```javascript
     async function testFullFlow() {
       // 1. Create project
       // 2. Fund escrow
       // 3. Submit deliverable
       // 4. Approve completion
       // 5. Verify credential minted
     }
     ```
   - [ ] Run against testnet
   - [ ] Verify each step succeeds
   - [ ] Test error cases (insufficient funds, timeout, etc.)
   - **Branch:** `feature/backend-api`

10. **Hour 16-17: Create Demo Account Script**
    - [ ] Create `/scripts/setupDemoAccounts.js`:
      ```javascript
      // Seed 5-10 demo accounts with:
      // - Test MATIC
      // - Pre-created projects
      // - Reputation credentials
      // - Sample portfolios
      ```
    - [ ] Make script idempotent (safe to run multiple times)
    - [ ] Document account addresses and private keys
    - [ ] Create readable output showing account balances
    - **Branch:** `feature/backend-api`

11. **Hour 17-19: Population Scripts**
    - [ ] Create `/scripts/populateReputation.js`:
      - Register 50+ credentials for demo accounts
      - Vary timestamps (past week)
      - Vary issuer addresses
      - Vary satisfaction ratings
    - [ ] Create `/scripts/seedProjects.js`:
      - Create 10 sample projects
      - Link to demo freelancers
      - Set various completion states
    - **Branch:** `feature/backend-api`
    - **Test:** Run both scripts and verify data appears in API

12. **Hour 19-20: Monitoring & Logging**
    - [ ] Add request logging to server:
      ```javascript
      app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
      });
      ```
    - [ ] Add contract interaction logging
    - [ ] Add error logging with stack traces
    - **Commit:** `BE: Demo accounts setup, logging added`

---

### Phase 4: Ready for Demo (Hours 20-24)

**Objective:** Ensure everything works smoothly for presentation

**Tasks:**

13. **Hour 20-21: Documentation Update**
    - [ ] Update `/docs/DEPLOYMENT.md` with:
      - Contract addresses
      - Test wallet addresses
      - Testnet setup instructions
    - [ ] Create `/docs/DEMO_SCRIPT.md`:
      - Step-by-step demo flow
      - What to show at each step
      - Fallback if something breaks
    - **Branch:** `develop`

14. **Hour 21-23: Final Testing**
    - [ ] Run full demo flow end-to-end:
      - Start backend
      - Connect from frontend
      - Create project
      - Fund escrow
      - Mark delivered
      - Approve completion
      - View credential
    - [ ] Fix any last-minute bugs
    - [ ] Verify all endpoints respond in <500ms
    - [ ] Check for console errors/warnings
    - **Branch:** `develop`

15. **Hour 23-24: Backup & Documentation**
    - [ ] Record screen capture of working flow (backup video)
    - [ ] Create emergency troubleshooting guide
    - [ ] Document all test wallet addresses
    - [ ] Prepare wallets with fresh funds
    - [ ] Final PR review & merge to develop
    - [ ] Create release tag: `v1.0.0-mvp`

---

---

## 👩‍💻 Frontend/Wallet Lead - Work Assignment

**Time Allocation:** 24 hours
- UI Polish: 5 hours
- Wallet Integration: 6 hours
- Backend Connection: 6 hours
- Testing & Bug Fixes: 5 hours
- Buffer: 2 hours

### Phase 1: UI & Component Finalization (Hours 1-5)

**Objective:** Polish all pages and ensure responsive design

**Tasks:**
1. **Hour 1-2: Review All Pages**
   - [ ] Test each page at different screen sizes (mobile, tablet, desktop)
   - [ ] Check pages:
     - `/` (homepage) - ensure leaderboard renders
     - `/client` - form validation works
     - `/freelancer` - project proposals display
     - `/portfolio` - credentials show nicely
     - `/leaderboard` - ranking displays correctly
     - `/search` - filters work
     - `/verify` - credential verification page works
     - `/history` - transaction history displays
   - [ ] Fix any layout issues
   - **Branch:** `feature/frontend-ui`

2. **Hour 2-3: Add Error Handling UI**
   - [ ] Create error toast components in all forms
   - [ ] Add loading states to buttons
   - [ ] Add "copy to clipboard" for addresses
   - [ ] Add confirmation dialogs for important actions
   - Example:
     ```typescript
     <form onSubmit={handleSubmit}>
       {error && <ErrorToast message={error} />}
       {isLoading && <LoadingSpinner />}
       <input type="text" placeholder="Freelancer address" />
       <button disabled={isLoading}>Create Project</button>
     </form>
     ```
   - **Branch:** `feature/frontend-ui`

3. **Hour 3-4: Add Form Validation**
   - [ ] Validate Ethereum addresses (use ethers.js getAddress())
   - [ ] Validate amounts (non-zero, max limits)
   - [ ] Validate durations (1-365 days)
   - [ ] Show inline validation feedback
   - [ ] Disable submit button until form is valid
   - **Branch:** `feature/frontend-ui`

4. **Hour 4-5: Polish Animations & Styling**
   - [ ] Add smooth transitions to page changes
   - [ ] Add hover effects to buttons
   - [ ] Add loading skeletons for data tables
   - [ ] Ensure consistent spacing and alignment
   - [ ] Test dark mode readability
   - **Commit:** `FE: UI polish, form validation, error handling`

---

### Phase 2: Wallet Integration (Hours 5-11)

**Objective:** Connect RainbowKit and enable transaction signing

**Tasks:**

5. **Hour 5-7: Setup RainbowKit Provider**
   - [ ] Verify RainbowKit is installed in `/frontend/package.json`
   - [ ] Update `/frontend/app/providers.tsx`:
     ```typescript
     'use client';
     
     import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
     import { WagmiProvider } from 'wagmi';
     import { polygonAmoy } from 'wagmi/chains';
     
     const config = getDefaultConfig({
       appName: 'SkillBond',
       projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from WalletConnect
       chains: [polygonAmoy],
       ssr: true,
     });
     
     export function Providers({ children }) {
       return (
         <WagmiProvider config={config}>
           <RainbowKitProvider>
             {children}
           </RainbowKitProvider>
         </WagmiProvider>
       );
     }
     ```
   - [ ] Update `/frontend/app/layout.tsx` to use Providers:
     ```typescript
     export default function RootLayout({ children }) {
       return (
         <html>
           <body>
             <Providers>
               {children}
             </Providers>
           </body>
         </html>
       );
     }
     ```
   - [ ] Test wallet connection button appears
   - **Branch:** `feature/wallet-integration`

6. **Hour 7-9: Create Hooks for Contract Interaction**
   - [ ] Create `/frontend/lib/useContract.ts`:
     ```typescript
     import { useAccount, useContractWrite } from 'wagmi';
     import { ESCROW_ABI, REPUTATION_ABI } from './contractABIs';
     
     export function useEscrowContract() {
       const { write: createProject } = useContractWrite({
         address: process.env.NEXT_PUBLIC_ESCROW_ADDRESS,
         abi: ESCROW_ABI,
         functionName: 'createProject',
       });
       
       return { createProject };
     }
     ```
   - [ ] Test hook in component
   - **Branch:** `feature/wallet-integration`

7. **Hour 9-11: Connect Forms to Contract Functions**
   - [ ] Update `/frontend/app/client/page.tsx`:
     - Add "Create Project" button that calls contract
     - Show transaction hash after submission
     - Wait for confirmation before showing success
   - [ ] Update `/frontend/app/freelancer/page.tsx`:
     - Add "Submit Deliverable" button
     - Call contract's `submitDeliverable()`
   - [ ] Update approval flow:
     - Add "Approve Completion" button
     - Call contract's `approveCompletion()`
   - **Branch:** `feature/wallet-integration`
   - **Commit:** `FE: RainbowKit setup, contract hooks, tx signing`

---

### Phase 3: Backend Connection & Real Data (Hours 11-17)

**Objective:** Wire frontend to backend API and display real data

**Tasks:**

8. **Hour 11-13: Create API Client**
   - [ ] Create `/frontend/lib/apiClient.ts`:
     ```typescript
     import axios from 'axios';
     
     const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
     
     export const api = axios.create({
       baseURL: API_URL,
       headers: { 'Content-Type': 'application/json' },
     });
     
     export async function getReputation(address: string) {
       const { data } = await api.get(`/api/reputation/${address}`);
       return data;
     }
     
     export async function getProject(id: string) {
       const { data } = await api.get(`/api/projects/${id}`);
       return data;
     }
     
     export async function verifyCredential(id: string) {
       const { data } = await api.get(`/api/credentials/${id}/verify`);
       return data;
     }
     ```
   - [ ] Create `/frontend/lib/apiHooks.ts` using React Query or SWR:
     ```typescript
     import useSWR from 'swr';
     
     export function useReputation(address: string) {
       const { data, error, isLoading } = useSWR(
         address ? `/api/reputation/${address}` : null,
         getReputation
       );
       return { reputation: data, isLoading, error };
     }
     ```
   - [ ] Test API connection from browser console
   - **Branch:** `feature/backend-api`

9. **Hour 13-15: Display Real Reputation Data**
   - [ ] Update `/freelancer/page.tsx`:
     - Fetch real reputation scores from API
     - Display on profile cards
     - Show reputation trend
   - [ ] Update `/leaderboard/page.tsx`:
     - Fetch top 10 freelancers from API
     - Sort by reputation score
   - [ ] Add reputation badges:
     - 90-100: ⭐⭐⭐⭐⭐ (platinum)
     - 75-89: ⭐⭐⭐⭐ (gold)
     - 50-74: ⭐⭐⭐ (silver)
     - <50: ⭐⭐ (bronze)
   - **Branch:** `feature/backend-api`

10. **Hour 15-17: Display Real Credentials**
    - [ ] Update `/portfolio/page.tsx`:
      - Fetch credentials from API
      - Display credential cards
      - Show verification status
    - [ ] Update `/verify/page.tsx`:
      - Implement credential verification
      - Display issuer, subject, proof
      - Show W3C VC JSON in expandable section
    - [ ] Add credential download/share button
    - **Branch:** `feature/credentials`
    - **Commit:** `FE: Backend API integration, real data display`

---

### Phase 4: Testing & Final Polish (Hours 17-22)

**Objective:** Test all flows and fix bugs

**Tasks:**

11. **Hour 17-19: End-to-End Testing**
    - [ ] Test user flows:
      1. Connect wallet
      2. Create project with real contract
      3. View reputation score
      4. Submit deliverable
      5. Approve completion
      6. View generated credential
      7. Share credential with QR code
    - [ ] Check all error states:
      - Insufficient funds
      - Invalid address
      - Transaction rejected
    - [ ] Verify loading states work
    - [ ] Verify forms clear after submission
    - **Branch:** `develop`

12. **Hour 19-20: Performance & Accessibility**
    - [ ] Run Lighthouse audit
    - [ ] Fix any performance issues
    - [ ] Add alt text to all images
    - [ ] Ensure keyboard navigation works
    - [ ] Test with screen reader
    - **Branch:** `develop`

13. **Hour 20-22: Bug Fixes & Polish**
    - [ ] Fix any console errors/warnings
    - [ ] Handle network timeouts gracefully
    - [ ] Add retry logic for failed API calls
    - [ ] Test with slow 3G network
    - [ ] Verify all links work
    - [ ] Test with multiple test wallets
    - **Branch:** `develop`
    - **Commit:** `FE: E2E testing, bug fixes, accessibility`

---

### Phase 5: Demo Ready (Hours 22-24)

**Objective:** Prepare for smooth presentation

**Tasks:**

14. **Hour 22-23: Prepare Demo Accounts**
    - [ ] Create list of demo wallets (from backend lead)
    - [ ] Get account balances and reputation scores
    - [ ] Note any interesting features to highlight
    - [ ] Create demo script:
      ```
      Scenario 1: Freelancer with high reputation
      - Show address: 0xAlice...
      - Score: 85/100
      - Projects: 12
      
      Scenario 2: Creating new project
      - Use client wallet
      - Select freelancer
      - Set amount & deadline
      - Show escrow calculation with discount
      - Submit & wait for confirmation
      ```
    - **Branch:** `develop`

15. **Hour 23-24: Final Checks**
    - [ ] Verify all pages load without errors
    - [ ] Test wallet connection with fresh session
    - [ ] Test all demo scenarios once more
    - [ ] Check backend is running on startup
    - [ ] Create backup HTML screenshots of key flows
    - [ ] Final PR review
    - [ ] Merge to develop branch
    - [ ] Prepare demo URL(s) for judges
    - **Commit:** `FE: Final polish, demo ready`

---

## 🔄 Synchronization Points (Daily Standups)

### Morning (Start of Day)
- [ ] Review completed work from overnight
- [ ] Identify any blockers
- [ ] Adjust timeline if needed

### Mid-Day (Hour 12)
- [ ] Contract deployment complete? (BE Lead)
- [ ] ABIs available for frontend? (BE Lead → FE Lead)
- [ ] Wallet integration working? (FE Lead)
- [ ] Both can test together
- [ ] Decide on backup plan if major issue

### End of Day (Hour 20)
- [ ] All major features working?
- [ ] Ready for demo in 4 hours?
- [ ] Any last-minute fixes needed?
- [ ] Merge strategy for final code

---

## 🚨 Emergency Procedures

### If Contracts Fail to Deploy
- [ ] **BE Lead:** Switch to local hardhat network (chainId 31337)
- [ ] **FE Lead:** Update contract addresses to localhost
- [ ] Test locally with hardhat fork
- [ ] Show demo with local network instead
- **Impact:** No real testnet fees, works for demo

### If Backend Crashes
- [ ] **BE Lead:** Switch to fully hardcoded mock data
- [ ] **FE Lead:** Show static credential screenshots
- [ ] Demonstrate contract interactions via Etherscan link
- **Impact:** Still shows the concept works

### If Wallet Connection Fails
- [ ] **FE Lead:** Demonstrate with MetaMask already connected
- [ ] Simulate transaction flow with hardcoded wallet
- [ ] Show credential verification without signing
- **Impact:** Shows UI/UX even if wallet not connected live

### If Running Out of Time
- [ ] **Priority 1:** Get contracts deployed ✅
- [ ] **Priority 2:** Show homepage with leaderboard ✅
- [ ] **Priority 3:** Show one end-to-end flow (create project → complete → credential) ⭐
- [ ] **Priority 4:** Polish everything else

---

## 📊 Git Workflow Example Commands

### Backend Lead
```bash
# At start
git checkout -b feature/contracts origin/develop

# After each major task
git add .
git commit -m "BE: Deploy contracts to Amoy, export ABIs"
git push origin feature/contracts

# When ready to merge
git pull origin develop
git push origin feature/contracts
# Create PR on GitHub

# Merge
git checkout develop
git pull origin develop
git merge feature/contracts --no-ff
git push origin develop
```

### Frontend Lead
```bash
# At start
git checkout -b feature/frontend-ui origin/develop

# After each major task
git add .
git commit -m "FE: Add form validation and error handling"
git push origin feature/frontend-ui

# When backend merges
git pull origin develop
git merge develop into feature/frontend-ui

# Ready to integrate with backend
git checkout -b feature/wallet-integration origin/develop
```

---

## ✅ Final Submission Checklist

### Backend/Contracts Lead
- [ ] Contracts compile without warnings
- [ ] Contracts deploy to Polygon Amoy
- [ ] Contract addresses documented
- [ ] ABIs exported to frontend
- [ ] Backend API running and responding
- [ ] All endpoints tested with curl/Postman
- [ ] Demo accounts created and funded
- [ ] Reputation data seeded
- [ ] Event listeners working
- [ ] Database/mock data stable
- [ ] Documentation updated
- [ ] Ready for presentation

### Frontend Lead
- [ ] All pages render without console errors
- [ ] Wallet connection works
- [ ] Forms have validation
- [ ] API calls return real data
- [ ] Credentials display correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Transactions can be signed and submitted
- [ ] Error states handled gracefully
- [ ] Performance acceptable (<3s page loads)
- [ ] Accessibility tested
- [ ] Demo flows tested end-to-end
- [ ] Ready for presentation

---

**Next Steps:**
1. Assign roles to developers
2. Create GitHub repository with branch protection
3. Start Phase 1 tasks simultaneously
4. Daily syncs at mid-day and end-of-day
5. Celebrate when merging to main! 🎉

---

**Document Version:** 1.0
**Created:** 2026-04-24
**Target Completion:** 2026-04-25 (24 hours)
