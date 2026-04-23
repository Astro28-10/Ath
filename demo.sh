#!/bin/bash

# SkillBond MVP Demo Script
# This script demonstrates the complete flow of SkillBond

echo "🚀 SkillBond MVP Demo"
echo "===================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}✓ Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
  echo "${RED}✗ Node.js not found${NC}"
  exit 1
fi
echo "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Start backend
echo ""
echo "${BLUE}Starting backend server...${NC}"
cd "$(dirname "$0")/backend"
npm start > backend.log 2>&1 &
BACKEND_PID=$!
sleep 2
echo "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Start frontend (development mode)
echo ""
echo "${BLUE}Starting frontend development server...${NC}"
cd "$(dirname "$0")/frontend"
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5
echo "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "${YELLOW}  → Open http://localhost:3000 in your browser${NC}"

# Demo endpoints
echo ""
echo "${BLUE}Demo Endpoints${NC}"
echo "==============="
echo "Frontend:  ${YELLOW}http://localhost:3000${NC}"
echo "Backend:   ${YELLOW}http://localhost:3001/api${NC}"
echo ""
echo "${BLUE}Demo Accounts${NC}"
echo "=============="
echo "Client (Demo):     0x0987654321098765432109876543210987654321"
echo "Freelancer (Demo): 0x1234567890123456789012345678901234567890"
echo ""

# Test the APIs
echo "${BLUE}Testing Backend APIs...${NC}"
echo "======================="

# Test health endpoint
echo -n "GET /api/health: "
HEALTH=$(curl -s http://localhost:3001/api/health)
if echo "$HEALTH" | grep -q "ok"; then
  echo "${GREEN}✓${NC}"
else
  echo "${RED}✗${NC}"
fi

# Test reputation endpoint
echo -n "GET /api/reputation/{address}: "
REP=$(curl -s http://localhost:3001/api/reputation/0x1234567890123456789012345678901234567890)
if echo "$REP" | grep -q "score"; then
  echo "${GREEN}✓${NC}"
else
  echo "${RED}✗${NC}"
fi

echo ""
echo "${BLUE}Demo Flow${NC}"
echo "=========="
echo ""
echo "${YELLOW}Step 1: Client creates a project${NC}"
echo "  → Navigate to 'I need a freelancer' on http://localhost:3000"
echo "  → Enter freelancer address: 0x1234567890123456789012345678901234567890"
echo "  → Click 'Check Reputation' to see their score"
echo "  → Set budget and create project"
echo ""

echo "${YELLOW}Step 2: Review reputation-based discount${NC}"
echo "  → Notice the freelancer's 85% reputation score"
echo "  → See the automatic 15% discount on escrow costs"
echo "  → This rewards high-performing freelancers"
echo ""

echo "${YELLOW}Step 3: Complete the project${NC}"
echo "  → Click 'Fund Project Escrow'"
echo "  → Freelancer submits deliverable"
echo "  → Client approves completion"
echo "  → Payment is automatically released"
echo ""

echo "${YELLOW}Step 4: Receive portable credential${NC}"
echo "  → Visit 'I am a freelancer' dashboard"
echo "  → See the newly earned completion credential"
echo "  → Click 'View credential' to see W3C VC format"
echo "  → Share via public verification link"
echo ""

echo "${YELLOW}Step 5: Verify credential${NC}"
echo "  → Go to http://localhost:3000/verify"
echo "  → Enter credential ID to verify authenticity"
echo "  → See cryptographic proof of completion"
echo ""

echo "${GREEN}Demo is running!${NC}"
echo ""
echo "${YELLOW}Press CTRL+C to stop${NC}"
echo ""

# Cleanup on exit
trap "
  echo ''
  echo '${YELLOW}Stopping demo servers...${NC}'
  kill $BACKEND_PID $FRONTEND_PID> /dev/null 2>&1
  echo '${GREEN}✓ Demo stopped${NC}'
" EXIT

# Keep script running
wait
