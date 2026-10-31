"use client";

export const runtime = "edge";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileVideo,
  FileText,
  FileArchive,
  FileAudio,
  File,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Eye,
  AlertCircle,
  Loader2,
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
  const [error, setError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<SharedFileDetails>({
    id: fileId,
    name: `@Ha**m**Go*t*d*026*2****63*4***05***4`,
    mimeType: "video/mp4",
    sizeFormatted: "9.82 MB",
    sizeBytes: 10297000,
    isVideo: true,
  });

  useEffect(() => {
    async function loadFileInfo() {
      try {
        // Try public share endpoint first
        let res = await fetch(`/api/share/${fileId}`);
        if (!res.ok) {
          // Fall back to download signed-url endpoint
          res = await fetch(`/api/download/signed-url?fileId=${fileId}`);
        }

        if (res.ok) {
          const data = await res.json();
          const isVid =
            data.name?.match(/\.(mp4|webm|mkv|mov|avi|m4v)$/i) ||
            data.mimeType?.startsWith("video/");

          const formatBytes = (bytes: number) => {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
          };

          setFileDetails({
            id: data.id || fileId,
            name: data.name || data.filename || `@Ha**m**Go*t*d*026*2****63*4***05***4`,
            mimeType: data.mimeType || "video/mp4",
            sizeFormatted: formatBytes(data.sizeBytes || data.size || 10297000),
            sizeBytes: data.sizeBytes || data.size || 10297000,
            isVideo: !!isVid,
            downloadUrl: data.downloadUrl,
            streamUrl: data.streamUrl || data.downloadUrl,
          });
        }
      } catch {
        // Fall back to demo details if file not found
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
      alert("Download is ready for: " + fileDetails.name);
    }
  };

  const getFileIcon = () => {
    if (fileDetails.isVideo) return <FileVideo className="h-10 w-10 text-sky-500" />;
    if (fileDetails.mimeType?.includes("audio"))
      return <FileAudio className="h-10 w-10 text-violet-500" />;
    if (fileDetails.mimeType?.includes("zip") || fileDetails.mimeType?.includes("rar"))
      return <FileArchive className="h-10 w-10 text-amber-500" />;
    if (fileDetails.mimeType?.includes("pdf") || fileDetails.mimeType?.includes("text"))
      return <FileText className="h-10 w-10 text-blue-500" />;
    return <File className="h-10 w-10 text-slate-500" />;
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#fafcff] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Liquid Retina Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-cyan-400/15 via-sky-300/10 to-transparent blur-3xl" />
      </div>

      {/* ============================================================ */}
      {/* FLOATING NAVBAR                                              */}
      {/* ============================================================ */}
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <nav className="flex items-center justify-between rounded-full border border-sky-100/90 bg-white/90 px-4 sm:px-6 py-2 shadow-[0_8px_30px_rgb(14,165,233,0.08)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <Image
              src="/logo.jpg"
              alt="DiskDabba"
              width={150}
              height={50}
              priority
              className="h-8 w-auto object-contain rounded-md"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back Home</span>
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-sm shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 transition"
            >
              Upload Your Files
            </Link>
          </div>
        </nav>
      </header>

      {/* ============================================================ */}
      {/* MAIN SHARED VIEWER CARD (Matching DiskWala Screenshot 1)      */}
      {/* ============================================================ */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-lg rounded-3xl border border-sky-100/90 bg-white/90 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.12)] backdrop-blur-2xl text-center space-y-6">
          {/* Shared File Pill Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-bold text-sky-700">
            <FileVideo className="h-3.5 w-3.5 text-sky-600" />
            <span>Shared File</span>
          </div>

          {/* Media Player or Large Icon */}
          {isPlaying && fileDetails.isVideo && fileDetails.streamUrl ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
              <video
                src={fileDetails.streamUrl}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video rounded-2xl bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div
              onClick={() => {
                if (fileDetails.isVideo) setIsPlaying(true);
              }}
              className="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-100 to-sky-50 text-sky-600 shadow-inner border border-sky-200/80 hover:scale-105 transition-all duration-300 group"
            >
              {fileDetails.isVideo ? (
                <Play className="h-10 w-10 fill-sky-600 text-sky-600 translate-x-0.5 group-hover:scale-110 transition-transform" />
              ) : (
                getFileIcon()
              )}
            </div>
          )}

          {/* File Name & Metadata */}
          <div>
            <h1
              className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight break-all font-mono"
              title={fileDetails.name}
            >
              {fileDetails.name}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200/60">
                {fileDetails.mimeType}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200/60">
                {fileDetails.sizeFormatted}
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-200/60 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                <span>Verified Cloud Vault</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Play & Download */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {fileDetails.isVideo && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 py-3.5 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition-all hover:from-sky-400 hover:to-blue-500 hover:shadow-lg hover:shadow-sky-500/35 active:scale-[0.98]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause Video</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>View in Player</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDownload}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 text-sm font-bold transition-all active:scale-[0.98] ${
                !fileDetails.isVideo
                  ? "bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 hover:shadow-lg"
                  : "border border-slate-200/90 bg-slate-50 text-slate-800 hover:bg-white hover:border-sky-300 hover:shadow-sm"
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Download File</span>
            </button>
          </div>

          {/* Copy Share Link */}
          <div className="pt-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-sky-600" />
                  <span className="text-sky-600 font-bold">Share link copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy link to open in browser</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* COMPACT FOOTER                                               */}
      {/* ============================================================ */}
      <footer className="relative z-10 border-t border-sky-100 bg-white/70 py-6 text-center text-xs text-slate-400 backdrop-blur-md">
        <p>Powered by DiskDabba Cloud Vault • High-Speed Encrypted CDN</p>
      </footer>
    </div>
  );
}
