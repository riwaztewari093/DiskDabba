package com.diskdabba.player.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class VideoResolveResponse(
    @Json(name = "id") val id: String,
    @Json(name = "name") val name: String,
    @Json(name = "filename") val filename: String?,
    @Json(name = "mimeType") val mimeType: String?,
    @Json(name = "isVideo") val isVideo: Boolean?,
    @Json(name = "sizeBytes") val sizeBytes: Long?,
    @Json(name = "sizeFormatted") val sizeFormatted: String?,
    @Json(name = "visibility") val visibility: String?,
    @Json(name = "uploaderName") val uploaderName: String?,
    @Json(name = "uploadedAt") val uploadedAt: String?,
    @Json(name = "streamUrl") val streamUrl: String?,
    @Json(name = "downloadUrl") val downloadUrl: String?,
    @Json(name = "thumbnailUrl") val thumbnailUrl: String?,
    @Json(name = "status") val status: String?,
    @Json(name = "error") val error: String?
)
