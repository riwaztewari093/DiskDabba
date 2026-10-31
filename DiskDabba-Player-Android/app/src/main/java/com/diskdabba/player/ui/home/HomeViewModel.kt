package com.diskdabba.player.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.diskdabba.player.data.model.HistoryEntity
import com.diskdabba.player.data.repository.VideoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HomeViewModel(private val repository: VideoRepository) : ViewModel() {

    val recentHistory: StateFlow<List<HistoryEntity>> = repository.getRecentHistory()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val inputLink = MutableStateFlow("")

    fun onLinkChanged(newLink: String) {
        inputLink.value = newLink
    }

    fun clearHistory() {
        viewModelScope.launch {
            repository.clearHistory()
        }
    }
}
