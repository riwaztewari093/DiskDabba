export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileId, filename, sizeBytes, s3Key, mimeType, sha256, folderId } =
      body;

    if (!fileId || !filename || !sizeBytes || !s3Key) {
      return NextResponse.json(
        { error: "Missing required file metadata" },
        { status: 400 }
      );
    }

    // 1. Insert file record into files table
    const { data: file, error: fileError } = await supabase
      .from("files")
      .insert({
        id: fileId,
        user_id: user.id,
        folder_id: folderId || null,
        name: filename,
        mime_type: mimeType || "application/octet-stream",
        size: sizeBytes,
        r2_key: s3Key,
        sha256: sha256 || null,
      })
      .select()
      .single();

    if (fileError) {
      return NextResponse.json({ error: fileError.message }, { status: 500 });
    }

    // 2. Increment user's storage_used atomically
    const { data: profile } = await supabase
      .from("profiles")
      .select("storage_used")
      .eq("id", user.id)
      .single();

    const currentUsed = profile?.storage_used ?? 0;
    await supabase
      .from("profiles")
      .update({ storage_used: currentUsed + sizeBytes })
      .eq("id", user.id);

    return NextResponse.json({ success: true, file });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
