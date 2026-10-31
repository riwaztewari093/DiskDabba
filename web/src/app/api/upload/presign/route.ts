import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COST_LIMITS } from "@/lib/cost-protection/calculator";
import { generatePresignedUploadUrl } from "@/lib/storage/presign";

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
    const { filename, sizeBytes, mimeType } = body;

    if (!filename || !sizeBytes) {
      return NextResponse.json(
        { error: "Filename and sizeBytes are required" },
        { status: 400 }
      );
    }

    // 1. Max Single File Size Guard (100 MB cap)
    const maxSizeBytes = COST_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (sizeBytes > maxSizeBytes) {
      return NextResponse.json(
        {
          error: `File exceeds maximum allowed size of ${COST_LIMITS.MAX_FILE_SIZE_MB} MB for cost protection.`,
        },
        { status: 413 }
      );
    }

    // 2. User Storage Quota Guard
    const { data: profile } = await supabase
      .from("profiles")
      .select("storage_used, storage_limit")
      .eq("id", user.id)
      .single();

    const currentUsed = profile?.storage_used ?? 0;
    const currentLimit = profile?.storage_limit ?? COST_LIMITS.DEFAULT_USER_QUOTA_BYTES;

    if (currentUsed + sizeBytes > currentLimit) {
      return NextResponse.json(
        {
          error: `Upload would exceed your storage quota (${Math.round(currentLimit / (1024 * 1024 * 1024))} GB). Delete some files to free up space.`,
        },
        { status: 403 }
      );
    }

    // 3. Generate secure S3 object key
    const fileId = crypto.randomUUID();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const s3Key = `users/${user.id}/${fileId}_${cleanFilename}`;

    // 4. Generate presigned PUT URL
    const { uploadUrl, isMock, expiresIn } = await generatePresignedUploadUrl(
      s3Key,
      mimeType || "application/octet-stream",
      sizeBytes
    );

    return NextResponse.json({
      fileId,
      s3Key,
      uploadUrl,
      isMock,
      expiresIn,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
