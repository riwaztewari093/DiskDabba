/**
 * Utility helpers for DiskDabba web.
 */

/**
 * Formats a byte count into a human-readable string.
 * e.g., 1536 → "1.5 KB", 1073741824 → "1.0 GB"
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(decimals)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(decimals)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimals)} GB`;
}

/**
 * Extracts the file extension from a filename (lowercased, no dot).
 * e.g., "photo.JPG" → "jpg"
 */
export function getFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === filename.length - 1) return "";
  return filename.substring(dotIndex + 1).toLowerCase();
}

/**
 * Returns a Lucide icon name suggestion based on MIME type.
 */
export function getIconForMimeType(mimeType?: string): string {
  if (!mimeType) return "file";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "music";
  if (mimeType === "application/pdf") return "file-text";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "table";
  if (mimeType.includes("document") || mimeType.includes("word"))
    return "file-text";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "presentation";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("archive") ||
    mimeType.includes("compressed")
  )
    return "archive";
  return "file";
}

/**
 * Generates the R2 object key for a user's file.
 * Format: users/{userId}/{folderId|root}/{uuid}_{filename}
 */
export function generateR2Key(
  userId: string,
  folderId: string | null,
  fileId: string,
  filename: string
): string {
  const folder = folderId ?? "root";
  return `users/${userId}/${folder}/${fileId}_${filename}`;
}
