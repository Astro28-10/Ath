# SkillBond System Architecture

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LAYER (Web)                         │
├─────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────────────────────────────┐
│  │           Frontend (React/Next.js 14)                   │
│  │  - Home: Landing page with CTAs                         │
│  │  - Client: Project creation + reputation lookup         │
│  │  - Freelancer: Dashboard + credentials display          │
│  │  - Verify: Third-party credential verification          │
│  │  Stack: React 18, Tailwind CSS, wagmi, RainbowKit      │
│  │  Port: localhost:3000                                   │
│  └──────────────────────────────────────────────────────────┘
│                          ↕
│                      REST API
│                   (HTTP/JSON)
│                          ↕
│  ┌──────────────────────────────────────────────────────────┐
│  │        Backend (Node.js/Express)                          │
│  │  6 Core Routes:                                           │
│  │  • GET /reputation/ - Fetch reputation scores            │
│  │  • POST /projects - Create project metadata              │
│  │  • GET /projects/ - Retrieve project status              │
│  │  • POST /credentials/mint - Generate W3C VC              │
│  │  • GET /credentials/verify - Verify credential           │
│  │  • GET /health - API health check                        │
│  │  Services:                                               │
│  │  • Reputation scoring (weighted average)                 │
│  │  • W3C VC credential generation                          │
│  │  • Event listener (contract events)                      │
│  │  Port: localhost:3001                                    │
│  └──────────────────────────────────────────────────────────┘
│                          ↕
│                  ethers.js Web3
│               (RPC calls + ABIs)
│                          ↕
│  ┌──────────────────────────────────────────────────────────┐
│  │     Smart Contracts (Solidity 0.8.24)                   │
│  │     Network: Polygon Amoy Testnet                       │
│  │                                                          │
│  │  ┌──────────────────┐      ┌──────────────────┐       │
│  │  │ EscrowContract   │      │ReputationRegistry│       │
│  │  ├──────────────────┤      ├──────────────────┤       │
│  │  │Functions:        │      │Functions:        │       │
│  │  │• createProject() │      │• registerCred()  │       │
│  │  │• fundProject()   │      │• getCredentials()│       │
│  │  │• submitDeliv()   │      │• calcRepScore()  │       │
│  │  │• approveComp()   │      │                 │       │
│  │  │• initiateDisp()  │      │State:           │       │
│  │  │• resolveDisp()   │      │• Freelancer → Creds    │
│  │  │                  │      │• Issuer → Weight      │
│  │  │State:            │      │• Score calculations   │
│  │  │• Projects map    │      └──────────────────┘       │
│  │  │• ProjectState    │                                │
│  │  │  enum           │      Events:                    │
│  │  │                  │      • CredentialMinted        │
│  │  │Events:           │                                │
│  │  │• ProjectCreated │                                │
│  │  │• ProjectFunded  │                                │
│  │  │• DelivSubmit    │                                │
│  │  │• ProjectComp    │                                │
│  │  │• CredentialMint │                                │
│  │  └──────────────────┘                               │
│  └──────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Flow 1: Reputation-Backed Project Creation

```
Client                  Frontend               Backend           Contracts
  │                        │                      │                  │
  ├──Enter address─────────>│                      │                  │
  │                        │                      │                  │
  │                        ├──GET /reputation────>│                  │
  │                        │                      ├─Query─────────────>│
  │                        │                      │<──Score back────────┤
  │                        │<─Reputation data─────┤                  │
  │<─Show score+discount───┤                      │                  │
  │                        │                      │                  │
  ├──Set amount($)─────────>│                      │                  │
  │ (with discount shown)  │                      │                  │
  ├──Fund escrow───────────>│                      │                  │
  │                        ├─Sign transaction───────────────────────>│
  │                        │                      │<─Fund received─────┤
  │<─Confirmation──────────┤<─Receipt─────────────┤                  │
  │                        │                      │                  │
```

### Flow 2: Credential Generation & Verification

```
Freelancer            Backend         Smart Contract       Verifier
    │                   │                    │                 │
    │ (completes work)  │                    │                 │
    ├──Submit delivery─>│                    │                 │
    │                   ├────Mark delivered──>│                 │
    │                   │                    │                 │
Client                  │                    │                 │
    │ (approves)        │                    │                 │
    ├─Approve completion>│                    │                 │
    │                   ├─Release funds────>│                 │
    │                   │                    │                 │
    │                   │<─CredentialMinted event──┐          │
    │                   │                    │    │          │
    │                   ├─Generate W3C VC   │    │          │
    │                   │ (with proof)       │    │          │
    │                   ├─Store hash────────>│    │          │
    │                   │                    │    │          │
    │<─Credential issued┤                    │    │          │
    │ (display in app)  │                    │    │          │
    │                   │                    │    │          │
    │ (share link)      │                    │    │          │
    │ ──────────────────────────────────────────────────────>│
    │                   │                    │               │
    │                   ├──GET /verify──────────────────────>│
    │                   │                    │    ✓ Valid    │
    │                   │<──Full credential with proof─────────┤
    │                   │                    │               │
    │                   │                    │    (offline)  │
    │                   │                    │    Verify sig │
    │                   │                    │    ✓ Authentic
    │                   │                    │               │
```

### Flow 3: Reputation Score Calculation

```
Backend                                    Smart Contracts
  │
  ├─Query freelancer address
  │        │
  │        ├─getCredentialHashes(freelancer)────────────>
  │        │<─array of credential hashes──────────────────┤
  │        │
  │        ├─For each credential:
  │        │  ├─getCredentialDetails(index)────────────>
  │        │  │<─{hash, issuer, issuedAt, weight}────────┤
  │        │
  ├─Calculate weighted average:
  │   score = Σ(weight[i]) / credentials.length
  │        │
  │        └─Return basis points (0-10000)
  │
  ├─Calculate discount:
  │   discount = (10000 - score)
  │   escrow_cost = amount * (10000 - discount) / 10000
  │
  └─Display to frontend user
```

---

## Component Specifications

### Frontend Component Hierarchy

```
App
├── RootLayout
│   ├── Header (RainbowKit ConnectButton)
│   └── Main Content
│
├── Home (/page.tsx)
│   ├── Header (branding + wallet connect)
│   ├── Hero (value prop)
│   ├── ActionCards
│   │   ├── ClientCard (→ /client)
│   │   └── FreelancerCard (→ /freelancer)
│   └── Features (3-column grid)
│
├── ClientFlow (/client/page.tsx)
│   ├── Form
│   │   ├── Freelancer lookup
│   │   │   └── [Reputation display when found]
│   │   ├── Project amount
│   │   ├── Duration
│   │   └── Description
│   └── Submit (Fund Escrow)
│
├── FreelancerDash (/freelancer/page.tsx)
│   ├── ReputationCard
│   │   ├── Score (%)
│   │   ├── Project count
│   │   ├── Avg rating
│   │   └── Last activity
│   └── CredentialsList
│       └── CredentialCard (repeating)
│           ├── Project type
│           ├── Client name
│           ├── Completion date
│           ├── Rating
│           └── [View credential link]
│
└── VerifyFlow (/verify/page.tsx)
    ├── CredentialIDInput
    ├── VerifyButton
    └── ResultDisplay
        ├── ValidBadge or InvalidBadge
        ├── CredentialDetails
        │   ├── Basic info
        │   ├── Project details
        │   └── Issuer
        └── VerificationTimestamp
```

### Backend Module Structure

```
server.js
├── Middleware
│   ├── CORS config
│   ├── Body parser
│   └── Error handler
│
├── Mock Data
│   ├── reputationScores{}
│   └── mockCredentials{}
│
├── Routes (6 endpoints)
│   ├── GET /api/health
│   ├── GET /api/reputation/:address
│   ├── POST /api/projects
│   ├── GET /api/projects/:projectId
│   ├── POST /api/credentials/:projectId/mint
│   └── GET /api/credentials/:credentialId/verify
│
├── Services (Internal)
│   ├── ReputationService
│   │   └── calculateScore()
│   ├── CredentialService
│   │   ├── generateVC()
│   │   └── verifyVC()
│   └── ProjectService
│       └── stateManagement()
│
└── Event Listeners (Future)
    ├── Contract event watcher
    ├── CredentialMinted handler
    └── Dispute handler
```

### Smart Contract State Diagram

```
EscrowContract

ProjectState enum:
  0: Created ──(fundProject)──> 1: Funded
  1: Funded ──(submitDeliv)──> 2: Delivered
  2: Delivered ──(approveComp)──> 3: Completed ──(mintCred)──> [Emit CredentialMinted]
                                        │
                        (initiateDisp)──v──> 4: Disputed ──(resolve)──> 3 or 5
                                             5: Refunded

ReputationRegistry

Data Structure:
  freelancer → [credentials array]
    each: {hash, issuer, issuedAt, weight}

Calculation:
  score = Σ(weight[i]) / count
  Result: 0-10000 (basis points)
```

---

## Technology Stack Justification

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | React 18 | Fast rendering, component reuse |
| Framework | Next.js 14 | Built-in routing, API routes, SSR |
| Styling | Tailwind CSS | Rapid UI development, responsive |
| Web3 UI | RainbowKit | Best UX for wallet connect |
| Web3 SDK | wagmi | React hooks for blockchain |
| Backend | Express | Lightweight, fast REST API |
| Runtime | Node.js | JavaScript full-stack |
| Smart Contracts | Solidity 0.8.x | EVM standard, battle-tested |
| Dev Tool | Hardhat | Best Solidity testing framework |
| Blockchain | Polygon Amoy | Fast, cheap testnet |
| Web3 Lib | ethers.js | Modern, async/await, best docs |
| Identity | W3C VC | Industry standard, portable |
| Signature | ECDSA | Native to Ethereum, no extra deps |

---

## Security Model

### Smart Contract Security
- ✅ Reentrancy protection (state check-effects)
- ✅ Access control (client/freelancer only)
- ✅ Integer overflow (Solidity 0.8+)
- ✅ Function visibility (internal/external)

### Backend Security
- ✅ Input validation on all endpoints
- ✅ CORS headers configured
- ✅ No private keys in code
- ✅ Error messages don't leak internals

### Frontend Security
- ✅ No hardcoded sensitive data
- ✅ Wallet integration via standard SDKs
- ✅ HTTPS ready (Next.js)
- ✅ XSS protection (React auto-escape)

### Data Flow Security
- ✅ Credentials signed cryptographically
- ✅ On-chain hash for immutability
- ✅ Off-chain JSON in storage
- ✅ Selective disclosure ready

---

## Scalability Considerations

### Current (MVP)
- Single backend instance
- In-memory mock data
- Synchronous API calls

### Phase 2
- Load balancer for backend
- Caching layer (Redis)
- Database for persistent data (PostgreSQL)

### Phase 3
- Event-driven architecture (Kafka/RabbitMQ)
- API rate limiting
- Credential revocation list
- Reputation decay algorithm

### Phase 4
- IPFS for credential metadata
- Graph indexing (The Graph)
- Subgraphs for reputation queries
- Distributed reputation oracle

---

## Error Handling Strategy

```
Frontend
├── Network errors → Retry + fallback UI
├── Validation → Show form errors
└── TX rejection → Show wallet error message

Backend
├── Missing params → 400 Bad Request
├── Contract error → 500 Server Error (log)
├── Timeout → 504 Gateway Timeout
└── All responses → {error, statusCode, timestamp}

Smart Contracts
├── Invalid state → require() revert
├── Re-entrancy → checked via state
├── Overflow → native SafeMath (Solidity 0.8+)
└── Event emit → if successful
```

---

## Testing Strategy

```
Unit Tests
├── EscrowContract
│   ├── createProject()
│   ├── fundProject()
│   ├── approveCompletion()
│   └── disputeResolution()
│
└── ReputationRegistry
    ├── registerCredential()
    ├── calculateScore()
    └── getCredentials()

Integration Tests
├── API endpoint consistency
├── Frontend ↔ Backend ↔ Contract
└── Full workflow (create → fund → complete → verify)

E2E Tests
├── Browser: Home → Client → Fund → Verify
├── Demo flow: 3-minute walkthrough
└── Error scenarios
```

---

**Diagram Version**: 1.0
**Last Updated**: 2026-04-21
**Maintained by**: SkillBond Team
