package com.diskdabba.player.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class AppConfigResponse(
    @Json(name = "status") val status: String,
    @Json(name = "config") val config: AppConfigData
)

@JsonClass(generateAdapter = true)
data class AppConfigData(
    @Json(name = "app_name") val appName: String?,
    @Json(name = "latest_version_name") val latestVersionName: String?,
    @Json(name = "min_supported_version_code") val minSupportedVersionCode: Int?,
    @Json(name = "maintenance_mode") val maintenanceMode: Boolean?,
    @Json(name = "maintenance_message") val maintenanceMessage: String?,
    @Json(name = "app_update_url") val appUpdateUrl: String?
)
