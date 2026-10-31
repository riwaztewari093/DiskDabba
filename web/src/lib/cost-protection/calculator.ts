/**
 * Cost protection constants and default limits.
 * Calibrated against the starting ₹300/month budget (~$3.60 USD).
 */

export const COST_LIMITS = {
  // Monthly budget in INR
  MONTHLY_BUDGET_INR: 300,

  // Backblaze B2 Pricing:
  // $0.006 / GB / month storage => ~₹0.50 INR / GB
  // $0.01 / GB download egress => ~₹0.84 INR / GB (first 3x free or free via Cloudflare)
  STORAGE_COST_PER_GB_INR: 0.50,
  DOWNLOAD_COST_PER_GB_INR: 0.84,

  // Hard caps
  MAX_FILE_SIZE_MB: 100, // Maximum single file upload
  DEFAULT_USER_QUOTA_BYTES: 5 * 1024 * 1024 * 1024, // 5 GB default
  MAX_UPLOADS_PER_HOUR: 20, // Rate limit per user to prevent bots/abuse

  // System Circuit Breaker
  // When system-wide cost reaches 80% of budget (₹240), trigger warnings
  // When it reaches 95% (₹285), halt uploads to protect against billing overdraft
  WARNING_THRESHOLD_PERCENT: 80,
  HALT_THRESHOLD_PERCENT: 95,
};

export interface CostEstimate {
  totalStorageBytes: number;
  totalStorageGB: number;
  monthlyBandwidthBytes: number;
  monthlyBandwidthGB: number;
  estimatedStorageCostINR: number;
  estimatedBandwidthCostINR: number;
  totalEstimatedCostINR: number;
  budgetCapINR: number;
  budgetUtilizationPercent: number;
  status: "NORMAL" | "WARNING" | "EXCEEDED";
}

/**
 * Calculates current platform cost estimation based on real storage and bandwidth.
 */
export function calculateCostEstimate(
  totalStorageBytes: number,
  monthlyBandwidthBytes: number,
  budgetINR = COST_LIMITS.MONTHLY_BUDGET_INR
): CostEstimate {
  const totalStorageGB = totalStorageBytes / (1024 * 1024 * 1024);
  const monthlyBandwidthGB = monthlyBandwidthBytes / (1024 * 1024 * 1024);

  // First 10 GB storage free in B2
  const billableStorageGB = Math.max(0, totalStorageGB - 10);
  const estimatedStorageCostINR =
    billableStorageGB * COST_LIMITS.STORAGE_COST_PER_GB_INR;

  // First 3x storage free downloads in B2
  const freeBandwidthGB = totalStorageGB * 3;
  const billableBandwidthGB = Math.max(0, monthlyBandwidthGB - freeBandwidthGB);
  const estimatedBandwidthCostINR =
    billableBandwidthGB * COST_LIMITS.DOWNLOAD_COST_PER_GB_INR;

  const totalEstimatedCostINR = Math.round(
    (estimatedStorageCostINR + estimatedBandwidthCostINR) * 100
  ) / 100;

  const budgetUtilizationPercent = Math.min(
    100,
    Math.round((totalEstimatedCostINR / budgetINR) * 100)
  );

  let status: CostEstimate["status"] = "NORMAL";
  if (budgetUtilizationPercent >= COST_LIMITS.HALT_THRESHOLD_PERCENT) {
    status = "EXCEEDED";
  } else if (budgetUtilizationPercent >= COST_LIMITS.WARNING_THRESHOLD_PERCENT) {
    status = "WARNING";
  }

  return {
    totalStorageBytes,
    totalStorageGB: Math.round(totalStorageGB * 100) / 100,
    monthlyBandwidthBytes,
    monthlyBandwidthGB: Math.round(monthlyBandwidthGB * 100) / 100,
    estimatedStorageCostINR: Math.round(estimatedStorageCostINR * 100) / 100,
    estimatedBandwidthCostINR: Math.round(estimatedBandwidthCostINR * 100) / 100,
    totalEstimatedCostINR,
    budgetCapINR: budgetINR,
    budgetUtilizationPercent,
    status,
  };
}
