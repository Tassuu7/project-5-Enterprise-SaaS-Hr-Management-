/**
 * WorkSphere Enterprise HRMS - Enterprise Test Suite Runner
 * Layer: Testing & Verification
 */

const fs = require('fs');
const path = require('path');

let totalPassed = 0;
let totalFailed = 0;
let testCases = [];

global.describe = (suiteName, fn) => {
  console.log(`\n\x1b[36m● ${suiteName}\x1b[0m`);
  fn();
};

global.it = (testName, fn) => {
  testCases.push({ testName, fn });
};

global.expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
    }
  },
  toEqual: (expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected deep equality with ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
  },
  toBeGreaterThan: (expected) => {
    if (!(actual > expected)) {
      throw new Error(`Expected ${actual} to be greater than ${expected}`);
    }
  },
  toBeDefined: () => {
    if (actual === undefined || actual === null) {
      throw new Error(`Expected value to be defined`);
    }
  },
  toBeTruthy: () => {
    if (!actual) {
      throw new Error(`Expected truthy value but got ${actual}`);
    }
  },
});

async function runAllTests() {
  console.log('====================================================');
  console.log(' WorkSphere Enterprise HRMS - Test Suite Execution');
  console.log('====================================================');

  const unitDir = path.join(__dirname, 'unit');
  if (fs.existsSync(unitDir)) {
    const files = fs.readdirSync(unitDir).filter((f) => f.endsWith('.test.js'));
    for (const f of files) {
      require(path.join(unitDir, f));
    }
  }

  for (const t of testCases) {
    try {
      await t.fn();
      console.log(`  \x1b[32m✔ ${t.testName}\x1b[0m`);
      totalPassed++;
    } catch (err) {
      console.log(`  \x1b[31m✖ ${t.testName}\x1b[0m: ${err.message}`);
      totalFailed++;
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Test Results: \x1b[32m${totalPassed} Passed\x1b[0m, \x1b[${totalFailed ? '31' : '32'}m${totalFailed} Failed\x1b[0m of ${testCases.length} total tests`);
  console.log('====================================================');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
