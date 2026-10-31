"use client";

export const runtime = "edge";

import { useState, useEffect, useRef } from "react";
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
  FileArchive,
  FileAudio,
  File,
  Trash2,
  Download,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  Eye,
  Wallet,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  Lock,
  Globe,
  Link2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  visibility?: string;
  view_count?: number;
  shareUrl?: string;
}

interface AnalyticsData {
  balanceInr: number;
  totalEarnedInr: number;
  paidInr: number;
  pendingInr: number;
  availableInr: number;
  cpmRateInr: number;
  totalViews: number;
  totalFiles: number;
  payoutStatus: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    balanceInr: 2.355 * 85,
    totalEarnedInr: 2.355 * 85,
    paidInr: 0,
    pendingInr: 0,
    availableInr: 2.355 * 85,
    cpmRateInr: 85.0,
    totalViews: 28,
    totalFiles: 1,
    payoutStatus: "TEST_MODE_PAUSED",
  });

  // Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Withdrawal States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("100");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("UPI");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState<string | null>(null);

  // Load real files and analytics
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. Fetch files
        const filesRes = await fetch("/api/files");
        if (filesRes.ok) {
          const filesData = await filesRes.json();
          if (filesData.files && filesData.files.length > 0) {
            setFiles(
              filesData.files.map((f: any) => ({
                ...f,
                shareUrl: `${window.location.origin}/app/${f.id}`,
              }))
            );
          } else {
            // Seed sample demo file if no files uploaded yet
            setFiles([
              {
                id: "6ae2b93ddfc8e29e5138c277",
                name: "sample_launch_video.mp4",
                size: 10297000,
                mime_type: "video/mp4",
                created_at: new Date().toISOString(),
                visibility: "public",
                view_count: 28,
                shareUrl: `${window.location.origin}/app/6ae2b93ddfc8e29e5138c277`,
              },
            ]);
          }
        }

        // 2. Fetch analytics
        const analyticsRes = await fetch("/api/analytics");
        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          if (aData.wallet) {
            setAnalytics(aData.wallet);
          }
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
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
    setUploadProgress(5);
    setUploadStatus("Requesting presigned upload credentials...");

    try {
      // 1. Presign request
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          mimeType: selectedFile.type || "application/octet-stream",
          sizeBytes: selectedFile.size,
        }),
      });

      if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error || "Failed to initialize upload");
      }

      const { uploadUrl, fileId, s3Key, key, isMock } = await presignRes.json();
      const resolvedKey = s3Key || key;

      setUploadStatus("Uploading directly to Backblaze B2 Vault...");

      // 2. Real XHR upload for accurate progress tracking
      if (!isMock && uploadUrl) {
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader(
            "Content-Type",
            selectedFile.type || "application/octet-stream"
          );

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 90);
              setUploadProgress(Math.max(10, percent));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
            } else {
              reject(new Error(`Storage rejected upload with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network failure during upload"));
          xhr.send(selectedFile);
        });
      } else {
        // Simulated progress for mock
        setUploadProgress(90);
      }

      setUploadStatus("Finalizing file record in database...");

      // 3. Complete record in Supabase
      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId,
          s3Key: resolvedKey,
          filename: selectedFile.name,
          sizeBytes: selectedFile.size,
          mimeType: selectedFile.type || "application/octet-stream",
          visibility: "public",
        }),
      });

      if (!completeRes.ok) {
        const cErr = await completeRes.json();
        throw new Error(cErr.error || "Failed to finalize database record");
      }

      setUploadProgress(100);
      setUploadStatus("Upload complete!");

      // 4. Update UI state
      const newFileItem: FileItem = {
        id: fileId,
        name: selectedFile.name,
        size: selectedFile.size,
        mime_type: selectedFile.type || "application/octet-stream",
        created_at: new Date().toISOString(),
        visibility: "public",
        view_count: 0,
        shareUrl: `${window.location.origin}/app/${fileId}`,
      };

      setFiles((prev) => [newFileItem, ...prev]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      alert("Upload failed: " + msg);
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`/api/files?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Failed to delete file");
      }
    } catch {
      alert("Error deleting file");
    }
  };

  const handleCopy = (id: string, url: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawMessage(null);

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: withdrawAmount,
          paymentMethod: withdrawMethod,
          paymentAddress: withdrawAddress,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWithdrawMessage(
          "Request recorded! Payout is marked as paused in test mode until genuine payment provider is verified."
        );
      } else {
        alert(data.error || "Failed to submit withdrawal");
      }
    } catch {
      alert("Network error submitting withdrawal request");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ============================================================ */}
      {/* 1. ANALYTICS & REVENUE OVERVIEW (DiskWala Screenshot 2)       */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Analytics
            </h1>
            <p className="text-sm text-slate-500">
              Track your revenue, daily and monthly performance.
            </p>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500"
          >
            <Wallet className="h-4 w-4" />
            <span>Withdraw Earnings</span>
          </button>
        </div>

        {/* 4 Revenue Overview Cards */}
        <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 sm:p-8 shadow-[0_10px_30px_rgba(14,165,233,0.06)] backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Wallet className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Revenue Overview</h2>
            <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
              Your overall paid, pending and available revenue breakdown.
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-xs">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  ₹{analytics.totalEarnedInr.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  ~${(analytics.totalEarnedInr / 85).toFixed(3)}
                </p>
              </div>
            </div>

            {/* Paid */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-xs">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Paid</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  ₹{analytics.paidInr.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400">Processed</p>
              </div>
            </div>

            {/* Available */}
            <div className="flex items-center gap-4 rounded-2xl border border-sky-200/80 bg-sky-50/40 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-xs">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-sky-700">Available</p>
                <p className="text-xl sm:text-2xl font-black text-sky-900">
                  ₹{analytics.availableInr.toFixed(2)}
                </p>
                <p className="text-[10px] text-sky-600 font-medium">Ready for payout</p>
              </div>
            </div>

            {/* Approved / Pending */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-xs">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Pending</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  ₹{analytics.pendingInr.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400">Verification</p>
              </div>
            </div>
          </div>

          {/* CPM Breakdown Info */}
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                <p className="font-bold text-slate-900">
                  How CPM Earnings Work (Base Rate: ₹{analytics.cpmRateInr.toFixed(2)} per 1,000 views)
                </p>
                <p>
                  Every unique view on your shared video links logs an eligible impression. Earnings automatically credit to your creator wallet. Payouts are in test mode until verified payout gateways are attached.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. DIRECT CLOUD UPLOAD INTERFACE                             */}
      {/* ============================================================ */}
      <section id="upload" className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Upload Content
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload files directly to the Backblaze B2 Vault. Max 100 MB per file.
          </p>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 sm:p-8 shadow-[0_10px_30px_rgba(14,165,233,0.06)] backdrop-blur-xl">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 p-8 text-center cursor-pointer transition hover:border-sky-400 hover:bg-sky-50/60 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-3 shadow-inner group-hover:scale-105 transition-transform">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {selectedFile ? selectedFile.name : "Click to select or drag and drop files"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {selectedFile
                ? `${formatBytes(selectedFile.size)} selected`
                : "Supports MP4, WebM, MKV, ZIP, PDF, audio and images up to 100 MB"}
            </p>
          </div>

          {/* Upload Progress and Status */}
          {uploading && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-sky-600">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {uploadStatus || "Uploading..."}
                </span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Action Button */}
          {selectedFile && !uploading && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpload}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload to Cloud Vault</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FILE MANAGER & SHARED CONTENT                             */}
      {/* ============================================================ */}
      <section id="files" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Your Files & Videos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your uploaded media and generate instant viewer links.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white/90 shadow-[0_10px_30px_rgba(14,165,233,0.06)] backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-extrabold uppercase text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Name</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {files.map((file) => {
                  const isVid =
                    file.name.match(/\.(mp4|webm|mkv|mov|avi)$/i) ||
                    file.mime_type.startsWith("video/");

                  return (
                    <tr key={file.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                            {isVid ? (
                              <FileVideo className="h-5 w-5" />
                            ) : (
                              <File className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="truncate font-bold text-slate-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(file.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-slate-600">
                        {formatBytes(file.size)}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {file.view_count ?? 0}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200/60 px-2.5 py-0.5 rounded-full">
                          <Globe className="h-3 w-3 text-sky-500" />
                          {file.visibility || "Public"}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/app/${file.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-sky-300 hover:text-sky-600 transition shadow-xs"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Viewer</span>
                          </Link>

                          <button
                            onClick={() =>
                              handleCopy(
                                file.id,
                                `${window.location.origin}/app/${file.id}`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-sky-300 hover:text-sky-600 transition shadow-xs"
                          >
                            {copiedId === file.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-sky-600" />
                                <span className="text-sky-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete File"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WITHDRAWAL MODAL                                             */}
      {/* ============================================================ */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-sky-100 bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Request Creator Withdrawal
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter your UPI ID or bank account details to cash out earnings.
            </p>

            {withdrawMessage ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 text-xs text-sky-900">
                  <p className="font-bold">Notice</p>
                  <p className="mt-1">{withdrawMessage}</p>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-bold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdrawRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Amount (INR) — Min ₹100
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Payout Method
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="BankTransfer">Direct Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Payment Address / UPI ID
                  </label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="e.g. yourname@oksbi or account details"
                    className="w-full rounded-2xl border border-slate-200 p-2.5 text-sm focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={withdrawLoading}
                    className="flex-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/25 disabled:opacity-50"
                  >
                    {withdrawLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
