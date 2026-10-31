"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  ShieldCheck,
  Zap,
  Globe2,
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
  Layers,
  Sparkles,
  Server,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopyDemo = () => {
    navigator.clipboard.writeText("https://diskdabba.pages.dev/app/sample-demo-file");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* ============================================================ */}
      {/* FLOATING NAVBAR                                              */}
      {/* ============================================================ */}
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <nav className="flex items-center justify-between rounded-full border border-emerald-100/80 bg-white/95 px-5 py-2.5 shadow-lg shadow-emerald-900/5 backdrop-blur-md">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              <Share2 className="h-4 w-4" />
            </span>
            <span className="text-zinc-900">
              d<span className="text-emerald-600 font-extrabold">i</span>sk
              <span className="text-emerald-600 font-black">Dabba</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#preview" className="hover:text-emerald-600 transition-colors">
              Share Experience
            </a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-700 hover:text-emerald-600 px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 hover:shadow transition-all"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 text-zinc-600 hover:text-zinc-900 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-700 hover:text-emerald-600 py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-700 hover:text-emerald-600 py-1"
            >
              How It Works
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-700 hover:text-emerald-600 py-1"
            >
              Share Experience
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-700 hover:text-emerald-600 py-1"
            >
              FAQ
            </a>
            <hr className="border-zinc-100 my-1" />
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-sm font-semibold text-zinc-700 rounded-xl hover:bg-zinc-50"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
              >
                Join Us — Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
        {/* Soft background aura */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-200/30 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Upload, Share &amp; Vault Your Content
          </div>

          {/* Bold Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 max-w-4xl leading-[1.12]">
            Upload, Share &amp;{" "}
            <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-8">
              Monetize
            </span>{" "}
            Your Content
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl leading-relaxed">
            Creators upload files via our high-speed Web Dashboard. Viewers access them
            through lightweight, lightning-fast shareable links with zero buffering.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
            >
              <UploadCloud className="h-5 w-5" />
              Start Uploading — Free
            </Link>
            <a
              href="#preview"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              View Shared Demo
            </a>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            Free 5 GB storage • No credit card required • Production Backblaze B2 Vault
          </p>

          {/* Highlighted Feature Badges Row (Inspired by DiskWala) */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-700">
            <div className="flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-3.5 py-1.5 shadow-xs">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Direct S3 Uploads</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-3.5 py-1.5 shadow-xs">
              <Globe2 className="h-4 w-4 text-emerald-600" />
              <span>Global Cloudflare Edge</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-3.5 py-1.5 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Auto ₹300 Budget Cap</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LIVE SHARED LINK PREVIEW (Directly matching DiskWala app view) */}
      {/* ============================================================ */}
      <section id="preview" className="py-16 bg-zinc-50 border-y border-zinc-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Viewer Experience
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            How Your Shared Links Look to Users
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
            When you share a video or file, your recipients get this clean, distraction-free
            player card that opens instantly on mobile &amp; desktop.
          </p>

          {/* Centered Preview Card */}
          <div className="mt-10 mx-auto max-w-md bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xl shadow-zinc-200/50 text-center">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 mb-6">
              <Share2 className="h-3.5 w-3.5" />
              Shared File
            </div>

            {/* Circular Media Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100/70 text-emerald-600 mb-6 group cursor-pointer hover:scale-105 transition-transform">
              <FileVideo className="h-9 w-9 text-emerald-600 fill-emerald-600/10" />
            </div>

            {/* File Title */}
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight font-mono">
              @Ha**m**Go*t*d*026*2****63*4***05***4
            </h3>

            {/* Meta tags */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-600">
                video/mp4
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-600">
                9.82 MB
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <Play className="h-4 w-4 fill-white" />
                View &amp; Stream Now
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
              >
                <Download className="h-4 w-4 text-zinc-600" />
                Download File
              </Link>
            </div>

            {/* Copy Link helper */}
            <button
              onClick={handleCopyDemo}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-emerald-600 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy link to open in browser</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ENTERPRISE TRUST & INFRASTRUCTURE                            */}
      {/* ============================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-2">
            Cloud Infrastructure Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Powered by Enterprise Cloud Giants
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
            Your files never pass through intermediate servers. They stream directly to and from
            high-durability object vaults.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all">
              <HardDrive className="h-8 w-8 text-emerald-600 mb-3" />
              <div className="text-sm font-bold text-zinc-900">Backblaze B2</div>
              <div className="text-xs text-zinc-500 mt-0.5">S3 Object Vault</div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all">
              <Globe2 className="h-8 w-8 text-emerald-600 mb-3" />
              <div className="text-sm font-bold text-zinc-900">Cloudflare Edge</div>
              <div className="text-xs text-zinc-500 mt-0.5">Global 300+ Cities</div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all">
              <Server className="h-8 w-8 text-emerald-600 mb-3" />
              <div className="text-sm font-bold text-zinc-900">Supabase Auth &amp; DB</div>
              <div className="text-xs text-zinc-500 mt-0.5">PostgreSQL &amp; RLS</div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all">
              <ShieldCheck className="h-8 w-8 text-emerald-600 mb-3" />
              <div className="text-sm font-bold text-zinc-900">Cost Guard 300</div>
              <div className="text-xs text-zinc-500 mt-0.5">Budget Auto-Limiter</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES SECTION                                             */}
      {/* ============================================================ */}
      <section id="features" className="py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Why DiskDabba
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Built for Speed, Protection &amp; Creators
            </h2>
            <p className="mt-3 text-base text-zinc-600">
              Everything you need to store your digital assets with enterprise-grade durability and
              zero financial risk.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Presigned Direct Uploads</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Your browser uploads directly into Backblaze B2 using time-limited AWS S3
                signatures. Fast throughput with no intermediate server bottlenecks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold mb-6">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Protected ₹300 Budget Cap</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Never worry about unexpected cloud bills. Automated circuit breakers halt high-egress
                requests the instant spending approaches your safe monthly threshold.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold mb-6">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Streamable Share Links</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Generate clean, unique links with HTTP Byte-Range support so users can seek, scrub,
                and stream 4K/HD video files seamlessly in their browsers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple 3-Step Flow
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
              How DiskDabba Works
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg mb-4 shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold text-zinc-900">Create Free Account</h4>
              <p className="mt-2 text-sm text-zinc-600 max-w-xs">
                Sign up in seconds. You get an immediate 5 GB personal storage vault quota.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg mb-4 shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold text-zinc-900">Upload High-Speed Files</h4>
              <p className="mt-2 text-sm text-zinc-600 max-w-xs">
                Drag-and-drop video clips, photos, or documents. Uploads bypass servers directly into S3.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg mb-4 shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold text-zinc-900">Share &amp; Distribute</h4>
              <p className="mt-2 text-sm text-zinc-600 max-w-xs">
                Copy your shareable link. Viewers can preview and stream with zero sign-up friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ ACCORDION                                                */}
      {/* ============================================================ */}
      <section id="faq" className="py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Got Questions?
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How much storage do I get on DiskDabba?",
                a: "Every registered creator automatically gets 5 GB of high-speed cloud storage on our European Backblaze B2 cluster at zero cost.",
              },
              {
                q: "What is the maximum file upload size?",
                a: "Currently, files up to 100 MB per single file can be uploaded in one go. Multipart chunked uploads for multi-gigabyte files are supported under the creator tiers.",
              },
              {
                q: "Can viewers watch videos without downloading?",
                a: "Yes! DiskDabba generates secure signed URLs supporting HTTP Range headers, which allows modern browsers and media players to stream video without forcing full downloads.",
              },
              {
                q: "How does the ₹300/month cost protection work?",
                a: "Our backend continuously tallies bandwidth usage against live storage rates. If egress exceeds safety limits, non-critical downloads are gracefully paused so the platform budget is never exceeded.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-zinc-900 hover:text-emerald-600"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-zinc-400 transition-transform ${
                      openFaq === idx ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA BANNER                                             */}
      {/* ============================================================ */}
      <section className="py-20 bg-emerald-600 text-white text-center relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Ready to Vault &amp; Share Your Files?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 max-w-xl mx-auto">
            Join DiskDabba today. Start uploading your videos and documents with zero setup hassle.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-emerald-700 shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Get Started Now — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="py-12 bg-zinc-950 text-zinc-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-extrabold text-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
              <Share2 className="h-3.5 w-3.5" />
            </span>
            <span>
              d<span className="text-emerald-400">i</span>sk
              <span className="text-emerald-400">Dabba</span>
            </span>
          </div>

          <p className="text-center text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} DiskDabba. Secure, budget-safe cloud storage vault.
          </p>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link href="/login" className="hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-emerald-400 transition-colors">
              Sign Up
            </Link>
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
