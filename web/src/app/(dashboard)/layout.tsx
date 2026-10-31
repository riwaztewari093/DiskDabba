import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatBytes } from "@/lib/utils";
import { Cloud, Folder, HardDrive, LogOut, Share2, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile from DB
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const storageUsed = profile?.storage_used ?? 0;
  const storageLimit = profile?.storage_limit ?? 5368709120; // 5 GB
  const usagePercentage = Math.min(
    100,
    Math.round((storageUsed / storageLimit) * 100)
  );
  const displayName =
    profile?.display_name || user.user_metadata?.full_name || user.email;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar navigation */}
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            📦
          </span>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            DiskDabba
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          >
            <Folder className="h-4 w-4" />
            <span>My Files</span>
          </Link>
          <Link
            href="/dashboard/shared"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Share2 className="h-4 w-4" />
            <span>Shared by Me</span>
          </Link>
          <Link
            href="/dashboard/trash"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Trash2 className="h-4 w-4" />
            <span>Trash</span>
          </Link>
        </nav>

        {/* Storage quota widget */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <HardDrive className="h-3.5 w-3.5 text-blue-600" />
            <span>Storage</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.max(usagePercentage, 2)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {formatBytes(storageUsed)}
            </span>{" "}
            used of {formatBytes(storageLimit)}
          </p>
        </div>

        {/* User bar & sign out */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="truncate text-xs">
              <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                {displayName}
              </p>
              <p className="truncate text-zinc-500">{user.email}</p>
            </div>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              title="Sign out"
              className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              📦
            </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">
              DiskDabba
            </span>
          </Link>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </form>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
