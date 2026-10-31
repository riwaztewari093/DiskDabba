"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User,
  Gift,
} from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCodeParam = searchParams.get("ref") || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refCodeParam);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            referred_by_code: referralCode.trim() || undefined,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If email confirmation is required and session is null
      if (data.user && !data.session) {
        setSuccess(
          "Account created! We've sent a confirmation email. Please check your inbox and verify your email to begin uploading."
        );
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
      if (error) {
        setError(error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to initialize Google Sign In.");
      }
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-sky-100/90 bg-white/90 p-8 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.12)] backdrop-blur-2xl">
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
          Create your creator account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Store, stream and monetize your content with 5 GB free vault
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900 border border-sky-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-600 mt-0.5" />
            <div>
              <p className="font-bold">Confirmation Email Sent</p>
              <p className="text-xs text-sky-700 mt-1">{success}</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-black"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <form className="mt-6 space-y-3.5" onSubmit={handleSignup}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                placeholder="Rudra"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
            >
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="refCode"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
            >
              Referral Code <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Gift className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="refCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                placeholder="e.g. dabba10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-lg hover:shadow-sky-500/35 active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 font-semibold text-slate-400">
            Or sign up with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99]"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign up with Google</span>
      </button>

      <p className="mt-4 text-center text-xs font-medium text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafcff] px-4 py-12">
      {/* Liquid Retina Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 h-[450px] w-[450px] rounded-full bg-blue-400/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="flex h-96 w-full max-w-md items-center justify-center rounded-3xl border border-sky-100 bg-white/90 p-8 shadow-xl">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
