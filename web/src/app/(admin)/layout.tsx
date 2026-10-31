import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  DollarSign,
  HardDrive,
  ShieldAlert,
  Users,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  // Verify Admin authorization
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, display_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      {/* Top Admin Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 px-6 py-3.5 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo-square.jpg"
                alt="DiskDabba"
                width={36}
                height={36}
                className="h-8 w-8 rounded-xl object-contain shadow-sm"
              />
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">
                  DiskDabba
                </span>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-sky-400 border border-sky-500/20 tracking-wider">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Creator App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl p-6 md:p-8">{children}</main>
    </div>
  );
}
