package com.diskdabba.player.player

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.datasource.okhttp.OkHttpDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import com.diskdabba.player.data.api.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class PlayerState(
    val isPlaying: Boolean = false,
    val isBuffering: Boolean = false,
    val durationMs: Long = 0L,
    val currentPositionMs: Long = 0L,
    val playbackSpeed: Float = 1.0f,
    val errorMessage: String? = null
)

@OptIn(UnstableApi::class)
class ExoPlayerManager(private val context: Context) {

    private var exoPlayer: ExoPlayer? = null

    private val _playerState = MutableStateFlow(PlayerState())
    val playerState: StateFlow<PlayerState> = _playerState.asStateFlow()

    private val playerListener = object : Player.Listener {
        override fun onIsPlayingChanged(isPlaying: Boolean) {
            _playerState.value = _playerState.value.copy(isPlaying = isPlaying)
        }

        override fun onPlaybackStateChanged(playbackState: Int) {
            when (playbackState) {
                Player.STATE_BUFFERING -> {
                    _playerState.value = _playerState.value.copy(isBuffering = true)
                }
                Player.STATE_READY -> {
                    val duration = exoPlayer?.duration?.coerceAtLeast(0L) ?: 0L
                    _playerState.value = _playerState.value.copy(
                        isBuffering = false,
                        durationMs = duration,
                        errorMessage = null
                    )
                }
                Player.STATE_ENDED -> {
                    _playerState.value = _playerState.value.copy(isBuffering = false, isPlaying = false)
                }
                Player.STATE_IDLE -> {
                    _playerState.value = _playerState.value.copy(isBuffering = false)
                }
            }
        }

        override fun onPlayerError(error: PlaybackException) {
            _playerState.value = _playerState.value.copy(
                isBuffering = false,
                isPlaying = false,
                errorMessage = "Playback error: ${error.localizedMessage ?: "Cannot stream video"}"
            )
        }
    }

    fun getPlayer(): ExoPlayer {
        if (exoPlayer == null) {
            val dataSourceFactory = OkHttpDataSource.Factory(ApiClient.okHttpClient)
            val mediaSourceFactory = DefaultMediaSourceFactory(context).setDataSourceFactory(dataSourceFactory)

            exoPlayer = ExoPlayer.Builder(context)
                .setMediaSourceFactory(mediaSourceFactory)
                .setSeekBackIncrementMs(10000)
                .setSeekForwardIncrementMs(10000)
                .build().apply {
                    addListener(playerListener)
                    playWhenReady = true
                }
        }
        return exoPlayer!!
    }

    fun play(streamUrl: String, startPositionMs: Long = 0L) {
        val player = getPlayer()
        val mediaItem = MediaItem.fromUri(streamUrl)
        player.setMediaItem(mediaItem)
        if (startPositionMs > 0) {
            player.seekTo(startPositionMs)
        }
        player.prepare()
        player.play()
    }

    fun togglePlayPause() {
        exoPlayer?.let {
            if (it.isPlaying) {
                it.pause()
            } else {
                it.play()
            }
        }
    }

    fun seekTo(positionMs: Long) {
        exoPlayer?.seekTo(positionMs)
    }

    fun seekRelative(deltaMs: Long) {
        exoPlayer?.let {
            val target = (it.currentPosition + deltaMs).coerceIn(0L, it.duration.coerceAtLeast(0L))
            it.seekTo(target)
        }
    }

    fun setSpeed(speed: Float) {
        exoPlayer?.playbackParameters = PlaybackParameters(speed)
        _playerState.value = _playerState.value.copy(playbackSpeed = speed)
    }

    fun updateCurrentPosition() {
        exoPlayer?.let {
            if (it.playbackState == Player.STATE_READY || it.isPlaying) {
                _playerState.value = _playerState.value.copy(
                    currentPositionMs = it.currentPosition.coerceAtLeast(0L),
                    durationMs = it.duration.coerceAtLeast(0L)
                )
            }
        }
    }

    fun release() {
        exoPlayer?.removeListener(playerListener)
        exoPlayer?.release()
        exoPlayer = null
    }
}
