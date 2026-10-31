"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UploadCloud,
  ShieldCheck,
  Zap,
  HardDrive,
  Share2,
  Play,
  Download,
  Copy,
  Check,
  ChevronDown,
  Menu,
  X,
  FileVideo,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Wallet,
  Smartphone,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopyDemo = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/app/6ae2b93ddfc8e29e5138c277`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fafcff] text-slate-900">
      {/* ============================================================ */}
      {/* LIQUID RETINA AMBIENT GLOW BACKDROPS                          */}
      {/* ============================================================ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-sky-300/15 via-cyan-400/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 right-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-blue-600/10 via-sky-400/10 to-transparent blur-3xl" />
      </div>

      {/* ============================================================ */}
      {/* FLOATING GLASS NAVBAR                                         */}
      {/* ============================================================ */}
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <nav className="flex items-center justify-between rounded-full border border-sky-100/80 bg-white/85 px-4 sm:px-6 py-2 shadow-[0_8px_30px_rgb(14,165,233,0.08)] backdrop-blur-xl transition-all">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <Image
              src="/logo.jpg"
              alt="DiskDabba — Store • Stream • Share"
              width={165}
              height={55}
              priority
              className="h-8 sm:h-9 w-auto object-contain rounded-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-sky-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-sky-600 transition-colors">
              How It Works
            </a>
            <a href="#rates" className="hover:text-sky-600 transition-colors">
              Publisher Rates
            </a>
            <a href="#preview" className="hover:text-sky-600 transition-colors">
              Shared Viewer
            </a>
            <a href="#faq" className="hover:text-sky-600 transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-sky-600 px-4 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Join Free</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden p-2 text-slate-700 hover:text-sky-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 flex flex-col gap-3 rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-3 duration-200">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-sky-600 py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-sky-600 py-1"
            >
              How It Works
            </a>
            <a
              href="#rates"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-sky-600 py-1"
            >
              Publisher Rates
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-sky-600 py-1"
            >
              Shared Viewer
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-sky-600 py-1"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-700"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-sky-500/25"
              >
                Join Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-800 shadow-sm backdrop-blur-md mb-8">
          <Sparkles className="h-4 w-4 text-sky-600 animate-pulse" />
          <span>Next-Gen Cloud Storage & Monetized Streaming</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto">
          Upload, Share &{" "}
          <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 bg-clip-text text-transparent">
            Monetize
          </span>{" "}
          Your Content
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Creators upload high-speed files & videos to our secure cloud vault. Viewers
          enjoy buffer-free Liquid Retina playback anywhere. Monetization starts from the 1st view.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/30 transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-2xl hover:shadow-sky-500/40 hover:-translate-y-1 active:translate-y-0"
          >
            <UploadCloud className="h-5 w-5" />
            <span>Start Uploading — Free</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/app/6ae2b93ddfc8e29e5138c277"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-7 py-4 text-base font-bold text-slate-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <Play className="h-4 w-4 text-sky-600 fill-sky-600" />
            <span>Try Shared Player Demo</span>
          </Link>
        </div>

        {/* Highlights Row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>Unlimited Cloud Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>Real-time Live View Count</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>Fast Global Payouts (UPI, Bank)</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* INTERACTIVE DEMO CARD (Matching DiskWala Screenshot 1)        */}
      {/* ============================================================ */}
      <section id="preview" className="relative z-10 py-12 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-sky-100/90 bg-white/80 p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.12)] backdrop-blur-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Shared File Experience
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What your audience sees when you share
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Clean, distraction-free player optimized for mobile and desktop screens.
            </p>
          </div>

          {/* The DiskWala-style card */}
          <div className="max-w-md mx-auto rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50 text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-bold text-sky-700">
              <FileVideo className="h-3.5 w-3.5" />
              <span>Shared File</span>
            </div>

            {/* Media Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100/70 text-sky-600 shadow-inner">
              <Play className="h-9 w-9 fill-sky-600 translate-x-0.5" />
            </div>

            {/* Title & Metadata */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-mono tracking-tight truncate">
                @Ha**m**Go*t*d*026*2****63*4***05***4
              </h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
                  video/mp4
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
                  9.82 MB
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/app/6ae2b93ddfc8e29e5138c277"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition hover:shadow-lg hover:from-sky-400 hover:to-blue-500"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Play Video</span>
              </Link>
              <Link
                href="/app/6ae2b93ddfc8e29e5138c277"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 py-3 text-sm font-bold text-slate-700 transition hover:bg-white hover:border-slate-300"
              >
                <Download className="h-4 w-4 text-slate-600" />
                <span>Download</span>
              </Link>
            </div>

            {/* Copy Link Row */}
            <button
              onClick={handleCopyDemo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-sky-600" />
                  <span className="text-sky-600">Link copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy share link to open in browser</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES GRID                                                */}
      {/* ============================================================ */}
      <section id="features" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
            Engineered For Creators
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Built for maximum speed, security and earnings
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            DiskDabba combines cloud infrastructure with high-performance video delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_10px_30px_rgba(14,165,233,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6 shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Direct Presigned S3 Uploads</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Files stream directly from your browser to Backblaze B2 Vault using secure pre-signed URLs. No bottleneck servers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_10px_30px_rgba(14,165,233,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6 shadow-sm">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Byte-Range Video Streaming</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Zero buffering with HTTP Range-Header seeking. High definition video plays immediately on mobile, tablets and desktop.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_10px_30px_rgba(14,165,233,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Creator CPM Monetization</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Monetize every eligible view. Tiered CPM calculations update your wallet balance daily with complete audit logs.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_10px_30px_rgba(14,165,233,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cost & Budget Protection</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Built-in budget caps protect against bandwidth spikes, with strict RLS policies and signed link expiration.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_10px_30px_rgba(14,165,233,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6 shadow-sm">
              <Share2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Granular Sharing Controls</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Make links Public, Unlisted, or Private. Share via Telegram, WhatsApp, social channels or embed directly.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_10px_30px_rgba(14,165,233,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6 shadow-sm">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Android App Readiness</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Equipped with App Links verification and RESTful endpoints ready for our future native Android application.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PUBLISHER RATES & PAYOUT PARTNERS (DiskWala Screenshot 2 & 3) */}
      {/* ============================================================ */}
      <section id="rates" className="relative z-10 py-20 bg-white/90 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
              Trusted Payout Partners
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Multiple Payout Methods
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Choose from a variety of global payout options. We process creator earnings with a low minimum threshold.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-sky-800">
              <span className="rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 flex items-center gap-1.5">
                ⚡ Fast Processing
              </span>
              <span className="rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 flex items-center gap-1.5">
                🌍 Global Payouts
              </span>
              <span className="rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 flex items-center gap-1.5">
                💳 Low Minimum Threshold (₹100)
              </span>
            </div>
          </div>

          {/* Payment Partner Logos Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {["UPI", "PhonePe", "Google Pay", "Bank Transfer", "Paytm"].map((provider) => (
              <div
                key={provider}
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:border-sky-300 hover:shadow-md transition"
              >
                <Wallet className="h-6 w-6 text-sky-600 mb-2" />
                <span className="text-sm font-bold text-slate-800">{provider}</span>
              </div>
            ))}
          </div>

          {/* CPM Rates Table */}
          <div className="mt-14 max-w-3xl mx-auto rounded-3xl border border-sky-100 bg-slate-50/60 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-600" />
              <span>How CPM Earnings Work</span>
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Your earnings are calculated daily based on a tiered CPM (Cost Per 1,000 Views) model. Rates reset every 24 hours.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-extrabold uppercase text-slate-400">
                    <th className="pb-3">Daily Views</th>
                    <th className="pb-3">CPM Rate</th>
                    <th className="pb-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">First 1,000 views</td>
                    <td className="py-3 text-sky-600 font-bold">₹85.00 ($1.00)</td>
                    <td className="py-3 text-xs text-slate-500">Base rate for the first 1K views each day</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">1,001 — 10,000 views</td>
                    <td className="py-3 text-sky-600 font-bold">₹105.00 ($1.25)</td>
                    <td className="py-3 text-xs text-slate-500">Enhanced tier for trending creators</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">10,000+ views</td>
                    <td className="py-3 text-sky-600 font-bold">₹130.00 ($1.55)</td>
                    <td className="py-3 text-xs text-slate-500">Premium publisher rate with priority support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3-STEP GUIDE                                                 */}
      {/* ============================================================ */}
      <section id="how-it-works" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
            Simple Workflow
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Start earning in 3 easy steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur-xl">
            <span className="text-5xl font-black text-sky-100">01</span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Upload Files</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Drag and drop videos or documents directly into your dashboard. Direct cloud upload ensures zero wait time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur-xl">
            <span className="text-5xl font-black text-sky-100">02</span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Share Your Link</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Copy your unique <code className="text-xs font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">/app/:id</code> link and distribute it across Telegram, WhatsApp or YouTube.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur-xl">
            <span className="text-5xl font-black text-sky-100">03</span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Stream & Earn</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Your viewers enjoy smooth playback, and your creator wallet records real-time impressions and earnings.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ SECTION                                                  */}
      {/* ============================================================ */}
      <section id="faq" className="relative z-10 py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
            Got Questions?
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What is the maximum file upload size?",
              a: "Currently, single uploads are supported up to 100 MB per file with unlimited storage bandwidth. This ensures ultra-fast speeds and safety caps.",
            },
            {
              q: "How does video streaming work without buffering?",
              a: "DiskDabba uses HTTP Byte-Range requests directly to Backblaze B2 Object Storage. When a user seeks or skips forward in a video, only the requested fragment is fetched instantly.",
            },
            {
              q: "When can creators withdraw their earnings?",
              a: "Creators can request a withdrawal once their wallet balance reaches ₹100. Payouts are made directly to UPI or bank accounts.",
            },
            {
              q: "Are my files encrypted and private?",
              a: "Yes. Every file uploaded is protected with Row Level Security (RLS) in PostgreSQL. You can set files to Private, Unlisted, or Public at any time.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-sky-100 bg-white/80 overflow-hidden shadow-xs backdrop-blur-md"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-base font-bold text-slate-900 hover:text-sky-600 transition"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openFaq === idx ? "rotate-180 text-sky-600" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="relative z-10 border-t border-sky-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Image
              src="/logo.jpg"
              alt="DiskDabba"
              width={150}
              height={50}
              className="h-8 w-auto object-contain"
            />
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} DiskDabba. Store • Stream • Share. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-sky-600 transition">Features</a>
            <a href="#rates" className="hover:text-sky-600 transition">Rates</a>
            <Link href="/login" className="hover:text-sky-600 transition">Log In</Link>
            <Link href="/signup" className="hover:text-sky-600 transition">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
