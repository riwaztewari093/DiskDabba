"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update password. Link may have expired.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafcff] px-4 py-12">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 h-[450px] w-[450px] rounded-full bg-blue-400/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-sky-100/90 bg-white/90 p-8 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.12)] backdrop-blur-2xl">
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo.jpg"
              alt="DiskDabba"
              width={180}
              height={60}
              priority
              className="h-10 w-auto mx-auto object-contain rounded-md"
            />
          </Link>
          <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
            Set new password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter a strong password for your DiskDabba account
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900 border border-sky-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-600 mt-0.5" />
            <div>
              <p className="font-bold">Password Updated Successfully</p>
              <p className="text-xs text-sky-700 mt-1">
                Redirecting to your creator dashboard...
              </p>
            </div>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handlePasswordUpdate}>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-lg hover:shadow-sky-500/35 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
