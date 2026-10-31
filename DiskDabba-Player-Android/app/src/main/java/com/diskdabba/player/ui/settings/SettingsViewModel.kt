package com.diskdabba.player.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.diskdabba.player.data.api.ApiClient
import com.diskdabba.player.data.local.UserPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SettingsViewModel(private val userPreferences: UserPreferences) : ViewModel() {

    val appTheme: StateFlow<String> = userPreferences.themeFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), "system")

    val apiStatus = MutableStateFlow("Connected (https://diskdabba.com)")

    fun updateTheme(newTheme: String) {
        viewModelScope.launch {
            userPreferences.setTheme(newTheme)
        }
    }

    fun updateServerUrl(url: String) {
        viewModelScope.launch {
            userPreferences.setServerUrl(url)
            ApiClient.updateBaseUrl(url)
            apiStatus.value = "Connected ($url)"
        }
    }
}
