package com.diskdabba.player.data.api

import com.diskdabba.player.data.model.AppConfigResponse
import com.diskdabba.player.data.model.VideoResolveResponse
import retrofit2.http.GET
import retrofit2.http.Query

interface DiskDabbaApiService {

    @GET("api/video/resolve")
    suspend fun resolveVideo(
        @Query("url") url: String? = null,
        @Query("id") id: String? = null,
        @Query("token") token: String? = null
    ): VideoResolveResponse

    @GET("api/app/config")
    suspend fun getAppConfig(): AppConfigResponse
}
