package com.diskdabba.player.ui.saved

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.diskdabba.player.data.model.SavedVideoEntity
import com.diskdabba.player.data.repository.VideoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SavedViewModel(private val repository: VideoRepository) : ViewModel() {

    val searchQuery = MutableStateFlow("")

    val savedVideos: StateFlow<List<SavedVideoEntity>> = repository.getAllSavedVideos()
        .combine(searchQuery) { list, query ->
            if (query.isBlank()) list
            else list.filter { it.name.contains(query, ignoreCase = true) }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun onSearchQueryChanged(newQuery: String) {
        searchQuery.value = newQuery
    }

    fun removeSaved(id: String) {
        viewModelScope.launch {
            repository.removeSavedVideo(id)
        }
    }
}
