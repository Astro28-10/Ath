# SkillBond MVP - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 20+
- npm 11+
- Git

### Installation

```bash
# 1. Install all dependencies
npm install

# 2. Install root-level packages
npm install -g concurrently

# 3. Compile smart contracts
cd contracts && npm run compile && cd ..

# 4. Start all services
npm start
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## 📝 Manual Setup (if preferred)

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Terminal 3 - Optional: Deploy Contracts
```bash
cd contracts
npm run compile
npx hardhat run scripts/deploy.js --network amoy
```

## 🎯 Demo Sequence (3 minutes)

### 1. Client Flow (1 minute)
1. Open http://localhost:3000
2. Click "I need a freelancer"
3. Enter freelancer address: `0x1234567890123456789012345678901234567890`
4. Click "Check Reputation" → See 85% score
5. Enter amount: `1.0` ETH
6. **See 15% reputation discount automatically applied**
7. Click "Fund Project Escrow"

### 2. Freelancer Flow (1 minute)
1. Click "I am a freelancer"
2. View reputation dashboard
3. See completed projects and credentials
4. Notice ⭐ 4.8 average rating

### 3. Verification Flow (1 minute)
1. Click "I am a freelancer"
2. Click "View credential" on any project
3. See W3C Verifiable Credential format
4. Go to http://localhost:3000/verify
5. Enter credential ID
6. See "Credential Verified" ✓

## 🧪 API Testing

### Get Reputation Score
```bash
curl http://localhost:3001/api/reputation/0x1234567890123456789012345678901234567890
```

Response:
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "reputationScore": 8500,
  "credentialCount": 12,
  "averageRating": 4.8,
  "lastActivity": "2024-01-10T14:22:00Z"
}
```

### Create a Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "clientAddress": "0x0987654321098765432109876543210987654321",
    "freelancerAddress": "0x1234567890123456789012345678901234567890",
    "amount": "1000000000000000000",
    "duration": 7,
    "description": "Build a React dashboard"
  }'
```

### Verify a Credential
```bash
curl http://localhost:3001/api/credentials/12345/verify
```

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  - Wallet Connection (RainbowKit)                        │
│  - Project Creation & Management                         │
│  - Credential Viewer & Verification                      │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
                   ↓
┌─────────────────────────────────────────────────────────┐
│                 Backend (Express.js)                     │
│  - REST API Endpoints                                    │
│  - Reputation Scoring Service                            │
│  - Credential Generation (W3C VC)                        │
│  - Blockchain Event Listener                             │
└──────────────────┬──────────────────────────────────────┘
                   │ ethers.js
                   ↓
┌─────────────────────────────────────────────────────────┐
│         Smart Contracts (Polygon Amoy Testnet)          │
│  - EscrowContract: Project funding & dispute logic       │
│  - ReputationRegistry: Credential scoring                │
└─────────────────────────────────────────────────────────┘
```

## 🔑 Key Concepts

### Reputation Discount
- Freelancers earn "reputation score" from completed projects
- Score reduces escrow requirements (e.g., 85% score = 15% discount)
- Incentivizes consistent, high-quality work

### W3C Verifiable Credentials
- Portable credentials independent of any single platform
- Cryptographically signed proof of completion
- Shareable across systems

### Basis Points
- Unit for precise percentage representation
- 10000 = 100%, 1000 = 10%, 100 = 1%, etc.
- Default values: 5000 = 50%, 8500 = 85%

## 📦 Project Structure

```
.
├── contracts/              # Smart Contracts (Solidity)
│   ├── contracts/
│   │   ├── EscrowContract.sol
│   │   └── ReputationRegistry.sol
│   ├── scripts/deploy.js
│   └── hardhat.config.js
├── backend/                # REST API Server
│   ├── server.js
│   └── package.json
├── frontend/               # React/Next.js UI
│   ├── app/
│   │   ├── page.tsx (home)
│   │   ├── client/page.tsx
│   │   ├── freelancer/page.tsx
│   │   └── verify/page.tsx
│   └── lib/contracts.ts
├── README.md
└── demo.sh
```

## 🚢 Deployment Checklist

- [ ] Set `.env` variables for testnet
- [ ] Pre-fund test wallets with testnet tokens
- [ ] Deploy contracts to Polygon Amoy
- [ ] Update contract addresses in frontend `.env`
- [ ] Test all three user flows end-to-end
- [ ] Record fallback demo video
- [ ] Create pitch deck with architecture diagram

## 📚 Learn More

- [W3C Verifiable Credentials](https://www.w3.org/2018/credentials/)
- [Hardhat Documentation](https://hardhat.org/)
- [Next.js Guide](https://nextjs.org/docs)
- [ethers.js API](https://docs.ethers.org/)

## 🆘 Troubleshooting

### Backend won't start
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
# Or on Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Clear node modules and reinstall
cd frontend && rm -rf node_modules .next && npm install && npm run dev
```

### Contracts won't compile
```bash
# Clear cache and redownload compiler
cd contracts && rm -rf cache artifacts && npx hardhat compile
```

---

**Ready to demo! 🎉**
