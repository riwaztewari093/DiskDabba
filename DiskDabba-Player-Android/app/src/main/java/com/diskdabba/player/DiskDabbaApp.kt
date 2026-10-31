package com.diskdabba.player

import android.app.Application
import com.diskdabba.player.data.local.AppDatabase
import com.diskdabba.player.data.local.UserPreferences

class DiskDabbaApp : Application() {

    lateinit var database: AppDatabase
        private set

    lateinit var preferences: UserPreferences
        private set

    override fun onCreate() {
        super.onCreate()
        database = AppDatabase.getInstance(this)
        preferences = UserPreferences(this)
    }
}
