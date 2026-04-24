# 🧪 Local Testing Guide - SkillBond MVP

## Prerequisites
- Node.js 18+ installed
- Both `frontend` and `backend` directories have dependencies installed
- Ports 3000 and 3001 are available

---

## Quick Start (One Command)

Use the existing startup scripts:

```bash
# Windows Batch
.\START.bat

# Or PowerShell
powershell -ExecutionPolicy Bypass -File .\START.ps1
```

These scripts will:
1. ✅ Kill any existing Node processes
2. ✅ Start backend on port 3001 (new terminal)
3. ✅ Start frontend on port 3000 (new terminal)
4. ✅ Open browser to http://localhost:3000

---

## Manual Start

If scripts don't work, start manually:

### Terminal 1: Backend
```bash
cd backend
npm install  # If not already done
node server.js
```

You should see:
```
✓ ReputationRegistry contract initialized
✓ EscrowContract contract initialized
⚡ Backend API listening on port 3001
```

### Terminal 2: Frontend
```bash
cd frontend
npm install --legacy-peer-deps  # First time only
npm run dev
```

You should see:
```
▲ Next.js 16.2.4
- Local: http://localhost:3000
- Environments: .env.local
✓ Ready in 3.2s
```

---

## Testing the New Features

### 1. Homepage
**URL:** http://localhost:3000

**Expected:**
- [ ] Gradient background (blue → purple → white)
- [ ] Animated reputation counter (0→85%)
- [ ] 4 stat cards: Users, Projects, Volume, Discount
- [ ] Top 5 performers leaderboard
- [ ] Navigation shows: CERTIFICATES | LEADERBOARD | SEARCH
- [ ] No console errors

---

### 2. Search Page
**URL:** http://localhost:3000/search

**Test 1: Search for alice.eth**
- [ ] Shows result with NAME: alice.eth
- [ ] Score: 95.0% (not 1%)
- [ ] Projects: 5
- [ ] Rating: 4.9★
- [ ] Button text says "VIEW PROFILE" (not "HIRE")
- [ ] Click button → navigates to bio page

**Test 2: Search for bob.eth**
- [ ] Shows result with Score: 72.0%

**Test 3: Search for invalid address**
- [ ] Shows "NO RESULTS FOUND"

---

### 3. Freelancer Bio Page
**URL:** http://localhost:3000/freelancer/0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d

**Tab 1: OVERVIEW**
- [ ] Header shows name and 95.0% reputation
- [ ] 4 stat cards: Score (95%), Credentials (5), Rating (4.9★), Status (✓)
- [ ] Each stat card has gradient background
- [ ] Biography section visible
- [ ] Skills tags display (Solidity, React, TypeScript, etc.)
- [ ] Recent projects section shows 3 projects
- [ ] HIRE and CONTACT buttons present

**Tab 2: REPUTATION ANALYTICS**
- [ ] "REPUTATION GROWTH (12 MONTHS)" chart displays
- [ ] Area chart shows upward trend line
- [ ] Can hover over chart to see data points
- [ ] "CREDENTIALS EARNED" bar chart displays
- [ ] Both charts are interactive
- [ ] Stats boxes at top show Score, Credentials, Status

**Tab 3: CERTIFICATE**
- [ ] Beautiful certificate design appears
- [ ] Certificate has dark background with gold accents
- [ ] Shows: "SKILLBOND - CREDENTIAL OF EXCELLENCE"
- [ ] Shows freelancer name
- [ ] Shows wallet address (shortened)
- [ ] Shows Reputation: 95%
- [ ] Shows Credentials: 5
- [ ] Certificate ID visible at bottom
- [ ] Issue date shown
- [ ] "⬇ DOWNLOAD CERTIFICATE PDF" button present
- [ ] Three info boxes: Blockchain Verified, Publicly Verifiable, Tamper-Proof

**Test Certificate Download:**
- [ ] Click "⬇ DOWNLOAD CERTIFICATE PDF"
- [ ] PDF downloads to Downloads folder
- [ ] PDF filename: `SkillBond-Certificate-[uuid].pdf`
- [ ] PDF opens successfully with certificate content

---

### 4. Certificates Page
**URL:** http://localhost:3000/certificates

**Expected:**
- [ ] Header: "CERTIFICATES" - "BLOCKCHAIN-VERIFIED CREDENTIALS"
- [ ] Info box explaining blockchain certificates
- [ ] Shows "ISSUED CERTIFICATES (3)"
- [ ] 3 certificate cards display:
  - alice.eth (95%, 5 credentials)
  - bob.eth (72%, 3 credentials)
  - carol.eth (40%, 1 credential)
- [ ] Each card has:
  - 📜 emoji
  - Name
  - Reputation %
  - Credentials count
  - Issue date
  - Certificate ID (truncated)
  - "VIEW & VERIFY" button
- [ ] Why section with 3 boxes: IMMUTABLE, PUBLICLY VERIFIABLE, NO SINGLE POINT OF FAILURE

**Test:**
- [ ] Hover over certificate card → shows scale transform and shadow
- [ ] Click "VIEW & VERIFY" → navigates to individual certificate page

---

### 5. Certificate Verification Page
**URL:** http://localhost:3000/certificate/[uuid]
(Get UUID from certificates page)

**Expected:**
- [ ] Green success banner: "✅ CERTIFICATE VERIFIED"
- [ ] Message: "authentic and recorded on the Polygon Amoy blockchain"
- [ ] Full certificate displays below banner
- [ ] Two columns below certificate:
  - **Column 1: CERTIFICATE DETAILS**
    - Certificate ID
    - Freelancer name
    - Wallet address
    - Issue date
    - Blockchain: Polygon Amoy
  - **Column 2: VERIFICATION METRICS**
    - Reputation Score: 95% (blue)
    - Credentials Earned: 5 (purple)
    - Status: ACTIVE (green)
    - Verification: CONFIRMED (green)
    - Chain Status: IMMUTABLE (green)
- [ ] BLOCKCHAIN VERIFICATION section:
  - Link to wallet on PolygonScan
  - Link to ReputationRegistry contract
  - Both links are clickable
- [ ] 3 Trust Indicator boxes: 🔒 IMMUTABLE | 🌐 PUBLICLY VERIFIABLE | ✅ TRUSTWORTHY
- [ ] SHARE THIS CERTIFICATE section:
  - Shows share link
  - Copy button present

**Test PolygonScan Links:**
- [ ] Click wallet link → opens https://amoy.polygonscan.com/address/0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d
- [ ] Wallet shows balance and transaction history
- [ ] Click ReputationRegistry link → opens contract page on PolygonScan

---

## API Testing (Backend)

### Test Health Endpoint
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "contractsInitialized": true
}
```

### Test Reputation Endpoint
```bash
curl http://localhost:3001/api/reputation/alice.eth
```

**Expected Response:**
```json
{
  "address": "0x72f32C9b10e8669b5Fd139a00e03004EE4bd3b1D",
  "score": 9500,
  "scorePercent": "95.0",
  "credentialCount": 5,
  "averageRating": 4.9,
  "lastActivity": "2024-04-24T12:34:56.000Z",
  "source": "demo"
}
```

### Test with Wallet Address
```bash
curl http://localhost:3001/api/reputation/0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d
```

Should return same result as above

---

## Browser Console Check

After visiting each page, check browser console (F12 → Console):

- [ ] No red errors
- [ ] No warnings about missing modules
- [ ] No CORS errors from backend
- [ ] All Recharts components loaded without errors
- [ ] html2pdf library loaded successfully

---

## Performance Checks

### Frontend Build
```bash
cd frontend
npm run build
```

Expected: Completes without errors in < 30 seconds

### Frontend Bundle Size
After build, check `.next/` folder size: Should be < 500MB

---

## Mobile Testing

Visit on phone or use DevTools (F12 → Responsive Design Mode):

**Test URLs:**
- http://localhost:3000 (home)
- http://localhost:3000/search (search)
- http://localhost:3000/freelancer/0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d (bio)
- http://localhost:3000/certificates (certificates list)

**Expected:**
- [ ] All pages responsive
- [ ] No horizontal scroll
- [ ] Buttons are clickable (min 44px height)
- [ ] Text is readable (min 12px)
- [ ] Charts are visible and not cut off

---

## Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
rm -r frontend/.next frontend/node_modules
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Backend won't connect
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID [PID] /F
```

### API endpoints return 500 error
- Check backend console for error message
- Verify contracts are initialized
- Check if Polygon Amoy RPC is accessible

### Graphs not showing
- Inspect browser console for React/Recharts errors
- Verify Recharts package installed: `npm list recharts`
- Check if data is being passed to component

### Certificate PDF download fails
- Check if html2pdf.js installed: `npm list html2pdf.js`
- Try different browser (Chrome/Firefox/Edge)
- Check browser console for errors

---

## Test Scenarios

### Scenario 1: Demo Flow (5 min)
1. Open http://localhost:3000
2. Review homepage stats
3. Navigate to Search page
4. Search "alice.eth"
5. Click "VIEW PROFILE"
6. Review bio OVERVIEW tab
7. Click REPUTATION ANALYTICS tab
8. Review graphs
9. Click CERTIFICATE tab
10. Download PDF
11. Go back and check Certificates page

### Scenario 2: Blockchain Verification (3 min)
1. Open Certificates page
2. View any certificate
3. Click "VIEW & VERIFY"
4. Copy PolygonScan wallet link
5. Open in new tab
6. Navigate to blockchain explorer
7. Show transaction history
8. Show ReputationRegistry contract

### Scenario 3: Mobile Testing (2 min)
1. Open DevTools responsive mode
2. Test iPhone 12 resolution
3. Verify all pages work
4. Test tablet resolution
5. Verify responsive grid layouts

---

## Success Criteria

All tests pass if you can:

✅ See 95% reputation for Alice (not 1%)
✅ View graphs on bio page
✅ Download certificate PDF
✅ View blockchain links on PolygonScan
✅ See all navigation buttons
✅ No red console errors
✅ All pages load < 3 seconds
✅ Mobile responsive without scroll

---

**Happy Testing! 🚀**
