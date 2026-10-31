package com.diskdabba.player.ui.details

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.diskdabba.player.data.model.VideoResolveResponse
import com.diskdabba.player.data.repository.VideoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

sealed class DetailsUiState {
    object Loading : DetailsUiState()
    data class Success(val video: VideoResolveResponse, val isBookmarked: Boolean) : DetailsUiState()
    data class Error(val message: String) : DetailsUiState()
}

class FileDetailsViewModel(
    private val repository: VideoRepository,
    private val targetUrlOrId: String
) : ViewModel() {

    private val _uiState = MutableStateFlow<DetailsUiState>(DetailsUiState.Loading)
    val uiState: StateFlow<DetailsUiState> = _uiState.asStateFlow()

    init {
        loadVideoDetails()
    }

    fun loadVideoDetails() {
        viewModelScope.launch {
            _uiState.value = DetailsUiState.Loading
            val result = repository.resolveVideo(targetUrlOrId)
            result.onSuccess { video ->
                val isBookmarked = repository.isSaved(video.id).first()
                _uiState.value = DetailsUiState.Success(video = video, isBookmarked = isBookmarked)
                // Also record into history
                repository.recordPlayback(video)
            }.onFailure { error ->
                _uiState.value = DetailsUiState.Error(
                    error.localizedMessage ?: "Failed to resolve video details. Please check connection and link."
                )
            }
        }
    }

    fun toggleBookmark() {
        val currentState = _uiState.value
        if (currentState is DetailsUiState.Success) {
            viewModelScope.launch {
                repository.toggleBookmark(currentState.video)
                val newStatus = !currentState.isBookmarked
                _uiState.value = currentState.copy(isBookmarked = newStatus)
            }
        }
    }
}
