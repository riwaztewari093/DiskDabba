export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePresignedDownloadUrl } from "@/lib/storage/presign";
import { formatBytes } from "@/lib/utils";

function extractIdentifier(rawInput: string): string {
  const trimmed = rawInput.trim();

  // If it's a full URL:
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsedUrl = new URL(trimmed);
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      // Look for /v/:id or /app/:id or /share/:id or last segment
      if (pathSegments.length >= 2 && ["v", "app", "share", "video"].includes(pathSegments[0].toLowerCase())) {
        return pathSegments[1];
      }
      if (pathSegments.length > 0) {
        return pathSegments[pathSegments.length - 1];
      }
      // Check query params ?fileId=... or ?id=... or ?token=...
      const queryId = parsedUrl.searchParams.get("fileId") || parsedUrl.searchParams.get("id") || parsedUrl.searchParams.get("token");
      if (queryId) return queryId;
    } catch {
      // Continue to fallback
    }
  }

  // Otherwise return trimmed value
  return trimmed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get("url");
    const rawId = searchParams.get("id");
    const rawToken = searchParams.get("token");

    const identifier = extractIdentifier(rawUrl || rawId || rawToken || "");

    if (!identifier) {
      return NextResponse.json(
        { error: "Missing video link or identifier", status: "invalid" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetFile: any = null;
    let uploaderName = "DiskDabba User";

    // 1. Try finding by share token first
    const { data: share } = await supabase
      .from("shares")
      .select("*, files(*, profiles(display_name))")
      .eq("token", identifier)
      .maybeSingle();

    if (share) {
      if (share.expires_at && new Date(share.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "This share link has expired", status: "expired" },
          { status: 410 }
        );
      }
      if (share.files) {
        targetFile = share.files;
        if (targetFile.profiles?.display_name) {
          uploaderName = targetFile.profiles.display_name;
        }
      }
    }

    // 2. If not found by share token, try looking up as file ID (UUID)
    if (!targetFile) {
      const { data: file } = await supabase
        .from("files")
        .select("*, profiles(display_name)")
        .eq("id", identifier)
        .maybeSingle();

      if (file) {
        if (file.is_trashed) {
          return NextResponse.json(
            { error: "This video has been deleted by the owner", status: "deleted" },
            { status: 410 }
          );
        }

        // Check visibility permissions
        const isOwner = user && user.id === file.user_id;
        const isPublicOrUnlisted = file.visibility === "public" || file.visibility === "unlisted";

        if (!isOwner && !isPublicOrUnlisted) {
          // Check if an active public share exists for this file
          const { data: activeShare } = await supabase
            .from("shares")
            .select("id, expires_at")
            .eq("file_id", file.id)
            .maybeSingle();

          const hasActiveShare = activeShare && (!activeShare.expires_at || new Date(activeShare.expires_at) > new Date());

          if (!hasActiveShare) {
            return NextResponse.json(
              { error: "This video is private and cannot be viewed without permission", status: "private" },
              { status: 403 }
            );
          }
        }

        targetFile = file;
        if (file.profiles?.display_name) {
          uploaderName = file.profiles.display_name;
        }
      }
    }

    if (!targetFile) {
      return NextResponse.json(
        { error: "Video not found. Please verify the link or ID.", status: "not_found" },
        { status: 404 }
      );
    }

    // Range header for video seeking
    const rangeHeader = request.headers.get("range") || undefined;

    // Generate authorized presigned streaming URL from S3 / Backblaze B2
    const { downloadUrl, isMock, expiresIn } =
      await generatePresignedDownloadUrl(
        targetFile.r2_key,
        targetFile.name,
        rangeHeader
      );

    // Track analytics asynchronously
    try {
      const clientIp =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for") ||
        "unknown";
      const ipHash = btoa(clientIp).substring(0, 16);

      await supabase.rpc("record_file_view", {
        p_file_id: targetFile.id,
        p_viewer_ip_hash: ipHash,
      });

      await supabase.from("bandwidth_logs").insert({
        user_id: user?.id || null,
        file_id: targetFile.id,
        bytes_served: targetFile.size,
        ip_hash: ipHash,
      });
    } catch {
      // Non-blocking
    }

    const mime = targetFile.mime_type || "video/mp4";
    const isVideo = mime.startsWith("video/") || targetFile.name.match(/\.(mp4|webm|mkv|mov|avi|ts|flv)$/i);

    return NextResponse.json({
      id: targetFile.id,
      name: targetFile.name,
      filename: targetFile.name,
      mimeType: mime,
      isVideo: !!isVideo,
      sizeBytes: targetFile.size,
      sizeFormatted: formatBytes(targetFile.size),
      visibility: targetFile.visibility || "public",
      uploaderName: uploaderName,
      uploadedAt: targetFile.created_at,
      streamUrl: downloadUrl,
      downloadUrl: downloadUrl,
      thumbnailUrl: null,
      status: "available",
      isMock,
      expiresInSeconds: expiresIn,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message, status: "error" }, { status: 500 });
  }
}
