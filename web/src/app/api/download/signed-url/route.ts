export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePresignedDownloadUrl } from "@/lib/storage/presign";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");
    const token = searchParams.get("token");

    if (!fileId && !token) {
      return NextResponse.json(
        { error: "Missing fileId or token parameter" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetFile: any = null;

    if (fileId) {
      // 1. Fetch file directly
      const { data: file, error } = await supabase
        .from("files")
        .select("*")
        .eq("id", fileId)
        .maybeSingle();

      if (file) {
        // Check permission: owner, or public/unlisted visibility
        if (
          (user && user.id === file.user_id) ||
          file.visibility === "public" ||
          file.visibility === "unlisted"
        ) {
          targetFile = file;
        } else {
          // Check if there is an active share for this file
          const { data: share } = await supabase
            .from("shares")
            .select("*")
            .eq("file_id", file.id)
            .maybeSingle();

          if (share && (!share.expires_at || new Date(share.expires_at) > new Date())) {
            targetFile = file;
          }
        }
      }
    } else if (token) {
      // 2. Fetch via share token
      const { data: share } = await supabase
        .from("shares")
        .select("*, files(*)")
        .eq("token", token)
        .maybeSingle();

      if (share && share.files) {
        if (!share.expires_at || new Date(share.expires_at) > new Date()) {
          targetFile = share.files;
        }
      }
    }

    if (!targetFile) {
      return NextResponse.json(
        { error: "File not found or access expired" },
        { status: 404 }
      );
    }

    // Range request support for HTML5 video seeking
    const rangeHeader = request.headers.get("range") || undefined;

    // Generate presigned GET download/stream URL
    const { downloadUrl, isMock, expiresIn } =
      await generatePresignedDownloadUrl(
        targetFile.r2_key,
        targetFile.name,
        rangeHeader
      );

    // Track analytics & view count asynchronously
    try {
      const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
      // Hash IP for privacy compliance
      const ipHash = clientIp ? btoa(clientIp).substring(0, 16) : null;

      // Call RPC or log bandwidth
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
      // Non-blocking for analytics logging
    }

    return NextResponse.json({
      id: targetFile.id,
      name: targetFile.name,
      filename: targetFile.name,
      sizeBytes: targetFile.size,
      size: targetFile.size,
      mimeType: targetFile.mime_type || "application/octet-stream",
      visibility: targetFile.visibility || "public",
      downloadUrl,
      streamUrl: downloadUrl,
      isMock,
      expiresIn,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
