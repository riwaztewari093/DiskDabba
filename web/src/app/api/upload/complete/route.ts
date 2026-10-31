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
    const {
      fileId,
      filename,
      name,
      sizeBytes,
      size,
      s3Key,
      key,
      mimeType,
      sha256,
      folderId,
      visibility,
    } = body;

    const resolvedFileId = fileId || crypto.randomUUID();
    const resolvedName = filename || name;
    const resolvedSize = sizeBytes || size;
    const resolvedKey = s3Key || key;

    if (!resolvedFileId || !resolvedName || !resolvedSize || !resolvedKey) {
      return NextResponse.json(
        { error: "Missing required file metadata (fileId, name, size, s3Key)" },
        { status: 400 }
      );
    }

    // 1. Insert file record into files table
    const { data: file, error: fileError } = await supabase
      .from("files")
      .insert({
        id: resolvedFileId,
        user_id: user.id,
        folder_id: folderId || null,
        name: resolvedName,
        mime_type: mimeType || "application/octet-stream",
        size: resolvedSize,
        r2_key: resolvedKey,
        sha256: sha256 || null,
        visibility: visibility || "public",
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
      .update({ storage_used: currentUsed + resolvedSize })
      .eq("id", user.id);

    // 3. Create default share link for instant sharing
    const shareToken = resolvedFileId.replace(/-/g, "").substring(0, 16);
    await supabase.from("shares").insert({
      file_id: resolvedFileId,
      created_by: user.id,
      token: shareToken,
      permission: "view",
    });

    return NextResponse.json({
      success: true,
      file,
      shareUrl: `/app/${resolvedFileId}`,
      shareToken,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
