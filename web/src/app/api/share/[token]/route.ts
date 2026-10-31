export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePresignedDownloadUrl } from "@/lib/storage/presign";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Look up by share token first
    let file: any = null;
    let permission = "view";

    const { data: share } = await supabase
      .from("shares")
      .select("*, files(*)")
      .eq("token", token)
      .maybeSingle();

    if (share && share.files) {
      if (share.expires_at && new Date(share.expires_at) < new Date()) {
        return NextResponse.json({ error: "This share link has expired." }, { status: 410 });
      }
      file = share.files;
      permission = share.permission || "view";
    } else {
      // 2. Alternatively, check if the token is directly a file ID
      const { data: directFile } = await supabase
        .from("files")
        .select("*")
        .eq("id", token)
        .maybeSingle();

      if (directFile && directFile.visibility !== "private") {
        file = directFile;
      }
    }

    if (!file) {
      return NextResponse.json(
        { error: "File not found or permission denied" },
        { status: 404 }
      );
    }

    // Range header for streaming playback
    const rangeHeader = request.headers.get("range") || undefined;

    // Presigned download and stream URL
    const { downloadUrl, isMock, expiresIn } =
      await generatePresignedDownloadUrl(file.r2_key, file.name, rangeHeader);

    // Record view in analytics
    try {
      const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
      const ipHash = btoa(clientIp).substring(0, 16);
      await supabase.rpc("record_file_view", {
        p_file_id: file.id,
        p_viewer_ip_hash: ipHash,
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      id: file.id,
      name: file.name,
      filename: file.name,
      sizeBytes: file.size,
      mimeType: file.mime_type || "application/octet-stream",
      permission,
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
