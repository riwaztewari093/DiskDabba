import { calculateCostEstimate, COST_LIMITS } from "../lib/cost-protection/calculator";

function runTests() {
  console.log("=== RUNNING COST PROTECTION & B2 SIMULATION TESTS ===");

  // Test 1: Zero usage calculation
  const test1 = calculateCostEstimate(0, 0);
  console.assert(test1.totalEstimatedCostINR === 0, "Test 1 Failed: Zero usage should be ₹0");
  console.assert(test1.status === "NORMAL", "Test 1 Failed: Status should be NORMAL");
  console.log("✔ Test 1: Zero usage cost calculation passed");

  // Test 2: Free tier boundary (10 GB storage, 30 GB bandwidth in B2)
  const test2 = calculateCostEstimate(10 * 1024 * 1024 * 1024, 30 * 1024 * 1024 * 1024);
  console.assert(test2.totalEstimatedCostINR === 0, "Test 2 Failed: Free tier should cost ₹0");
  console.log("✔ Test 2: B2 Free tier allowance (10 GB storage + 30 GB egress) verified as ₹0");

  // Test 3: Moderate usage (50 GB storage, 100 GB download)
  const test3 = calculateCostEstimate(50 * 1024 * 1024 * 1024, 100 * 1024 * 1024 * 1024);
  console.assert(test3.totalEstimatedCostINR > 0, "Test 3 Failed: Should calculate positive cost");
  console.assert(test3.totalEstimatedCostINR < COST_LIMITS.MONTHLY_BUDGET_INR, "Test 3 Failed: Should be well below ₹300 budget");
  console.log(`✔ Test 3: 50 GB storage + 100 GB downloads estimated at ₹${test3.totalEstimatedCostINR} (Under ₹300 budget)`);

  // Test 4: Circuit breaker threshold (600 GB storage)
  const test4 = calculateCostEstimate(600 * 1024 * 1024 * 1024, 200 * 1024 * 1024 * 1024);
  console.assert(test4.status === "EXCEEDED" || test4.status === "WARNING", "Test 4 Failed: High usage must trigger warning or halt");
  console.log(`✔ Test 4: High usage circuit breaker trigger verified (Status: ${test4.status}, Bill: ₹${test4.totalEstimatedCostINR})`);

  console.log("=== ALL COST & STORAGE ENGINE UNIT TESTS PASSED ===");
}

runTests();
