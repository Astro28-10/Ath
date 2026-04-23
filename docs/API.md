# SkillBond API Reference

**Endpoint**: `http://localhost:3001/api`
**Format**: JSON
**Authentication**: None (demo mode)

---

## Endpoints

### 1. GET /health
**Description**: Health check endpoint
**Auth**: None
**Response**: `200 OK`

```bash
curl http://localhost:3001/api/health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-04-21T23:30:00.000Z"
}
```

---

### 2. GET /reputation/:address
**Description**: Fetch reputation score for a freelancer
**Auth**: None
**Parameters**:
- `address` (string, required) - Ethereum address (0x...)

**Response**: `200 OK`

```bash
curl http://localhost:3001/api/reputation/0x1234567890123456789012345678901234567890
```

**Response**:
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "reputationScore": 8500,
  "credentialCount": 12,
  "averageRating": 4.8,
  "lastActivity": "2026-04-10T14:22:00.000Z"
}
```

**Reputation Score Interpretation**:
- Value: 0-10000 (basis points)
- 8500 = 85% reputation = 15% escrow discount
- Used for: Escrow cost reduction, freelancer ranking

---

### 3. POST /projects
**Description**: Create a new project proposal
**Auth**: None
**Body** (application/json):

```json
{
  "clientAddress": "0x0987654321098765432109876543210987654321",
  "freelancerAddress": "0x1234567890123456789012345678901234567890",
  "amount": "1000000000000000000",
  "duration": 7,
  "description": "Build a React dashboard"
}
```

**Response**: `201 Created`

```json
{
  "id": 145823,
  "clientAddress": "0x098765...",
  "freelancerAddress": "0x123456...",
  "amount": "1000000000000000000",
  "duration": 7,
  "description": "Build a React dashboard",
  "createdAt": "2026-04-21T23:30:00.000Z",
  "state": "created"
}
```

**Fields**:
- `amount`: Wei (multiply ETH by 10^18)
- `duration`: Days until deadline

---

### 4. GET /projects/:projectId
**Description**: Retrieve project details and current state
**Auth**: None
**Parameters**:
- `projectId` (string, required) - Project ID returned from POST /projects

**Response**: `200 OK`

```bash
curl http://localhost:3001/api/projects/145823
```

**Response**:
```json
{
  "id": "145823",
  "state": "funded",
  "freelancer": "0x1234567890123456789012345678901234567890",
  "client": "0x0987654321098765432109876543210987654321",
  "amount": "1000000000000000000",
  "reputationDiscount": 1500,
  "createdAt": 1713777000000,
  "deadline": 1714381800000,
  "deliverableHash": "bafybeihkoviema5eqheudqvnu6..."
}
```

**States**:
- `created` - Project initialized
- `funded` - Escrow funded
- `delivered` - Freelancer submitted work
- `completed` - Client approved, funds released
- `disputed` - Dispute initiated

---

### 5. POST /credentials/:projectId/mint
**Description**: Generate W3C Verifiable Credential for completed project
**Auth**: None
**Body** (application/json):

```json
{
  "freelancerAddress": "0x1234567890123456789012345678901234567890",
  "clientAddress": "0x0987654321098765432109876543210987654321",
  "satisfaction": 5
}
```

**Response**: `201 Created`

```json
{
  "credentialId": "https://skillbond.example/credentials/145823",
  "hash": "0xabcd1234...",
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://skillbond.example/contexts/completion-v1"
    ],
    "id": "https://skillbond.example/credentials/145823",
    "type": ["VerifiableCredential", "ProjectCompletionCredential"],
    "issuer": {
      "id": "did:ethr:0x0987654321098765432109876543210987654321"
    },
    "issuanceDate": "2026-04-21T23:30:00.000Z",
    "credentialSubject": {
      "id": "did:ethr:0x1234567890123456789012345678901234567890",
      "projectId": "145823",
      "projectType": "web-development",
      "durationDays": 7,
      "outcome": "completed-satisfactorily",
      "clientSatisfaction": 5
    },
    "proof": {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2026-04-21T23:30:00.000Z",
      "verificationMethod": "did:ethr:0x0987654321098765432109876543210987654321#controller",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFUzI1NksifQ..."
    }
  }
}
```

---

### 6. GET /credentials/:credentialId/verify
**Description**: Verify a W3C Verifiable Credential
**Auth**: None
**Parameters**:
- `credentialId` (string, required) - Credential project ID

**Response**: `200 OK`

```bash
curl http://localhost:3001/api/credentials/145823/verify
```

**Response (Valid)**:
```json
{
  "valid": true,
  "credential": {
    "id": "https://skillbond.example/credentials/145823",
    "issuer": "did:ethr:0x0987654321098765432109876543210987654321",
    "credentialSubject": {
      "id": "did:ethr:0x1234567890123456789012345678901234567890",
      "projectType": "web-development",
      "outcome": "completed-satisfactorily",
      "clientSatisfaction": 5
    },
    "proof": { ... }
  },
  "verifiedAt": "2026-04-21T23:30:15.000Z"
}
```

**Response (Invalid)**: `404 Not Found`
```json
{
  "error": "Credential not found"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error description",
  "statusCode": 400,
  "timestamp": "2026-04-21T23:30:00.000Z"
}
```

### Common Errors

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Missing required fields | Incomplete request body |
| 404 | Credential not found | Invalid credential ID |
| 500 | Internal server error | Server issue |

---

## Data Types

### Reputation Score (Basis Points)
- **Range**: 0-10000
- **Format**: Integer
- **Example**: 8500 = 85% = 15% discount
- **Calculation**: `(score / 10000) * 100 = percentage`

### Ethereum Address
- **Format**: 0x + 40 hex characters
- **Example**: `0x1234567890123456789012345678901234567890`
- **Validation**: Must start with 0x and be 42 chars total

### Wei Amount
- **Format**: String (to preserve precision)
- **Example**: `"1000000000000000000"` = 1 ETH
- **Conversion**: `wei / 1e18 = ETH`

### DID (Decentralized Identifier)
- **Format**: `did:ethr:0xAddress`
- **Example**: `did:ethr:0x1234567890123456789012345678901234567890`
- **Purpose**: W3C standard for decentralized identity

### IPFS Hash
- **Format**: Base32 encoded
- **Example**: `bafybeihkoviema5eqheudqvnu6...`
- **Purpose**: Content-addressable storage reference

---

## Rate Limiting

Currently: **None** (demo mode)
Future: 100 req/minute per IP

---

## CORS

**Allowed Origins**: `*` (demo)
**Methods**: GET, POST, OPTIONS
**Headers**: Content-Type, Authorization

---

## Example Workflows

### Workflow 1: Create & Fund Project
```bash
# Step 1: Check freelancer reputation
curl http://localhost:3001/api/reputation/0x1234567890123456789012345678901234567890

# Step 2: Create project (stores off-chain metadata)
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "clientAddress": "0x0987654321...",
    "freelancerAddress": "0x1234567890...",
    "amount": "1000000000000000000",
    "duration": 7,
    "description": "Web development"
  }'

# Response includes projectId: 145823

# Step 3: Sign & fund on-chain (via frontend/metamask)
# User approves transaction in wallet
```

### Workflow 2: Complete & Verify
```bash
# Step 1: Client approves project completion (on-chain)
# Smart contract emits CredentialMinted event

# Step 2: Backend listener detects event and mints credential
curl -X POST http://localhost:3001/api/credentials/145823/mint \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerAddress": "0x1234567890...",
    "clientAddress": "0x0987654321...",
    "satisfaction": 5
  }'

# Response includes credential JSON with proof

# Step 3: Third party verifies
curl http://localhost:3001/api/credentials/145823/verify
```

---

## Pagination

Not implemented in MVP.

---

## Webhooks

Not implemented in MVP.

---

## GraphQL

Not available. REST API only.

---

**Last Updated**: 2026-04-21
**Version**: 1.0 (MVP)
