/// Data model for a user profile in DiskDabba.
class UserProfile {
  final String id;
  final String? displayName;
  final String? avatarUrl;
  final int storageUsed;
  final int storageLimit;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserProfile({
    required this.id,
    this.displayName,
    this.avatarUrl,
    this.storageUsed = 0,
    this.storageLimit = 5368709120, // 5 GB
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String,
      displayName: json['display_name'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      storageUsed: json['storage_used'] as int? ?? 0,
      storageLimit: json['storage_limit'] as int? ?? 5368709120,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'display_name': displayName,
      'avatar_url': avatarUrl,
      'storage_used': storageUsed,
      'storage_limit': storageLimit,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  /// Returns storage used as a human-readable string.
  String get formattedStorageUsed {
    return _formatBytes(storageUsed);
  }

  /// Returns storage limit as a human-readable string.
  String get formattedStorageLimit {
    return _formatBytes(storageLimit);
  }

  /// Returns usage as a percentage (0.0 to 1.0).
  double get usagePercentage {
    if (storageLimit == 0) return 0;
    return storageUsed / storageLimit;
  }

  static String _formatBytes(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    if (bytes < 1024 * 1024 * 1024) {
      return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    }
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }
}
