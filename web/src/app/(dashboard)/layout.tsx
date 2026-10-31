export const runtime = "edge";

import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatBytes } from "@/lib/utils";
import {
  Folder,
  HardDrive,
  LogOut,
  Share2,
  BarChart3,
  UploadCloud,
  Shield,
  Sparkles,
  Home,
  Gift,
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
    <div className="flex min-h-screen bg-[#fafcff] text-slate-900">
      {/* ============================================================ */}
      {/* SIDEBAR NAVIGATION (Liquid Retina Sky-Blue Aesthetic)         */}
      {/* ============================================================ */}
      <aside className="hidden w-64 flex-col border-r border-sky-100 bg-white/90 p-5 md:flex justify-between backdrop-blur-xl">
        <div className="space-y-6">
          {/* Official Brand Logo */}
          <Link href="/dashboard" className="flex items-center px-1 py-1 group">
            <Image
              src="/logo.jpg"
              alt="DiskDabba"
              width={160}
              height={50}
              priority
              className="h-9 w-auto object-contain rounded-md"
            />
          </Link>

          {/* User Profile Card (Matching DiskWala creator chip) */}
          <div className="flex items-center gap-3 rounded-2xl bg-sky-50/70 border border-sky-100 p-3 shadow-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-sm shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500 font-mono" title={email}>
                {email}
              </p>
            </div>
          </div>

          {/* Navigation Links Group */}
          <div className="space-y-4">
            <div>
              <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Content & Revenue
              </p>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50/50 px-3.5 py-2.5 text-sm font-bold text-sky-700 shadow-xs border border-sky-200/70"
                >
                  <BarChart3 className="h-4 w-4 text-sky-600" />
                  <span>Analytics</span>
                </Link>

                <Link
                  href="/dashboard#upload"
                  className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100/80 hover:text-slate-900"
                >
                  <UploadCloud className="h-4 w-4 text-slate-400" />
                  <span>Upload Files</span>
                </Link>

                <Link
                  href="/dashboard#files"
                  className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100/80 hover:text-slate-900"
                >
                  <Folder className="h-4 w-4 text-slate-400" />
                  <span>File Manager</span>
                </Link>

                <Link
                  href="/dashboard#shared"
                  className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100/80 hover:text-slate-900"
                >
                  <Share2 className="h-4 w-4 text-slate-400" />
                  <span>Shared Links</span>
                </Link>
              </nav>
            </div>

            {isAdmin && (
              <div>
                <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                  Administration
                </p>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-sky-800 bg-sky-50 border border-sky-200/80 hover:bg-sky-100/70 transition"
                  >
                    <Shield className="h-4 w-4 text-sky-600" />
                    <span>Cost Guard Admin</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Storage Quota & Sign Out at Bottom */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {/* Storage Quota Widget */}
          <div className="rounded-2xl border border-sky-100 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5 text-sky-700">
                <HardDrive className="h-3.5 w-3.5" />
                Storage
              </span>
              <span className="font-mono text-slate-700 font-bold">{usagePercentage}%</span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                style={{ width: `${Math.max(usagePercentage, 2)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900">
                {formatBytes(storageUsed)}
              </span>{" "}
              used of {formatBytes(storageLimit)}
            </p>
          </div>

          {/* Links & Signout */}
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:border-sky-300 hover:text-sky-600 transition"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <form action="/auth/signout" method="POST" className="flex-1">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA & MOBILE TOP BAR                           */}
      {/* ============================================================ */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-sky-100 bg-white/95 px-4 py-2.5 md:hidden backdrop-blur-md">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="DiskDabba"
              width={140}
              height={45}
              priority
              className="h-7 w-auto object-contain rounded-md"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 border border-slate-200 rounded-full px-3 py-1"
            >
              Home
            </Link>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-1"
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
