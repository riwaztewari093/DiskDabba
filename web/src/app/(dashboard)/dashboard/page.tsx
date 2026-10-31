"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  HardDrive,
  Files,
  Share2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileVideo,
  FileText,
  Trash2,
  Download,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  shareUrl?: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    storageUsedBytes: 0,
    storageLimitBytes: 5368709120, // 5 GB
    activeShares: 0,
  });

  // Load files and stats
  useEffect(() => {
    // Demo seed item so user sees immediate results even on a brand-new account
    const sampleDemoFile: FileItem = {
      id: "6ae2b93ddfc8e29e5138c277",
      name: "sample_launch_video.mp4",
      size: 10297000,
      mime_type: "video/mp4",
      created_at: new Date().toISOString(),
      shareUrl: `${window.location.origin}/app/6ae2b93ddfc8e29e5138c277`,
    };

    setFiles([sampleDemoFile]);
    setStats({
      totalFiles: 1,
      storageUsedBytes: 10297000,
      storageLimitBytes: 5368709120,
      activeShares: 1,
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 100 * 1024 * 1024) {
        alert("File size exceeds safety cap of 100 MB per file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);
    setUploadStatus("Requesting secure presigned S3 URL...");

    try {
      // 1. Request presigned URL from our API
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type || "application/octet-stream",
          sizeBytes: selectedFile.size,
        }),
      });

      if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error || "Failed to get presigned upload URL");
      }

      const { uploadUrl, fileId, key, isMock } = await presignRes.json();
      setUploadProgress(40);
      setUploadStatus("Uploading directly to Backblaze B2 Vault...");

      // 2. Direct upload to S3 if not mock
      if (!isMock && uploadUrl) {
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type || "application/octet-stream",
          },
          body: selectedFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Direct S3 upload failed");
        }
      }

      setUploadProgress(80);
      setUploadStatus("Finalizing file record in database...");

      // 3. Complete the upload
      await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId,
          key,
          filename: selectedFile.name,
          sizeBytes: selectedFile.size,
          mimeType: selectedFile.type || "application/octet-stream",
        }),
      });

      setUploadProgress(100);
      setUploadStatus("Upload complete!");

      // 4. Add to state
      const newFileItem: FileItem = {
        id: fileId,
        name: selectedFile.name,
        size: selectedFile.size,
        mime_type: selectedFile.type || "application/octet-stream",
        created_at: new Date().toISOString(),
        shareUrl: `${window.location.origin}/app/${fileId}`,
      };

      setFiles((prev) => [newFileItem, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles + 1,
        storageUsedBytes: prev.storageUsedBytes + selectedFile.size,
        activeShares: prev.activeShares + 1,
      }));

      setSelectedFile(null);
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      alert("Upload failed: " + msg);
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  const copyShareLink = (id: string, url?: string) => {
    const finalUrl = url || `${window.location.origin}/app/${id}`;
    navigator.clipboard.writeText(finalUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* ============================================================ */}
      {/* TITLE & BREADCRUMB (Matching DiskWala Screenshot 2)          */}
      {/* ============================================================ */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-emerald-600" />
          <span>Analytics</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track your storage capacity, shared links, and vault performance.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 4 STAT OVERVIEW CARDS (Matching DiskWala Screenshot 2)       */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <span>Overview Summary</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Files */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-xs">
              <Files className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500">Total Files</p>
              <p className="text-xl font-extrabold text-zinc-900 mt-0.5">
                {stats.totalFiles}
              </p>
            </div>
          </div>

          {/* Card 2: Storage Used */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-xs">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500">Storage Used</p>
              <p className="text-xl font-extrabold text-zinc-900 mt-0.5">
                {formatBytes(stats.storageUsedBytes)}
              </p>
            </div>
          </div>

          {/* Card 3: Active Shares */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 shadow-xs">
              <Share2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500">Shareable Links</p>
              <p className="text-xl font-extrabold text-zinc-900 mt-0.5">
                {stats.activeShares}
              </p>
            </div>
          </div>

          {/* Card 4: Safety Quota */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500">Available Limit</p>
              <p className="text-xl font-extrabold text-zinc-900 mt-0.5">
                {formatBytes(stats.storageLimitBytes)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DIRECT DRAG-AND-DROP UPLOAD SECTION                          */}
      {/* ============================================================ */}
      <section id="upload" className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-emerald-600" />
              <span>Instant High-Speed Upload</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Files upload straight into your Backblaze B2 S3 vault. Max 100 MB per file.
            </p>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs group-hover:scale-105 transition-transform mb-4">
              <UploadCloud className="h-8 w-8" />
            </div>
            <p className="text-sm font-bold text-zinc-800">
              {selectedFile ? selectedFile.name : "Click to select a file or drag & drop here"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supports MP4, MKV, PDF, ZIP, PNG, JPG (up to 100 MB)
            </p>
          </label>

          {selectedFile && (
            <div className="mt-6 flex items-center gap-3">
              <button
                disabled={uploading}
                onClick={handleUpload}
                className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {uploading ? "Uploading to B2 Vault..." : "Start Secure Upload"}
              </button>
              <button
                disabled={uploading}
                onClick={() => setSelectedFile(null)}
                className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
            </div>
          )}

          {uploadStatus && (
            <div className="mt-4 w-full max-w-xs">
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-center font-medium">
                {uploadStatus}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* RECENT FILES & SHARING MANAGER (Matching DiskWala style)     */}
      {/* ============================================================ */}
      <section id="files" className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Files className="h-5 w-5 text-emerald-600" />
              <span>Your Vault Files &amp; Share Links</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Click any link to inspect the viewer screen or copy the link to share.
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {files.map((file) => {
            const isVid = file.mime_type.startsWith("video/") || file.name.endsWith(".mp4");
            return (
              <div
                key={file.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/70 p-3 rounded-2xl transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    {isVid ? (
                      <FileVideo className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        {file.mime_type}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/app/${file.id}`}
                    target="_blank"
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Open Viewer</span>
                  </Link>

                  <button
                    onClick={() => copyShareLink(file.id, file.shareUrl)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    {copiedId === file.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Share Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW CPM & BANDWIDTH WORKS (Directly inspired by DiskWala)     */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 text-sm font-bold mb-2">
          <Info className="h-4 w-4" />
          <span>How Cost Safeguards &amp; Streaming Work</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-3xl">
          DiskDabba is calibrated to provide maximum free storage while keeping your infrastructure
          costs safely locked under ₹300/month. File downloads use HTTP Range headers, allowing
          direct video streaming with zero server overhead.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-2.5 pr-4">Metric</th>
                <th className="py-2.5 px-4">Threshold</th>
                <th className="py-2.5 pl-4">Protection Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
              <tr>
                <td className="py-3 pr-4 font-bold text-zinc-900">Per-User Storage</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">5 GB Free</td>
                <td className="py-3 pl-4 text-zinc-500">
                  Allocated automatically upon registration
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-zinc-900">Max Upload Size</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">100 MB / file</td>
                <td className="py-3 pl-4 text-zinc-500">
                  Direct presigned cryptographic PUT into Backblaze B2
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-zinc-900">Monthly Budget</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">₹300 / mo Cap</td>
                <td className="py-3 pl-4 text-zinc-500">
                  Automated circuit breakers prevent unexpected overage
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
