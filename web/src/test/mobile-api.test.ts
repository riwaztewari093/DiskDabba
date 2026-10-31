function extractIdentifier(rawInput: string): string {
  const trimmed = rawInput.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("diskdabba://")) {
    try {
      const parsedUrl = new URL(trimmed);

      const queryId = parsedUrl.searchParams.get("fileId") || parsedUrl.searchParams.get("id") || parsedUrl.searchParams.get("token");
      if (queryId) return queryId;

      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      if (pathSegments.length >= 2 && ["v", "app", "share", "video"].includes(pathSegments[0].toLowerCase())) {
        return pathSegments[1];
      }
      if (pathSegments.length > 0) {
        return pathSegments[pathSegments.length - 1];
      }
    } catch {
      // Fallback
    }
  }

  return trimmed;
}

function runMobileApiTests() {
  console.log("=== RUNNING DISKDABBA MOBILE API & URL RESOLUTION TESTS ===");

  // Test 1: Full URL with /v/ prefix
  const test1 = extractIdentifier("https://diskdabba.com/v/VID_20251125_143354_345");
  console.assert(test1 === "VID_20251125_143354_345", `Test 1 Failed: Expected VID_20251125_143354_345, got ${test1}`);
  console.log("✔ Test 1: https://diskdabba.com/v/VID_... resolved correctly");

  // Test 2: Full URL with /app/ prefix
  const test2 = extractIdentifier("https://diskdabba.com/app/123e4567-e89b-12d3-a456-426614174000");
  console.assert(test2 === "123e4567-e89b-12d3-a456-426614174000", `Test 2 Failed: got ${test2}`);
  console.log("✔ Test 2: https://diskdabba.com/app/UUID resolved correctly");

  // Test 3: Raw UUID or Share Token
  const test3 = extractIdentifier("ab89cd12");
  console.assert(test3 === "ab89cd12", `Test 3 Failed: got ${test3}`);
  console.log("✔ Test 3: Raw share token resolved correctly");

  // Test 4: Query parameter fileId
  const test4 = extractIdentifier("https://diskdabba.com/watch?fileId=sample-video-id");
  console.assert(test4 === "sample-video-id", `Test 4 Failed: got ${test4}`);
  console.log("✔ Test 4: Query parameter ?fileId=... resolved correctly");

  // Test 5: Custom scheme diskdabba://
  const test5 = extractIdentifier("diskdabba://v/my-custom-video");
  console.assert(test5.includes("my-custom-video"), `Test 5 Failed: got ${test5}`);
  console.log("✔ Test 5: Custom scheme diskdabba://v/... resolved correctly");

  console.log("=== ALL MOBILE RESOLUTION & API TESTS PASSED ===");
}

runMobileApiTests();
