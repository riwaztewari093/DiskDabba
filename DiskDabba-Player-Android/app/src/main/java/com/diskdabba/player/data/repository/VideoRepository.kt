package com.diskdabba.player.data.repository

import com.diskdabba.player.data.api.ApiClient
import com.diskdabba.player.data.local.AppDatabase
import com.diskdabba.player.data.model.HistoryEntity
import com.diskdabba.player.data.model.SavedVideoEntity
import com.diskdabba.player.data.model.VideoResolveResponse
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first

class VideoRepository(private val database: AppDatabase) {

    private val api = ApiClient.getService()
    private val savedDao = database.savedVideoDao()
    private val historyDao = database.historyDao()

    suspend fun resolveVideo(urlOrId: String): Result<VideoResolveResponse> {
        return try {
            val response = if (urlOrId.startsWith("http://") || urlOrId.startsWith("https://")) {
                api.resolveVideo(url = urlOrId)
            } else {
                api.resolveVideo(id = urlOrId)
            }

            if (response.status == "deleted") {
                Result.failure(Exception(response.error ?: "This video was deleted by the owner."))
            } else if (response.status == "expired") {
                Result.failure(Exception(response.error ?: "This video share link has expired."))
            } else if (response.status == "private") {
                Result.failure(Exception(response.error ?: "This video is private."))
            } else if (response.status == "not_found") {
                Result.failure(Exception(response.error ?: "Video not found. Please verify the link."))
            } else {
                Result.success(response)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getAllSavedVideos(): Flow<List<SavedVideoEntity>> = savedDao.getAllSavedVideos()

    fun isSaved(id: String): Flow<Boolean> = savedDao.isSaved(id)

    suspend fun toggleBookmark(video: VideoResolveResponse) {
        val currentlySaved = savedDao.isSaved(video.id).first()
        if (currentlySaved) {
            savedDao.deleteById(video.id)
        } else {
            savedDao.insert(
                SavedVideoEntity(
                    id = video.id,
                    name = video.name,
                    sizeFormatted = video.sizeFormatted ?: "Unknown",
                    sizeBytes = video.sizeBytes ?: 0L,
                    mimeType = video.mimeType ?: "video/mp4",
                    uploaderName = video.uploaderName ?: "DiskDabba User",
                    uploadedAt = video.uploadedAt ?: "Recently",
                    streamUrl = video.streamUrl,
                    downloadUrl = video.downloadUrl
                )
            )
        }
    }

    suspend fun removeSavedVideo(id: String) {
        savedDao.deleteById(id)
    }

    fun getRecentHistory(): Flow<List<HistoryEntity>> = historyDao.getRecentHistory()

    suspend fun recordPlayback(
        video: VideoResolveResponse,
        positionMs: Long = 0L,
        durationMs: Long = 0L
    ) {
        historyDao.insertOrUpdate(
            HistoryEntity(
                id = video.id,
                name = video.name,
                sizeFormatted = video.sizeFormatted ?: "Unknown",
                sizeBytes = video.sizeBytes ?: 0L,
                mimeType = video.mimeType ?: "video/mp4",
                uploaderName = video.uploaderName ?: "DiskDabba User",
                uploadedAt = video.uploadedAt ?: "Recently",
                streamUrl = video.streamUrl,
                downloadUrl = video.downloadUrl,
                lastPositionMs = positionMs,
                durationMs = durationMs,
                playedAtTimestamp = System.currentTimeMillis()
            )
        )
    }

    suspend fun getLastPlaybackPosition(id: String): Long {
        return historyDao.getById(id)?.lastPositionMs ?: 0L
    }

    suspend fun clearHistory() {
        historyDao.clearHistory()
    }
}
