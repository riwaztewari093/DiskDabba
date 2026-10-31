import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePresignedDownloadUrl } from "@/lib/storage/presign";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Fetch file record (RLS enforces that user can only read their own file unless shared)
    const { data: file, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (error || !file) {
      return NextResponse.json(
        { error: "File not found or permission denied" },
        { status: 404 }
      );
    }

    // 2. Range request support from client headers
    const rangeHeader = request.headers.get("range") || undefined;

    // 3. Generate presigned GET download URL
    const { downloadUrl, isMock, expiresIn } =
      await generatePresignedDownloadUrl(file.r2_key, file.name, rangeHeader);

    // 4. Log bandwidth consumption (for cost & download monitoring)
    try {
      await supabase.from("bandwidth_logs").insert({
        user_id: user?.id || null,
        file_id: file.id,
        bytes_served: file.size,
      });
    } catch {
      // Non-blocking if table not yet migrated
    }

    return NextResponse.json({
      downloadUrl,
      filename: file.name,
      sizeBytes: file.size,
      mimeType: file.mime_type,
      isMock,
      expiresIn,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
