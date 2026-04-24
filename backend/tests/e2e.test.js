/**
 * Phase 4: End-to-End Integration Tests
 * Tests complete user flows: Search → Project → Reputation
 * 
 * Run with: node backend/tests/e2e.test.js
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:3001';

// Test data
const TEST_CASES = [
  {
    name: 'Search Alice (High Reputation)',
    path: '/api/reputation/0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d',
    expectedScore: 9500,
    expectedPercent: 95.0,
  },
  {
    name: 'Search Bob (Medium Reputation)',
    path: '/api/reputation/0x1234567890123456789012345678901234567890',
    expectedScore: 7200,
    expectedPercent: 72.0,
  },
  {
    name: 'Search Carol (Low Reputation)',
    path: '/api/reputation/0x0987654321098765432109876543210987654321',
    expectedScore: 4000,
    expectedPercent: 40.0,
  },
  {
    name: 'Health Check',
    path: '/api/health',
    expectedStatus: 'ok',
  },
];

// HTTP request helper
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'GET',
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
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('\n🧪 PHASE 4: END-TO-END INTEGRATION TESTS\n');
  console.log('═'.repeat(60) + '\n');

  let passed = 0;
  let failed = 0;

  for (const testCase of TEST_CASES) {
    try {
      console.log(`📍 ${testCase.name}...`);

      const result = await makeRequest(testCase.path);

      if (result.status !== 200) {
        console.log(`   ❌ FAILED: HTTP ${result.status}`);
        failed++;
        continue;
      }

      // Validate response
      if (testCase.expectedScore) {
        if (result.data.score === testCase.expectedScore) {
          console.log(`   ✅ Score: ${result.data.score} (${result.data.scorePercent}%)`);
          console.log(`   ✅ Credentials: ${result.data.credentialCount}`);
          console.log(`   ✅ Source: ${result.data.source}`);
          passed++;
        } else {
          console.log(`   ❌ Score mismatch: expected ${testCase.expectedScore}, got ${result.data.score}`);
          failed++;
        }
      } else if (testCase.expectedStatus) {
        if (result.data.status === testCase.expectedStatus) {
          console.log(`   ✅ Status: ${result.data.status}`);
          console.log(`   ✅ Contracts initialized: ${result.data.contractsInitialized}`);
          passed++;
        } else {
          console.log(`   ❌ Status mismatch`);
          failed++;
        }
      }

      console.log();
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`);
      failed++;
    }
  }

  console.log('═'.repeat(60));
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ ALL TESTS PASSED!\n');
    console.log('Ready for Phase 4 - User Flow Testing:');
    console.log('1. Frontend search page working');
    console.log('2. Backend API responding correctly');
    console.log('3. Demo data accessible');
    console.log('4. All reputation tiers showing\n');
  } else {
    console.log('❌ SOME TESTS FAILED\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run
runTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
