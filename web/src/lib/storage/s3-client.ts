import { S3Client } from "@aws-sdk/client-s3";

/**
 * Returns an S3 client configured for Backblaze B2, Cloudflare R2, or AWS S3.
 * Automatically falls back to Mock Mode if credentials are not provided or incomplete.
 */
export function getStorageClient(): {
  client: S3Client | null;
  bucket: string;
  isMock: boolean;
} {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "us-east-005";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.S3_BUCKET_NAME || "diskdabba-vault";

  const isConfigured =
    endpoint &&
    accessKeyId &&
    secretAccessKey &&
    !accessKeyId.includes("your-") &&
    !secretAccessKey.includes("your-");

  if (!isConfigured) {
    return {
      client: null,
      bucket,
      isMock: true,
    };
  }

  const client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    // Required for Backblaze B2 / Cloudflare R2 compatibility
    forcePathStyle: true,
  });

  return {
    client,
    bucket,
    isMock: false,
  };
}
