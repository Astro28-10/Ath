/**
 * Advanced Phase 4 E2E Tests
 * Tests complete user flow: Search → Create → Fund → Complete
 * 
 * Run with: node backend/tests/advanced-e2e.test.js
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:3001';
const DEMO_ALICE = '0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d';
const DEMO_BOB = '0x1234567890123456789012345678901234567890';

// HTTP request helper
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data, error: e.message });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Run tests
async function runAdvancedTests() {
  console.log('\n🧪 PHASE 4: ADVANCED END-TO-END TESTS\n');
  console.log('═'.repeat(70) + '\n');

  const testResults = [];
  const addResult = (name, passed, details = '') => {
    testResults.push({ name, passed, details });
  };

  // =====================================================================
  // TEST 1: Reputation Lookup (Search Functionality)
  // =====================================================================
  try {
    console.log('📍 TEST 1: Reputation Lookup (Search Freelancer)');
    const result = await makeRequest('GET', `/api/reputation/${DEMO_ALICE}`);

    if (result.status === 200 && result.data.score === 9500) {
      console.log(`   ✅ Alice lookup successful: ${result.data.scorePercent}% reputation`);
      console.log(`   ✅ Credentials: ${result.data.credentialCount}`);
      console.log(`   ✅ Source: ${result.data.source}`);
      addResult('Search - Reputation Lookup', true);
    } else {
      console.log(`   ❌ Failed: Got score ${result.data.score}`);
      addResult('Search - Reputation Lookup', false, `Score: ${result.data.score}`);
    }
    console.log();
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
    addResult('Search - Reputation Lookup', false, error.message);
  }

  // =====================================================================
  // TEST 2: Create Project (Blockchain Integration)
  // =====================================================================
  try {
    console.log('📍 TEST 2: Create Project (Blockchain)');
    const projectData = {
      freelancer: DEMO_BOB,
      amount: '0.001', // Small amount for testing
      duration: 7,
      description: 'Test project - MVP validation',
    };

    const result = await makeRequest('POST', '/api/projects', projectData);

    if (result.status === 201 && result.data.success) {
      console.log(`   ✅ Project created successfully`);
      console.log(`   ✅ Project ID: ${result.data.projectId}`);
      console.log(`   ✅ Transaction: ${result.data.transactionHash.substring(0, 10)}...`);
      addResult('Create - Project Creation', true, `ID: ${result.data.projectId}`);
      
      // Store for later tests
      global.testProjectId = result.data.projectId;
    } else {
      console.log(`   ⚠ Response: ${JSON.stringify(result.data).substring(0, 100)}`);
      addResult('Create - Project Creation', false, result.data.error || 'Unknown error');
    }
    console.log();
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    console.log(`   ℹ Note: Project creation requires gas. If out of funds, this is expected.\n`);
    addResult('Create - Project Creation', false, error.message);
  }

  // =====================================================================
  // TEST 3: Get Project Details (Read from Blockchain)
  // =====================================================================
  if (global.testProjectId) {
    try {
      console.log('📍 TEST 3: Get Project Details (Read Blockchain)');
      const result = await makeRequest('GET', `/api/projects/${global.testProjectId}`);

      if (result.status === 200 && result.data.projectId) {
        console.log(`   ✅ Project retrieved successfully`);
        console.log(`   ✅ Freelancer: ${result.data.freelancer.substring(0, 10)}...`);
        console.log(`   ✅ Budget: ${result.data.budget || result.data.amount} wei`);
        addResult('Read - Project Details', true);
      } else {
        console.log(`   ❌ Failed to get project details`);
        addResult('Read - Project Details', false, 'No project data');
      }
      console.log();
    } catch (error) {
      console.log(`   ⚠ ERROR: ${error.message}`);
      console.log(`   ℹ Note: Project may not exist yet on blockchain.\n`);
      addResult('Read - Project Details', false, error.message);
    }
  }

  // =====================================================================
  // TEST 4: Fund Project (Escrow Integration)
  // =====================================================================
  if (global.testProjectId) {
    try {
      console.log('📍 TEST 4: Fund Project (Send Funds to Escrow)');
      const fundData = {
        amount: '0.001',
      };

      const result = await makeRequest('POST', `/api/projects/${global.testProjectId}/fund`, fundData);

      if (result.status === 200 && result.data.success) {
        console.log(`   ✅ Project funded successfully`);
        console.log(`   ✅ Amount: ${result.data.amount} POL`);
        console.log(`   ✅ Transaction: ${result.data.transactionHash.substring(0, 10)}...`);
        addResult('Fund - Project Funding', true);
      } else {
        console.log(`   ⚠ Response: ${JSON.stringify(result.data).substring(0, 100)}`);
        addResult('Fund - Project Funding', false, result.data.error || 'Unknown error');
      }
      console.log();
    } catch (error) {
      console.log(`   ⚠ ERROR: ${error.message}`);
      console.log(`   ℹ Note: If out of gas, this is expected.\n`);
      addResult('Fund - Project Funding', false, error.message);
    }
  }

  // =====================================================================
  // TEST 5: Complete Project (Release Escrow)
  // =====================================================================
  if (global.testProjectId) {
    try {
      console.log('📍 TEST 5: Complete Project (Release Escrow)');
      const result = await makeRequest('POST', `/api/projects/${global.testProjectId}/complete`, {});

      if (result.status === 200 && result.data.success) {
        console.log(`   ✅ Project completed successfully`);
        console.log(`   ✅ Funds released to freelancer`);
        console.log(`   ✅ Transaction: ${result.data.transactionHash.substring(0, 10)}...`);
        addResult('Complete - Project Completion', true);
      } else {
        console.log(`   ⚠ Response: ${JSON.stringify(result.data).substring(0, 100)}`);
        addResult('Complete - Project Completion', false, result.data.error || 'Unknown error');
      }
      console.log();
    } catch (error) {
      console.log(`   ⚠ ERROR: ${error.message}\n`);
      addResult('Complete - Project Completion', false, error.message);
    }
  }

  // =====================================================================
  // TEST 6: Multiple Account Search (Different Reputation Tiers)
  // =====================================================================
  try {
    console.log('📍 TEST 6: Multi-Account Search (Reputation Tiers)');
    
    const accounts = [
      { addr: DEMO_ALICE, name: 'Alice', expected: 9500 },
      { addr: DEMO_BOB, name: 'Bob', expected: 7200 },
    ];

    let allPassed = true;
    for (const acc of accounts) {
      const result = await makeRequest('GET', `/api/reputation/${acc.addr}`);
      if (result.status === 200 && result.data.score === acc.expected) {
        console.log(`   ✅ ${acc.name}: ${result.data.scorePercent}% reputation`);
      } else {
        console.log(`   ❌ ${acc.name}: Expected ${acc.expected}, got ${result.data.score}`);
        allPassed = false;
      }
    }
    
    addResult('Search - Multi-Account Lookup', allPassed);
    console.log();
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
    addResult('Search - Multi-Account Lookup', false, error.message);
  }

  // =====================================================================
  // TEST 7: Health & Readiness Check
  // =====================================================================
  try {
    console.log('📍 TEST 7: Backend Health Check');
    const result = await makeRequest('GET', '/api/health');

    if (result.status === 200 && result.data.status === 'ok') {
      console.log(`   ✅ Backend online and healthy`);
      console.log(`   ✅ Contracts initialized: ${result.data.contractsInitialized}`);
      addResult('Health - Backend Readiness', true);
    } else {
      console.log(`   ❌ Backend not ready`);
      addResult('Health - Backend Readiness', false, 'Not healthy');
    }
    console.log();
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
    addResult('Health - Backend Readiness', false, error.message);
  }

  // =====================================================================
  // SUMMARY REPORT
  // =====================================================================
  console.log('═'.repeat(70));
  console.log('\n📊 TEST SUMMARY:\n');

  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;

  testResults.forEach((r) => {
    const icon = r.passed ? '✅' : '❌';
    const detail = r.details ? ` (${r.details})` : '';
    console.log(`${icon} ${r.name}${detail}`);
  });

  console.log(`\n${'─'.repeat(70)}`);
  console.log(`Total: ${passed} passed, ${failed} failed out of ${testResults.length} tests`);
  console.log(`Success Rate: ${((passed / testResults.length) * 100).toFixed(1)}%`);
  console.log(`\n${'═'.repeat(70)}\n`);

  // Final assessment
  if (failed === 0) {
    console.log('✅ ALL TESTS PASSED - MVP FULLY OPERATIONAL!\n');
  } else if (passed >= testResults.length * 0.7) {
    console.log('⚠ MOST TESTS PASSED - MVP FUNCTIONAL WITH MINOR ISSUES\n');
  } else {
    console.log('❌ SIGNIFICANT ISSUES DETECTED - REVIEW ERRORS ABOVE\n');
  }

  console.log('📋 NEXT STEPS:');
  console.log('1. If gas errors: Request more testnet MATIC from faucet');
  console.log('2. If transaction errors: Verify contract addresses in .env');
  console.log('3. If API errors: Check backend logs above');
  console.log('4. Frontend testing: Navigate to http://localhost:3000/search');
  console.log('5. Search for demo accounts: Alice, Bob, Carol\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run
runAdvancedTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
