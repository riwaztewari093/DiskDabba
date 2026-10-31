package com.diskdabba.player.data.local

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "diskdabba_preferences")

class UserPreferences(private val context: Context) {

    companion object {
        val KEY_THEME = stringPreferencesKey("app_theme") // "system", "light", "dark"
        val KEY_DEFAULT_SPEED = floatPreferencesKey("default_playback_speed")
        val KEY_AUTO_RESUME = booleanPreferencesKey("auto_resume")
        val KEY_CUSTOM_SERVER_URL = stringPreferencesKey("custom_server_url")
    }

    val themeFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[KEY_THEME] ?: "system"
    }

    val playbackSpeedFlow: Flow<Float> = context.dataStore.data.map { prefs ->
        prefs[KEY_DEFAULT_SPEED] ?: 1.0f
    }

    val autoResumeFlow: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[KEY_AUTO_RESUME] ?: true
    }

    val serverUrlFlow: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[KEY_CUSTOM_SERVER_URL]
    }

    suspend fun setTheme(theme: String) {
        context.dataStore.edit { it[KEY_THEME] = theme }
    }

    suspend fun setPlaybackSpeed(speed: Float) {
        context.dataStore.edit { it[KEY_DEFAULT_SPEED] = speed }
    }

    suspend fun setAutoResume(enabled: Boolean) {
        context.dataStore.edit { it[KEY_AUTO_RESUME] = enabled }
    }

    suspend fun setServerUrl(url: String) {
        context.dataStore.edit { it[KEY_CUSTOM_SERVER_URL] = url }
    }
}
