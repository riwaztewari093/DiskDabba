"use client";

export const runtime = "edge";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  FileVideo,
  FileText,
  FileArchive,
  FileAudio,
  File,
  Play,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface SharedFileDetails {
  id: string;
  name: string;
  mimeType: string;
  sizeFormatted: string;
  sizeBytes: number;
  isVideo: boolean;
  downloadUrl?: string;
  streamUrl?: string;
}

export default function SharedAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const fileId = resolvedParams.id;

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileDetails, setFileDetails] = useState<SharedFileDetails>({
    id: fileId,
    name: `@Ha**m**Go*t*d*026*2****63*4***05***4`,
    mimeType: "video/mp4",
    sizeFormatted: "9.82 MB",
    sizeBytes: 10297000,
    isVideo: true,
  });

  useEffect(() => {
    // Attempt to fetch real file details from our download/signed-url API
    async function loadFileInfo() {
      try {
        const res = await fetch(`/api/download/signed-url?fileId=${fileId}`);
        if (res.ok) {
          const data = await res.json();
          const isVid = data.name?.match(/\.(mp4|webm|mkv|mov|avi)$/i) || data.mimeType?.startsWith("video/");
          setFileDetails({
            id: fileId,
            name: data.name || `@Ha**m**Go*t*d*026*2****63*4***05***4`,
            mimeType: data.mimeType || "video/mp4",
            sizeFormatted: data.sizeFormatted || "9.82 MB",
            sizeBytes: data.size || 10297000,
            isVideo: !!isVid,
            downloadUrl: data.downloadUrl,
            streamUrl: data.downloadUrl,
          });
        }
      } catch {
        // Fall back to clean default demo details if ad-hoc ID
      } finally {
        setLoading(false);
      }
    }

    loadFileInfo();
  }, [fileId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (fileDetails.downloadUrl) {
      window.open(fileDetails.downloadUrl, "_blank");
    } else {
      // Trigger browser notification for demo
      alert("Download starting for: " + fileDetails.name);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* ============================================================ */}
      {/* FLOATING NAVBAR                                              */}
      {/* ============================================================ */}
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <nav className="flex items-center justify-between rounded-full border border-emerald-100/90 bg-white/95 px-5 py-2.5 shadow-md shadow-emerald-900/5 backdrop-blur-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight group">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              <Share2 className="h-4 w-4" />
            </span>
            <span className="text-zinc-900">
              d<span className="text-emerald-600 font-extrabold">i</span>sk
              <span className="text-emerald-600 font-black">Dabba</span>
            </span>
          </Link>

          {/* Action link */}
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Get 5 GB Free</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ============================================================ */}
      {/* MAIN SHARED FILE CARD (Matching DiskWala Screenshot 1)        */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-xl shadow-zinc-200/50 text-center relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-500" />

          {/* Shared File Pill Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 mb-6 shadow-xs">
            <Share2 className="h-3.5 w-3.5 text-emerald-600" />
            Shared File
          </div>

          {/* Large Circular Media Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-600 mb-6 shadow-inner transition-transform hover:scale-105">
            {fileDetails.isVideo ? (
              <FileVideo className="h-11 w-11 text-emerald-600 fill-emerald-600/10" />
            ) : (
              <FileText className="h-11 w-11 text-emerald-600" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight font-mono break-all px-2">
            {fileDetails.name}
          </h1>

          {/* Meta Badges */}
          <div className="mt-3.5 flex items-center justify-center gap-2.5">
            <span className="rounded-full bg-zinc-100 border border-zinc-200/60 px-3 py-1 text-xs font-semibold text-zinc-600">
              {fileDetails.mimeType}
            </span>
            <span className="rounded-full bg-zinc-100 border border-zinc-200/60 px-3 py-1 text-xs font-semibold text-zinc-600">
              {fileDetails.sizeFormatted}
            </span>
          </div>

          {/* Built-in Video Player (Opens on click) */}
          {isPlaying && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-zinc-200 bg-black aspect-video flex items-center justify-center shadow-md animate-in fade-in zoom-in-95 duration-200">
              {fileDetails.streamUrl ? (
                <video
                  src={fileDetails.streamUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-zinc-400">
                  <Play className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-medium text-white">Streaming Video Player</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Direct byte-range streaming via Backblaze B2 Vault
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] py-3.5 text-base font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              {isPlaying ? "Close Video Player" : "View & Stream in Player"}
            </button>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white hover:bg-zinc-50 active:scale-[0.99] py-3.5 text-base font-semibold text-zinc-700 shadow-xs transition-all cursor-pointer"
            >
              <Download className="h-4 w-4 text-zinc-600" />
              Download File
            </button>
          </div>

          {/* Copy link to open in browser */}
          <div className="mt-5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Link copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy link to open in browser</span>
                </>
              )}
            </button>
          </div>

          {/* Trust footnote */}
          <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted cloud storage hosted on DiskDabba</span>
          </div>
        </div>

        {/* Bottom promo */}
        <div className="mt-6 text-center">
          <Link
            href="/signup"
            className="text-xs sm:text-sm font-medium text-zinc-500 hover:text-emerald-700 transition"
          >
            Want to share your own videos and files?{" "}
            <span className="text-emerald-600 font-semibold underline underline-offset-4">
              Get free 5 GB storage &rarr;
            </span>
          </Link>
        </div>
      </main>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="py-6 border-t border-zinc-200/80 bg-white text-center text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <span className="font-semibold text-zinc-600">DiskDabba Vault</span>
          <span>&copy; {new Date().getFullYear()} DiskDabba. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
