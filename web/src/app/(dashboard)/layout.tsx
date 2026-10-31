export const runtime = "edge";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatBytes } from "@/lib/utils";
import {
  Folder,
  HardDrive,
  LogOut,
  Share2,
  Trash2,
  BarChart3,
  UploadCloud,
  Shield,
  Layers,
  Sparkles,
  Menu,
} from "lucide-react";

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
    profile?.display_name || user.user_metadata?.full_name || "Creator";
  const email = user.email || "";
  const isAdmin = profile?.is_admin || false;

  return (
    <div className="flex min-h-screen bg-zinc-50/70 text-zinc-900">
      {/* ============================================================ */}
      {/* SIDEBAR NAVIGATION (Matching DiskWala Screenshot 2)          */}
      {/* ============================================================ */}
      <aside className="hidden w-64 flex-col border-r border-zinc-200/90 bg-white p-5 md:flex justify-between">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              <Share2 className="h-4 w-4" />
            </span>
            <span className="text-xl font-black tracking-tight text-zinc-900">
              d<span className="text-emerald-600 font-extrabold">i</span>sk
              <span className="text-emerald-600 font-black">Dabba</span>
            </span>
          </Link>

          {/* User Profile Card (Matching DiskWala user chip) */}
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm shadow-xs border border-emerald-200">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-zinc-900 flex items-center gap-1">
                {displayName}
              </p>
              <p className="truncate text-xs text-zinc-500 font-mono" title={email}>
                {email}
              </p>
            </div>
          </div>

          {/* Navigation Links Group */}
          <div className="space-y-4">
            <div>
              <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">
                Content
              </p>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm font-bold text-emerald-700 shadow-xs border border-emerald-100/80"
                >
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  <span>Analytics</span>
                </Link>

                <Link
                  href="/dashboard#upload"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <UploadCloud className="h-4 w-4 text-zinc-500" />
                  <span>Upload Files</span>
                </Link>

                <Link
                  href="/dashboard#files"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Folder className="h-4 w-4 text-zinc-500" />
                  <span>File Manager</span>
                </Link>

                <Link
                  href="/dashboard#shared"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Share2 className="h-4 w-4 text-zinc-500" />
                  <span>Shared Links</span>
                </Link>
              </nav>
            </div>

            {isAdmin && (
              <div>
                <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">
                  System
                </p>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-200/60 hover:bg-emerald-100/50 transition"
                  >
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Cost Guard Admin</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Storage Quota & Sign Out at Bottom */}
        <div className="space-y-4 pt-4 border-t border-zinc-100">
          {/* Storage Quota Widget */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <HardDrive className="h-3.5 w-3.5" />
                Storage
              </span>
              <span className="font-mono text-zinc-700">{usagePercentage}%</span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${Math.max(usagePercentage, 2)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-600">
              <span className="font-semibold text-zinc-900">
                {formatBytes(storageUsed)}
              </span>{" "}
              used of {formatBytes(storageLimit)}
            </p>
          </div>

          {/* Logout Action */}
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-zinc-600 shadow-xs hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA & MOBILE TOP BAR                           */}
      {/* ============================================================ */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-black">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
              <Share2 className="h-3.5 w-3.5" />
            </span>
            <span>
              d<span className="text-emerald-600">i</span>sk
              <span className="text-emerald-600">Dabba</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-600 border border-zinc-200 rounded-lg px-2.5 py-1"
            >
              Home
            </Link>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
