/// Data model for a file stored in DiskDabba.
class DiskFile {
  final String id;
  final String userId;
  final String? folderId;
  final String name;
  final String? mimeType;
  final int size;
  final String r2Key;
  final String? sha256;
  final bool isTrashed;
  final DateTime? trashedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  const DiskFile({
    required this.id,
    required this.userId,
    this.folderId,
    required this.name,
    this.mimeType,
    required this.size,
    required this.r2Key,
    this.sha256,
    this.isTrashed = false,
    this.trashedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory DiskFile.fromJson(Map<String, dynamic> json) {
    return DiskFile(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      folderId: json['folder_id'] as String?,
      name: json['name'] as String,
      mimeType: json['mime_type'] as String?,
      size: json['size'] as int,
      r2Key: json['r2_key'] as String,
      sha256: json['sha256'] as String?,
      isTrashed: json['is_trashed'] as bool? ?? false,
      trashedAt: json['trashed_at'] != null
          ? DateTime.parse(json['trashed_at'] as String)
          : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'folder_id': folderId,
      'name': name,
      'mime_type': mimeType,
      'size': size,
      'r2_key': r2Key,
      'sha256': sha256,
      'is_trashed': isTrashed,
      'trashed_at': trashedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  /// Returns a human-readable file size (e.g., "1.5 MB").
  String get formattedSize {
    if (size < 1024) return '$size B';
    if (size < 1024 * 1024) return '${(size / 1024).toStringAsFixed(1)} KB';
    if (size < 1024 * 1024 * 1024) {
      return '${(size / (1024 * 1024)).toStringAsFixed(1)} MB';
    }
    return '${(size / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }
}
