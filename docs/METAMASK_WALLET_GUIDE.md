# 🦊 MetaMask Wallet Integration Guide

This guide explains how to use MetaMask with SkillBond and switch between test accounts.

---

## 📦 What's Already Installed

RainbowKit and Wagmi are pre-configured in the frontend for wallet connection:

```
✅ RainbowKit 2.2.10 - Wallet UI + connection logic
✅ Wagmi 3.6.3 - Hooks for contract interaction  
✅ ethers.js 6.16.0 - Backend contract calls
```

These handle:
- MetaMask connection popup
- Wallet switching
- Account change detection
- Transaction signing

---

## 🔧 Setup: Add Test Accounts to MetaMask

### Step 1: Open MetaMask
1. Click the MetaMask extension icon (top right)
2. Enter your password to unlock

### Step 2: Add Polygon Amoy Network
1. Click the network dropdown (top left, shows "Mainnet" or other network)
2. Click **"Add network"** or **"Add a custom network"**
3. Fill in details:
   - **Network name:** `Polygon Amoy`
   - **RPC URL:** `https://rpc-amoy.polygon.technology`
   - **Chain ID:** `80002`
   - **Currency symbol:** `POL`
   - **Block explorer:** `https://amoy.polygonscan.com`
4. Click **Save**
5. You're now on **Polygon Amoy testnet** ✅

### Step 3: Import Test Accounts

SkillBond has 3 demo accounts with different reputations:

#### Alice (95% Reputation - High)
1. In MetaMask, click **Account icon** (top right)
2. Click **"Import Account"**
3. Paste private key:
   ```
   WILL BE PROVIDED IN .env OR GENERATED
   ```
   For now, use: Your wallet's private key (the one already imported)

4. Account name: `Alice (95%)`
5. Click **"Import"**

#### Bob (72% Reputation - Medium)
**Note:** Bob's address is a demo address (not a real wallet):
- Address: `0x1234567890123456789012345678901234567890`
- This is read-only for demo purposes

#### Carol (40% Reputation - Low)
**Note:** Carol's address is also demo-only:
- Address: `0x0987654321098765432109876543210987654321`

---

## 💰 Fund Your Wallet (Alice)

Alice's wallet has limited MATIC for testnet transactions. Get more from the faucet:

1. Go to: https://faucet.polygon.technology/
2. Select **Polygon Amoy** testnet
3. Paste your Alice wallet address: `0x72f32C9b10e8669b5Fd139a00e03004eE4bd3b1D`
4. Click **Send MATIC**
5. Wait ~1-2 minutes
6. Check your MetaMask balance — it should update

**Current Balance:** 0.097 POL (used 0.003 for contract deployment)

---

## 🔄 How Wallet Connection Works

### Backend Flow (Server-Side)

SkillBond backend uses a **deploy wallet** for contract interactions:

```javascript
// backend/.env
PRIVATE_KEY=your_private_key_here  // Wallet that deployed contracts
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

**What it does:**
- Signs transactions server-side
- Manages contract deployments
- Holds project funds (escrow)

---

### Frontend Flow (Client-Side) - **NOT YET WIRED**

RainbowKit is installed but **wallet connection UI is not yet integrated into pages**. 

When implemented, it will work like this:

```typescript
// This is how it WILL work (not yet in UI):
import { useAccount, useContractWrite } from 'wagmi';

function HireFreelancer() {
  const { address, isConnected } = useAccount();
  
  if (!isConnected) {
    return <button>Connect MetaMask</button>;  // ← Will show wallet connection popup
  }
  
  // User is connected as: address
  // Now can sign transactions with their wallet
}
```

**What wallet connection enables:**
- View your account address
- Switch between accounts
- Sign transactions with your private key (never exposed)
- Pay transaction fees from your wallet

---

## 🔍 Testing with Different Accounts

### Scenario: Search for "alice.eth"

**Current state (demo mode):**
```
1. Open http://localhost:3000/search
2. Search: "alice.eth"
3. See results: Alice, 95.0% reputation, 5 projects
4. Click "HIRE"
5. (Frontend page incomplete - would need to connect wallet)
```

### How It Will Work (After Wallet Integration)

```
1. User clicks "Connect Wallet" button
2. MetaMask popup appears
3. User approves connection (account shown to SkillBond)
4. User's address displayed in top-right
5. User can click "Switch Account" to change MetaMask account
6. When "HIRE" is clicked, transaction is signed by user's connected wallet
7. Transaction fee is paid from user's wallet
8. SkillBond backend receives signed transaction
9. Funds are held in escrow on blockchain
```

---

## 📋 Demo Accounts Summary

| Name | Address | Reputation | Status | Private Key |
|------|---------|------------|--------|-------------|
| **Alice** | `0x72f32C9b10e8669b5Fd139a00e03004eE4bd3b1D` | 95% | ✅ Real funded account | In backend/.env |
| **Bob** | `0x1234567890123456789012345678901234567890` | 72% | 📖 Demo (read-only) | N/A |
| **Carol** | `0x0987654321098765432109876543210987654321` | 40% | 📖 Demo (read-only) | N/A |

---

## 🔑 Important Security Notes

⚠️ **NEVER share private keys** - Anyone with your private key can drain your wallet

⚠️ **Testnet only** - These are test accounts on Polygon Amoy (no real money)

⚠️ **Don't use production keys here** - This is MVP demo code

---

## 🚀 Next: Wire Up Wallet Connection UI

To fully integrate wallet connection, we would need to:

1. **Add "Connect Wallet" button** to landing page
2. **Show account address** when connected (top-right corner)
3. **Add "Switch Account" dropdown** to change wallets
4. **Wire up hire/apply buttons** to trigger transactions
5. **Show transaction status** (pending/confirmed)

Example button (not yet in codebase):
```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header>
      <h1>SkillBond</h1>
      <ConnectButton />  {/* ← Shows "Connect Wallet" or current address */}
    </header>
  );
}
```

---

## 🧪 Testing Checklist

- [ ] MetaMask installed in browser
- [ ] Polygon Amoy network added to MetaMask
- [ ] Alice wallet funded with test MATIC
- [ ] Can search for "alice.eth" on `/search` page
- [ ] Can see Alice's 95.0% reputation score
- [ ] Backend returning correct ENS-to-address mapping

---

## 📚 Reference Links

- **Polygon Faucet:** https://faucet.polygon.technology/
- **Polygon Amoy Explorer:** https://amoy.polygonscan.com/
- **RainbowKit Docs:** https://www.rainbowkit.com/
- **MetaMask Guide:** https://metamask.io/download/

---

## 💡 Current Status

**What's working:**
- ✅ Demo account data (Alice 95%, Bob 72%, Carol 40%)
- ✅ Backend ENS name resolution (alice.eth → address)
- ✅ Contract deployment on Polygon Amoy
- ✅ Backend wallet initialization

**What's not yet wired:**
- ❌ "Connect Wallet" button on frontend
- ❌ Account switching UI
- ❌ Transaction signing via MetaMask
- ❌ Live wallet balance display

---

**Next task:** Add wallet connection UI to make SkillBond interactive and ready for transactions!
