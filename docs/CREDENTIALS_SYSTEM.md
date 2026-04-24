# 📜 Credentials System Guide

Learn how SkillBond tracks and verifies freelancer credentials on-chain.

---

## 🎓 What Are Credentials?

Credentials are **verified skills, certifications, and project completions** stored permanently on the Polygon blockchain. They:

- ✅ Can't be forged or deleted (immutable)
- ✅ Build reputation over time
- ✅ Are tied to your wallet address
- ✅ Increase your marketplace trust score

**Examples:**
- "Completed React Dashboard project"
- "AWS Certification verified"
- "5-star rating from client Alice"
- "Delivered 10+ projects on time"

---

## 🔗 Smart Contract Architecture

### ReputationRegistry Contract

Manages all credentials and reputation calculations.

**Deployed on Polygon Amoy:**
- Address: `0x1B1C962B4A4be5B655a8A4588a06282646b7ba02`
- Network: Polygon Amoy (ChainID 80002)
- Verified on PolygonScan ✅

**Key Functions:**

```solidity
// Register a new credential
function registerCredential(
  address _freelancer,
  bytes32 _credentialHash,
  address _issuer,      // Who verified this (e.g., client)
  uint256 _weight       // Impact on reputation (1-10000)
) public

// Get all credentials for a freelancer
function getCredentialHashes(address _freelancer)
  public view returns (bytes32[])

// Calculate reputation score (0-10000, displayed as %)
function calculateReputationScore(address _freelancer)
  public view returns (uint256)

// Event emitted when credential added
event CredentialRegistered(
  indexed address freelancer,
  bytes32 credentialHash,
  address issuer
)
```

---

## 📊 How Reputation is Calculated

**Reputation Score Range:** 0-10000 (displayed as 0-100%)

### Formula
```
Total Reputation = Sum of (credential weights)
Max Possible = 10000

Displayed Percentage = (Total Reputation / 10000) × 100%
```

### Example: Alice's Reputation

| Credential | Issuer | Weight | Description |
|------------|--------|--------|-------------|
| Project 1 | Client Bob | 2000 | React Dashboard (5-star) |
| Project 2 | Client Carol | 1500 | API Development |
| Project 3 | Client Dave | 2000 | Full-stack app |
| AWS Cert | AWS | 2000 | Verified AWS certification |
| 10+ Projects | System | 2000 | Milestone bonus |
| **Total** | | **9500** | **95.0%** reputation |

---

## 🚀 How to Add Credentials

### Method 1: Automatic (Project Completion)

**Workflow:**
```
1. Client posts project with budget
2. Freelancer applies and gets hired
3. Freelancer completes work
4. Client reviews and approves
5. Funds released from escrow
6. Credential automatically minted ✅
7. Reputation updated
```

**Automatic credential details:**
- Issuer: EscrowContract (system)
- Weight: Based on project budget
- Hash: Project details hashed

---

### Method 2: Manual via API (Testing)

**Endpoint:**
```
POST /api/credentials/:address/mint

Body:
{
  "title": "AWS Certified Solutions Architect",
  "description": "AWS certification verified",
  "issuer": "AWS",
  "weight": 2000
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3001/api/credentials/alice.eth/mint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Expert",
    "description": "3+ years React experience",
    "issuer": "CodingCertified.io",
    "weight": 1500
  }'
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0x123abc...",
  "credentialHash": "0x456def...",
  "newReputationScore": 9500
}
```

---

### Method 3: Demo Account Population Script

Pre-populate test accounts with credentials:

```bash
cd backend/scripts
node populateReputation.js
```

**What it does:**
- Registers 5 credentials for Alice (95% total)
- Registers 3 credentials for Bob (72% total)
- Registers 1 credential for Carol (40% total)
- Each transaction signed by backend wallet
- Costs ~0.001 POL per credential

---

## 📝 Credential Data Structure

Each credential stored on-chain includes:

```typescript
interface Credential {
  freelancerAddress: string;     // Who earned it
  credentialHash: bytes32;        // Hash of details
  issuerAddress: string;          // Who verified (client/org)
  weight: number;                 // Reputation impact (1-10000)
  timestamp: number;              // When registered
  issuanceBlock: number;          // Blockchain block number
}
```

**Example credential hash creation:**
```javascript
const credentialData = {
  title: "React Expert",
  description: "Completed 10 React projects",
  issuer: "CodingCertified.io",
  date: "2026-04-24"
};

const hash = ethers.keccak256(
  ethers.toUtf8Bytes(JSON.stringify(credentialData))
);
// Result: 0xabcd1234... (256-bit hash)
```

---

## 🔍 View Credentials

### Backend API

**Get all credentials for a freelancer:**
```bash
GET /api/reputation/alice.eth

Response:
{
  "address": "0x72f32C9b10e8669b5Fd139a00e03004eE4bd3b1D",
  "score": 9500,
  "scorePercent": "95.0",
  "credentialCount": 5,        // ← Number of credentials
  "averageRating": 4.9,
  "lastActivity": "2026-04-24T12:35:04.175Z",
  "source": "demo"
}
```

**Get individual credential (not yet implemented):**
```bash
GET /api/credentials/alice.eth

Response:
[
  {
    "hash": "0xabcd1234...",
    "title": "React Expert",
    "issuer": "CodingCertified.io",
    "weight": 2000,
    "timestamp": 1703520000
  },
  ...
]
```

### Frontend Display (Not Yet Implemented)

Will show credential badge/card with:
- Title
- Issuer
- Date earned
- Reputation impact
- Verification link (PolygonScan)

---

## ⛽ Gas Costs

**Cost to register one credential:**
- ~50,000 gas
- ~0.001 POL per credential (at current gas prices)

**Total for demo population (9 credentials):**
- ~450,000 gas
- ~0.009 POL total

**Current budget:** 0.097 POL remaining after deployment ✅

---

## 🔐 Security & Trust

### How Credentials Are Verified

1. **Issuer Verification**: Only registered issuers can issue credentials
   - Clients who hired the freelancer
   - Trusted organizations
   - System (for project completion)

2. **Immutability**: Once registered, can't be deleted or modified
   - Stored on blockchain forever
   - Can be verified on PolygonScan

3. **Weight/Impact**: System controls how much reputation each credential gives
   - Prevents reputation inflation
   - Different weight for different credential types

---

## 📈 Reputation Timeline

```
Day 1: Alice starts
  Score: 0% (no credentials)

Day 1-5: Alice completes first project
  +2000 weight (React project)
  Score: 20%

Day 6-10: Alice completes second project  
  +1500 weight (API development)
  Score: 35%

... (credentials accumulate)

Day 30: Alice now trusted
  +9500 total weight
  Score: 95% reputation
  ✅ Highly trusted by clients
```

---

## 🧪 Testing Credentials

### Test Scenario 1: Mint Manual Credential

```bash
# Add a credential to Alice via API
curl -X POST http://localhost:3001/api/credentials/alice.eth/mint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Solidity Smart Contract Developer",
    "description": "Expert in Ethereum development",
    "issuer": "Ethereum Foundation",
    "weight": 1000
  }'

# Verify reputation increased
curl http://localhost:3001/api/reputation/alice.eth
# Should show: scorePercent: "96.0" (was 95.0)
```

### Test Scenario 2: View in Frontend

```
1. Go to http://localhost:3000/search
2. Search "alice.eth"
3. Click on Alice's profile
4. Should show credentials list (not yet implemented)
5. Click on one credential → PolygonScan verification link
```

---

## 📚 Demo Accounts' Credentials

### Alice (95% = 9500 weight)
- Completed "React Dashboard" project (2000)
- Completed "Mobile App" project (1500)
- Completed "Backend API" project (2000)
- AWS Solutions Architect Certified (2000)
- 5+ Projects Completed Bonus (2000)

### Bob (72% = 7200 weight)
- Completed "UI Design" project (2000)
- Completed "Graphic Design" project (2000)
- Figma Expert Certification (1500)
- Design System Built (1700)

### Carol (40% = 4000 weight)
- Completed "Entry-level Project" (2500)
- Junior Developer Badge (1500)

---

## 🚀 Future Enhancements

- [ ] Frontend credential display cards
- [ ] Credential verification workflow (client approves)
- [ ] Credential dispute/challenge system
- [ ] Different credential types (skill, certification, project)
- [ ] Credential expiry dates
- [ ] Badge system (gold/silver/bronze)
- [ ] Credential search/filter (find all "React" credentials)

---

## 📖 Smart Contract Code

Full ReputationRegistry.sol available at:
`contracts/ReputationRegistry.sol`

Key highlights:
- ~150 lines of Solidity
- Uses OpenZeppelin SafeMath
- Events logged for frontend indexing
- No external dependencies

---

## 🔗 Resources

- **View on PolygonScan:** https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02
- **Backend API Code:** `backend/server.js` (reputation endpoints)
- **Contract Source:** `contracts/ReputationRegistry.sol`

---

**Summary:** Credentials are the foundation of SkillBond's trust system. Each completed project or verified skill increases reputation and makes freelancers more attractive to clients. All credentials are permanent, verifiable, and stored on blockchain. 🔗
