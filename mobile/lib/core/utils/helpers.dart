/// Utility helpers for DiskDabba.

/// Formats a byte count into a human-readable string.
String formatBytes(int bytes, {int decimals = 1}) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(decimals)} KB';
  if (bytes < 1024 * 1024 * 1024) {
    return '${(bytes / (1024 * 1024)).toStringAsFixed(decimals)} MB';
  }
  return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(decimals)} GB';
}

/// Returns a file extension from a filename.
String getFileExtension(String filename) {
  final dotIndex = filename.lastIndexOf('.');
  if (dotIndex == -1 || dotIndex == filename.length - 1) return '';
  return filename.substring(dotIndex + 1).toLowerCase();
}

/// Returns an icon name suggestion based on MIME type.
String getIconForMimeType(String? mimeType) {
  if (mimeType == null) return 'insert_drive_file';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video_file';
  if (mimeType.startsWith('audio/')) return 'audio_file';
  if (mimeType == 'application/pdf') return 'picture_as_pdf';
  if (mimeType.contains('spreadsheet') || mimeType.contains('excel')) return 'table_chart';
  if (mimeType.contains('document') || mimeType.contains('word')) return 'description';
  if (mimeType.contains('presentation') || mimeType.contains('powerpoint')) return 'slideshow';
  if (mimeType.contains('zip') || mimeType.contains('archive') || mimeType.contains('compressed')) return 'folder_zip';
  return 'insert_drive_file';
}
