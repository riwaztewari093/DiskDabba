package com.diskdabba.player.data.api

import com.diskdabba.player.BuildConfig
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    val okHttpClient: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }

        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .build()
    }

    private var currentBaseUrl: String = BuildConfig.DEFAULT_SERVER_URL.let {
        if (it.endsWith("/")) it else "$it/"
    }

    private var apiService: DiskDabbaApiService = createService(currentBaseUrl)

    private fun createService(baseUrl: String): DiskDabbaApiService {
        val normalized = if (baseUrl.endsWith("/")) baseUrl else "$baseUrl/"
        return Retrofit.Builder()
            .baseUrl(normalized)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(DiskDabbaApiService::class.java)
    }

    fun getService(): DiskDabbaApiService = apiService

    fun updateBaseUrl(newUrl: String) {
        if (newUrl.isNotBlank()) {
            currentBaseUrl = if (newUrl.endsWith("/")) newUrl else "$newUrl/"
            apiService = createService(currentBaseUrl)
        }
    }
}
