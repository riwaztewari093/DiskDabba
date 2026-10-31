export const runtime = "edge";

import { createClient } from "@/lib/supabase/server";
import { formatBytes } from "@/lib/utils";
import { calculateCostEstimate } from "@/lib/cost-protection/calculator";
import { getStorageClient } from "@/lib/storage/s3-client";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  DollarSign,
  DownloadCloud,
  HardDrive,
  Lock,
  Server,
  Shield,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  // Aggregate user profiles and storage
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, storage_used, storage_limit, is_admin, created_at")
    .order("created_at", { ascending: false });

  const totalStorageBytes =
    profiles?.reduce((acc, p) => acc + (p.storage_used || 0), 0) ?? 0;

  // Aggregate monthly bandwidth
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: logs } = await supabase
    .from("bandwidth_logs")
    .select("bytes_served")
    .gte("created_at", thirtyDaysAgo);

  const monthlyBandwidthBytes =
    logs?.reduce((acc, l) => acc + (l.bytes_served || 0), 0) ?? 0;

  const cost = calculateCostEstimate(totalStorageBytes, monthlyBandwidthBytes);
  const { isMock, bucket } = getStorageClient();

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            System &amp; Cost Protection Center
          </h1>
          <p className="text-sm text-zinc-400">
            Real-time billing monitor and platform safeguards calibrated to your
            ₹300/mo budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
            <Server className="h-3.5 w-3.5 text-blue-400" />
            <span>
              Provider:{" "}
              {isMock ? (
                <span className="text-amber-400">Mock / Simulator</span>
              ) : (
                <span className="text-emerald-400">Backblaze B2</span>
              )}
            </span>
          </span>
        </div>
      </div>

      {/* Circuit Breaker / Budget Status Alert */}
      {cost.status === "NORMAL" ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-sm text-emerald-400">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>
              <strong>Budget Health: Optimal.</strong> Current projected monthly
              cost is ₹{cost.totalEstimatedCostINR} of ₹{cost.budgetCapINR} cap (
              {cost.budgetUtilizationPercent}% utilization).
            </span>
          </div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold uppercase">
            Active Safeguard
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-400">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <span>
              <strong>Budget Warning:</strong> Platform usage has reached ₹
              {cost.totalEstimatedCostINR} of ₹{cost.budgetCapINR} cap. New
              uploads will be rate-limited.
            </span>
          </div>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold uppercase">
            Warning
          </span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Cost vs Budget */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Est. Monthly Bill
            </span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            ₹{cost.totalEstimatedCostINR}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full ${
                cost.status === "NORMAL" ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.max(cost.budgetUtilizationPercent, 3)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Budget cap: ₹{cost.budgetCapINR}/month
          </p>
        </div>

        {/* Global Storage */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Storage Stored
            </span>
            <HardDrive className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatBytes(totalStorageBytes)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Est. cost: ₹{cost.estimatedStorageCostINR}/mo (10 GB free)
          </p>
        </div>

        {/* Bandwidth Usage */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              30d Download Bandwidth
            </span>
            <DownloadCloud className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatBytes(monthlyBandwidthBytes)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Est. cost: ₹{cost.estimatedBandwidthCostINR}/mo
          </p>
        </div>

        {/* Registered Users */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Registered Accounts
            </span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {profiles?.length ?? 0}
          </p>
          <p className="mt-1 text-xs text-zinc-500">5 GB default quota each</p>
        </div>
      </div>

      {/* User Governance Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
        <div className="border-b border-zinc-800 p-5">
          <h2 className="text-lg font-semibold text-white">User Accounts &amp; Quotas</h2>
          <p className="text-xs text-zinc-400">
            Inspect users and ensure individual accounts respect limits.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Storage Used</th>
                <th className="px-6 py-3">Quota Limit</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {profiles && profiles.length > 0 ? (
                profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium text-white">
                      {p.display_name || "Unnamed User"}
                      <div className="text-xs text-zinc-500">{p.id}</div>
                    </td>
                    <td className="px-6 py-4">{formatBytes(p.storage_used || 0)}</td>
                    <td className="px-6 py-4">{formatBytes(p.storage_limit || 0)}</td>
                    <td className="px-6 py-4">
                      {p.is_admin ? (
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                          Admin
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">User</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No users registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
