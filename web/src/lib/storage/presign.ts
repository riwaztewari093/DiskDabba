import {
  PutObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CompletedPart,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getStorageClient } from "./s3-client";

const DEFAULT_EXPIRY_SECONDS = 900; // 15 minutes

/**
 * Generates a presigned PUT URL for single-file uploads (<= 100 MB).
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  sizeBytes: number
): Promise<{ uploadUrl: string; isMock: boolean; expiresIn: number }> {
  const { client, bucket, isMock } = getStorageClient();

  if (isMock || !client) {
    // Mock simulation for local development without B2 credentials
    return {
      uploadUrl: `https://mock-b2.diskdabba.local/${bucket}/${encodeURIComponent(key)}?mock_sig=true`,
      isMock: true,
      expiresIn: DEFAULT_EXPIRY_SECONDS,
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: sizeBytes,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: DEFAULT_EXPIRY_SECONDS,
  });

  return {
    uploadUrl,
    isMock: false,
    expiresIn: DEFAULT_EXPIRY_SECONDS,
  };
}

/**
 * Generates a presigned GET URL for downloads with Range request support.
 */
export async function generatePresignedDownloadUrl(
  key: string,
  downloadName?: string,
  rangeHeader?: string
): Promise<{ downloadUrl: string; isMock: boolean; expiresIn: number }> {
  const { client, bucket, isMock } = getStorageClient();

  if (isMock || !client) {
    return {
      downloadUrl: `https://mock-b2.diskdabba.local/${bucket}/${encodeURIComponent(key)}?download=true`,
      isMock: true,
      expiresIn: DEFAULT_EXPIRY_SECONDS,
    };
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: downloadName
      ? `attachment; filename="${encodeURIComponent(downloadName)}"`
      : undefined,
    Range: rangeHeader,
  });

  const downloadUrl = await getSignedUrl(client, command, {
    expiresIn: DEFAULT_EXPIRY_SECONDS,
  });

  return {
    downloadUrl,
    isMock: false,
    expiresIn: DEFAULT_EXPIRY_SECONDS,
  };
}

/**
 * Initiates an S3 Multipart Upload (for large files).
 */
export async function initiateMultipartUpload(
  key: string,
  contentType: string
): Promise<{ uploadId: string; isMock: boolean }> {
  const { client, bucket, isMock } = getStorageClient();

  if (isMock || !client) {
    return {
      uploadId: `mock-upload-id-${Date.now()}`,
      isMock: true,
    };
  }

  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const response = await client.send(command);

  return {
    uploadId: response.UploadId || `upload-${Date.now()}`,
    isMock: false,
  };
}

/**
 * Generates a presigned URL for a specific part in a multipart upload.
 */
export async function generatePresignedPartUrl(
  key: string,
  uploadId: string,
  partNumber: number
): Promise<{ partUrl: string; isMock: boolean }> {
  const { client, bucket, isMock } = getStorageClient();

  if (isMock || !client) {
    return {
      partUrl: `https://mock-b2.diskdabba.local/${bucket}/${encodeURIComponent(key)}?part=${partNumber}&uploadId=${uploadId}`,
      isMock: true,
    };
  }

  const command = new UploadPartCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  const partUrl = await getSignedUrl(client, command, {
    expiresIn: DEFAULT_EXPIRY_SECONDS,
  });

  return {
    partUrl,
    isMock: false,
  };
}

/**
 * Completes a multipart upload once all parts are received.
 */
export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: CompletedPart[]
): Promise<{ success: boolean; isMock: boolean }> {
  const { client, bucket, isMock } = getStorageClient();

  if (isMock || !client) {
    return { success: true, isMock: true };
  }

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  await client.send(command);
  return { success: true, isMock: false };
}
