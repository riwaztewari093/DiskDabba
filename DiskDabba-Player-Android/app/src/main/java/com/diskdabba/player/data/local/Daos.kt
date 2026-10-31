package com.diskdabba.player.data.local

import androidx.room.*
import com.diskdabba.player.data.model.HistoryEntity
import com.diskdabba.player.data.model.SavedVideoEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SavedVideoDao {
    @Query("SELECT * FROM saved_videos ORDER BY savedAtTimestamp DESC")
    fun getAllSavedVideos(): Flow<List<SavedVideoEntity>>

    @Query("SELECT EXISTS(SELECT 1 FROM saved_videos WHERE id = :id)")
    fun isSaved(id: String): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(video: SavedVideoEntity)

    @Query("DELETE FROM saved_videos WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface HistoryDao {
    @Query("SELECT * FROM playback_history ORDER BY playedAtTimestamp DESC LIMIT 30")
    fun getRecentHistory(): Flow<List<HistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(history: HistoryEntity)

    @Query("SELECT * FROM playback_history WHERE id = :id LIMIT 1")
    suspend fun getById(id: String): HistoryEntity?

    @Query("DELETE FROM playback_history WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM playback_history")
    suspend fun clearHistory()
}
