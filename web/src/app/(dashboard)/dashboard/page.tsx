import { createClient } from "@/lib/supabase/server";
import { formatBytes } from "@/lib/utils";
import {
  Clock,
  Files,
  HardDrive,
  Share2,
  UploadCloud,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch real database records for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single();

  const { count: fileCount } = await supabase
    .from("files")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id || "")
    .eq("is_trashed", false);

  const { count: shareCount } = await supabase
    .from("shares")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user?.id || "");

  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || "User";
  const storageUsed = profile?.storage_used ?? 0;
  const storageLimit = profile?.storage_limit ?? 5368709120;

  return (
    <div className="space-y-8">
      {/* Top greeting banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {displayName}!
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your personal cloud storage is active and encrypted with Row-Level
            Security.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
          <UserCheck className="h-3.5 w-3.5" />
          <span>Authenticated as {user?.email}</span>
        </div>
      </div>

      {/* Stats overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Files
            </span>
            <Files className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {fileCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Stored in your Dabba</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Storage Used
            </span>
            <HardDrive className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatBytes(storageUsed)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Limit: {formatBytes(storageLimit)}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Shares
            </span>
            <Share2 className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {shareCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Public links created</p>
        </div>
      </div>

      {/* Main Files Area (Stage 2 Empty State / Stage 3 Upload Target) */}
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Your cloud vault is ready
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
          Authentication is verified and working. File uploads with direct-to-R2
          presigned URLs will be enabled in Stage 3.
        </p>
      </div>
    </div>
  );
}
