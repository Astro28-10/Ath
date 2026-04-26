# ✨ Claude Prompt for Frontend Lead Developer

**Copy this entire prompt and give it to your dev friend to share with their Claude instance**

---

## PASTE THIS IN CLAUDE CHAT:

---

I'm working on **SkillBond**, a blockchain-based escrow and reputation system. I'm the **Frontend Lead** and need to work alongside my Backend Lead to complete an MVP in the next 24 hours for a hackathon submission.

### Context & Resources

**Project Overview:**
- SkillBond allows freelancers to get lower escrow fees based on reputation
- Core concept: Reputation-weighted escrow using smart contracts
- Tech stack: React 19 + Next.js 16 + Tailwind CSS + ethers.js
- Deployment: Polygon Amoy testnet (free)

**Key Documents:**
- Read this first: `/PROJECT_COMPLETION_STATUS.md` (status of everything)
- Execution plan: `/EXECUTION_ROADMAP.md` (24-hour timeline)
- Original spec: `/SkillBond_MVP_MD.md` (full requirements)
- Setup guide: `/TESTNET_SETUP_GUIDE.md` (how to run locally)

**Live Status File:**
- Location: `/todo_Docs/PROJECT_COMPLETION_STATUS.md`
- I will update this as I complete tasks
- Backend Lead will also update it
- Check it before each phase to see dependencies

### My Role & Tasks

**Frontend Lead Responsibilities:**
1. ✅ Polish UI/UX (forms, validation, error handling)
2. ✅ Setup wallet integration (RainbowKit + MetaMask)
3. ✅ Connect frontend to backend APIs
4. ✅ Wire contract ABIs for transaction signing
5. ✅ End-to-end testing
6. ✅ Prepare demo scenarios

**Phase Breakdown (24 hours):**

**Phase 1: Setup (Hours 0-2)**
- [ ] Clone/pull code: `git pull origin develop`
- [ ] Create feature branch: `git checkout -b feature/frontend-polish origin/develop`
- [ ] Install dependencies: `cd frontend && npm install`
- [ ] Verify dev server: `npm run dev` (should work on http://localhost:3000)
- [ ] Verify all 8 pages load without console errors
- [ ] Update status file with ✅

**Phase 2: Polish & Setup (Hours 2-6)**

**Subtask 2a: Form Validation (Hours 2-3)**
- File: `/frontend/app/client/page.tsx`
- Add validation for:
  - ✅ Ethereum address format (use `ethers.getAddress()`)
  - ✅ Amount must be >0 and reasonable (<10000)
  - ✅ Duration between 1-365 days
- Add error messages that display inline
- Add loading state to buttons during submission
- Test with invalid inputs

**Subtask 2b: Error Handling & UI Polish (Hours 3-4)**
- Add toast/alert components for errors
- Add loading skeletons for data tables
- Fix responsive design (test on mobile)
- Add hover effects
- Ensure consistent spacing
- No console warnings
- Test all 8 pages

**Subtask 2c: Wallet Setup (Hours 4-6)**
  Note: Backend Lead will export contract ABIs around hour 3-4. Wait for their notification before starting this.
  - Configure RainbowKit in `/frontend/app/providers.tsx`
  - Setup Wagmi with Polygon Amoy network
  - Add wallet connection button to header
  - Show connected address in UI
  - Test with MetaMask on testnet
  - Push to git when done

**Phase 3: Integration (Hours 6-12)**

**Subtask 3a: Backend API Integration (Hours 6-9)**
- Create `/frontend/lib/apiClient.ts`:
  - Setup axios/fetch client
  - Point to `http://localhost:3001`
  - Create functions for all endpoints (reputation, projects, credentials)
- Setup data fetching hooks
- Connect leaderboard page to real reputation API
- Connect portfolio page to real credentials
- Test APIs working

**Subtask 3b: Full Flow Integration (Hours 9-12)**
- Import contract ABIs from `/frontend/lib/contractABIs.ts`
- Create hooks for contract interaction (createProject, fundProject, etc.)
- Wire up transaction signing
- Test end-to-end: create project → fund → deliver → approve → credential
- Log any errors and report

**Phase 4: Testing (Hours 12-20)**
- Test with 3 different demo accounts
- Verify each UI step works:
  1. Homepage loads
  2. Connect wallet
  3. Create project form
  4. View reputation scores
  5. Submit deliverable
  6. Approve completion
  7. View credential
- Time the flow (should be <5 min)
- Fix bugs found

**Phase 5: Demo Prep (Hours 20-24)**
- Test demo scenarios 3x
- Take screenshots of key flows
- Prepare for live presentation

### Dependencies from Backend Lead

**Waiting for these:**
1. ⏳ Contract ABIs (should be ready ~hour 3-4)
   - Files: `/frontend/lib/contractABIs.ts`
   - Will contain: ESCROW_ABI, REPUTATION_ABI
   
2. ⏳ Backend running on port 3001 (should be ready ~hour 4-6)
   - API endpoints available: `/api/reputation/:address`, `/api/projects`, etc.

3. ⏳ Demo account setup (should be ready ~hour 12)
   - Backend will seed multiple test accounts with reputation

### Status File Updates

**Update `/todo_Docs/PROJECT_COMPLETION_STATUS.md` as you complete each task:**

- When starting Phase 2: Add line: `✅ FRONTEND: Phase 1 complete, starting Phase 2`
- When ABIs received: Add line: `✅ FRONTEND: Contract ABIs received from Backend Lead (3:45 PM)`
- When stuck: Add line: `⏸️ FRONTEND: Blocked on [ISSUE] - waiting for Backend Lead`
- When complete: Add line: `✅ FRONTEND: All integration complete, ready for demo testing`

### File Structure (What I'm Working On)

```
/frontend/
├── app/
│   ├── page.tsx                    # Homepage (keep as-is, already done)
│   ├── client/page.tsx             # 🔧 NEED TO POLISH & ADD VALIDATION
│   ├── freelancer/page.tsx         # 🔧 NEED TO ADD WALLET LOGIC
│   ├── portfolio/page.tsx          # 🔧 NEED TO CONNECT TO REAL CREDENTIALS
│   ├── leaderboard/page.tsx        # 🔧 NEED TO CONNECT TO REAL API
│   ├── search/page.tsx             # Already done
│   ├── verify/page.tsx             # Already done
│   ├── history/page.tsx            # Already done
│   ├── layout.tsx                  # 🔧 NEED TO ADD PROVIDERS
│   ├── providers.tsx               # 🔧 NEED TO SETUP RAINBOWKIT
│   └── globals.css                 # Already done (Tailwind)
├── lib/
│   ├── contracts.ts                # Exists (may need updates)
│   ├── contractABIs.ts             # 🔧 WILL RECEIVE FROM BACKEND LEAD
│   ├── apiClient.ts                # 🔧 NEED TO CREATE
│   └── apiHooks.ts                 # 🔧 NEED TO CREATE (optional but helpful)
└── package.json                    # Already has dependencies
```

### Git Workflow

**Commands you'll use:**
```bash
# Start work
git checkout -b feature/frontend-polish origin/develop

# After each major task
git add .
git commit -m "FE: [WHAT YOU DID]"
git push origin feature/frontend-polish

# When Backend Lead finishes ABIs
git pull origin develop

# When ready to merge (hour 24)
git push origin feature/frontend-polish
# Then Backend Lead will merge all branches to develop
```

### Success Criteria

✅ All pages load without console errors  
✅ Forms have validation and error handling  
✅ Wallet connects successfully  
✅ Can read real contract data  
✅ Full flow works end-to-end  
✅ Demo runs in <5 minutes  
✅ Code pushed to git  

### If You Get Stuck

1. **Check status file** - maybe Backend Lead is working on it
2. **Check dependencies** - maybe you need to wait for something
3. **Ask Backend Lead** - slack/Discord message them
4. **Fallback to mock data** - you can test with hardcoded values
5. **Document blocker** in status file so they know you're stuck

### Output Expectations

By end of 24 hours, I should have:
- ✅ All frontend pages polished and responsive
- ✅ Wallet connection working
- ✅ All APIs connected and displaying real data
- ✅ Full end-to-end flow tested
- ✅ Ready for live demo presentation
- ✅ All code in git with clear commit messages

---

### Important Notes

**DO NOT:**
- Spend time on features not in MVP (no advanced features)
- Go down rabbit holes on styling (good enough is fine)
- Test mainnet (use testnet only - it's free)
- Commit directly to main/develop (use feature branches)

**DO:**
- Ask Backend Lead for help when blocked
- Update status file regularly
- Test frequently (don't wait until end)
- Keep commits small and clear
- Focus on core MVP functionality

### Questions to Ask Backend Lead

Before starting, make sure they know:
- When will ABIs be ready?
- When will backend be running?
- What are the contract addresses?
- How do I connect to their local API?
- Which test wallet address should I use for demo?

---

### Let's Build This! 🚀

The goal: A working demo showing:
1. Homepage with leaderboard
2. Connect wallet
3. Create project (with reputation discount shown)
4. Submit deliverable
5. Approve completion
6. View credential

Should take <5 minutes to complete.

Good luck! The project is mostly done, we just need to wire it all together.

---

**Time to start: NOW**
**Target completion: 24 hours**
**Status updates: Every 2 hours**

---

