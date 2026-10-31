export const runtime = "edge";

import { createClient } from "@/lib/supabase/server";
import { formatBytes } from "@/lib/utils";
import { calculateCostEstimate } from "@/lib/cost-protection/calculator";
import { getStorageClient } from "@/lib/storage/s3-client";
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  DownloadCloud,
  HardDrive,
  Lock,
  Server,
  Shield,
  Users,
  Smartphone,
  Link2,
  Radio,
  Activity,
  ExternalLink,
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

  // Fetch Mobile App Settings from system_settings
  const { data: appConfigSetting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "app_config")
    .maybeSingle();

  const appConfig = appConfigSetting?.value || {
    app_name: "DiskDabba Player",
    package_name: "com.diskdabba.player",
    latest_version_name: "1.0.0",
    min_supported_version_name: "1.0.0",
    maintenance_mode: false,
    app_links_active: true,
    enable_streaming: true,
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            System &amp; Cost Protection Center
          </h1>
          <p className="text-sm text-slate-400">
            Real-time billing monitor and platform safeguards calibrated to your
            ₹300/mo budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300">
            <Server className="h-3.5 w-3.5 text-sky-400" />
            <span>
              Provider:{" "}
              {isMock ? (
                <span className="text-amber-400">Mock / Simulator</span>
              ) : (
                <span className="text-sky-400">Backblaze B2 Vault</span>
              )}
            </span>
          </span>
        </div>
      </div>

      {/* Circuit Breaker / Budget Status Alert */}
      {cost.status === "NORMAL" ? (
        <div className="flex items-center justify-between rounded-2xl border border-sky-900/60 bg-sky-950/20 p-4 text-sm text-sky-300 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-400" />
            <span>
              <strong>Budget Health: Optimal.</strong> Projected monthly
              cost is ₹{cost.totalEstimatedCostINR} of ₹{cost.budgetCapINR} cap (
              {cost.budgetUtilizationPercent}% utilization).
            </span>
          </div>
          <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-bold uppercase text-sky-400 border border-sky-500/30">
            Active Safeguard
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-amber-900/60 bg-amber-950/20 p-4 text-sm text-amber-300 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <span>
              <strong>Budget Warning:</strong> Platform usage has reached ₹
              {cost.totalEstimatedCostINR} of ₹{cost.budgetCapINR} cap. New
              uploads will be rate-limited.
            </span>
          </div>
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase text-amber-400 border border-amber-500/30">
            Warning
          </span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Cost vs Budget */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Est. Monthly Bill
            </span>
            <DollarSign className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            ₹{cost.totalEstimatedCostINR}
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${
                cost.status === "NORMAL" ? "bg-gradient-to-r from-sky-400 to-blue-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.max(cost.budgetUtilizationPercent, 3)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Budget cap: ₹{cost.budgetCapINR}/month
          </p>
        </div>

        {/* Global Storage */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Cloud Storage Used
            </span>
            <HardDrive className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            {formatBytes(totalStorageBytes)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Est. cost: ₹{cost.estimatedStorageCostINR}/mo (10 GB free)
          </p>
        </div>

        {/* Bandwidth Usage */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              30d Bandwidth
            </span>
            <DownloadCloud className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            {formatBytes(monthlyBandwidthBytes)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Est. cost: ₹{cost.estimatedBandwidthCostINR}/mo
          </p>
        </div>

        {/* Registered Users */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Registered Accounts
            </span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            {profiles?.length ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">5 GB default quota each</p>
        </div>
      </div>

      {/* Android Mobile App Platform Status */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-sm p-6 sm:p-8 space-y-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">DiskDabba Native Android Readiness</h2>
              <p className="text-xs text-slate-400">
                Verified App Links endpoint active at <code className="text-sky-400 font-mono">/.well-known/assetlinks.json</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-sky-900/60 bg-sky-950/40 px-3.5 py-1 text-xs font-bold text-sky-400">
              <Radio className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
              <span>Edge APIs Live</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs font-bold uppercase text-slate-400 mb-1">Target Package</p>
            <p className="text-sm font-mono text-white font-bold">{appConfig.package_name}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs font-bold uppercase text-slate-400 mb-1">App Links Route</p>
            <p className="text-sm font-mono text-sky-400 font-bold">https://diskdabba.pages.dev/app/:id</p>
          </div>
        </div>
      </div>

      {/* Registered User Accounts Table */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-sm p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-4">Creator Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-extrabold uppercase text-slate-400">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Storage Used</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {profiles?.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-3 font-semibold text-white">
                    {p.display_name || "Creator"}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-400">
                    {formatBytes(p.storage_used || 0)}
                  </td>
                  <td className="py-3 px-3">
                    {p.is_admin ? (
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                        Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                        Creator
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
