# SkillBond - MVP Implementation

Reputation-backed micro-escrow protocol for freelance projects on blockchain.

## Project Structure

```
.
├── contracts/              # Smart contracts (Solidity)
│   ├── contracts/
│   │   ├── EscrowContract.sol
│   │   └── ReputationRegistry.sol
│   └── hardhat.config.js
├── backend/                # REST API (Node.js/Express)
│   └── server.js
└── frontend/               # React/Next.js UI
    └── app/
        ├── page.tsx (home)
        ├── client/page.tsx
        └── freelancer/page.tsx
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm 11+
- Wallet with testnet tokens (Polygon Amoy)

### Installation

**1. Smart Contracts**
```bash
cd contracts
npm install
npx hardhat compile
```

**2. Backend**
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:3001`

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## Core Features

### Smart Contract
- **EscrowContract**: Manages project funding, delivery, and payment
- **ReputationRegistry**: Stores and calculates freelancer reputation scores
- Reputation-based discounts on escrow amounts
- Dispute resolution with binary outcome
- Event emission for credential minting

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reputation/:address` | GET | Fetch reputation score |
| `/api/projects` | POST | Create a new project |
| `/api/projects/:id` | GET | Get project details |
| `/api/credentials/:id/mint` | POST | Mint completion credential |
| `/api/credentials/:id/verify` | GET | Verify credential authenticity |
| `/api/health` | GET | Health check |

### Frontend Flows

**Client Flow:**
1. Connect wallet
2. Look up freelancer reputation
3. Create project with reputation discount
4. Fund escrow
5. Approve completion and release funds
6. Receive completion credential

**Freelancer Flow:**
1. View reputation dashboard
2. See completed projects and credentials
3. Submit deliverable for approval
4. Receive W3C verifiable credentials

## Reputation System

- **Basis Points**: 0-10000 (0-100%)
- **Discount Calculation**: `actualAmount = projectAmount * (10000 - reputationScore) / 10000`
- **Example**: 85% reputation score = 15% discount on escrow

## W3C Verifiable Credentials

Each completed project generates a portable credential:
```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "ProjectCompletionCredential"],
  "issuer": {"id": "did:ethr:0xClient"},
  "credentialSubject": {
    "id": "did:ethr:0xFreelancer",
    "projectType": "web-development",
    "outcome": "completed-satisfactorily"
  }
}
```

## Development

### Contract Testing
```bash
cd contracts
npx hardhat test
```

### Deploy to Testnet
```bash
cd contracts
npx hardhat run scripts/deploy.js --network amoy
```

## Demo Sequence (3 minutes)

1. **Problem** (30s): Show freelance payment issues
2. **Solution** (45s): Live project creation with reputation lookup
3. **Technical** (45s): Credential minting and verification
4. **Impact** (30s): Cost comparison vs traditional escrow
5. **Vision** (30s): Portable reputation across platforms

## Next Steps (Post-MVP)

- [ ] Real payment rails (fiat on/off-ramps)
- [ ] Multi-milestone projects
- [ ] Hourly and retainer project types
- [ ] ZK-proof selective credential disclosure
- [ ] Decentralized dispute oracle
- [ ] Cross-chain support
- [ ] Advanced anti-Sybil mechanisms

## Technical Stack

| Layer | Tech |
|-------|------|
| Smart Contracts | Solidity 0.8.24, Hardhat |
| Backend | Node.js, Express, ethers.js |
| Frontend | React 18, Next.js 14, Tailwind CSS, wagmi |
| Identity | W3C VC Data Model |
| Blockchain | Polygon Amoy Testnet |

## Environment Variables

### Backend (.env)
```
PORT=3001
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=80002
```

## License

MIT
