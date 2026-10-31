package com.diskdabba.player.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saved_videos")
data class SavedVideoEntity(
    @PrimaryKey val id: String,
    val name: String,
    val sizeFormatted: String,
    val sizeBytes: Long,
    val mimeType: String,
    val uploaderName: String,
    val uploadedAt: String,
    val streamUrl: String?,
    val downloadUrl: String?,
    val savedAtTimestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "playback_history")
data class HistoryEntity(
    @PrimaryKey val id: String,
    val name: String,
    val sizeFormatted: String,
    val sizeBytes: Long,
    val mimeType: String,
    val uploaderName: String,
    val uploadedAt: String,
    val streamUrl: String?,
    val downloadUrl: String?,
    val lastPositionMs: Long = 0L,
    val durationMs: Long = 0L,
    val playedAtTimestamp: Long = System.currentTimeMillis()
)
