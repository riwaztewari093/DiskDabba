package com.diskdabba.player

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.diskdabba.player.ui.navigation.DiskDabbaNavGraph
import com.diskdabba.player.ui.navigation.Screen
import com.diskdabba.player.ui.theme.DiskDabbaTheme
import com.diskdabba.player.ui.theme.ScreenBackground

class MainActivity : ComponentActivity() {

    private var pendingDeepLink: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val app = application as DiskDabbaApp
        handleIncomingIntent(intent)

        setContent {
            DiskDabbaTheme {
                val navController = rememberNavController()

                LaunchedEffect(pendingDeepLink) {
                    pendingDeepLink?.let { link ->
                        navController.navigate(Screen.FileDetails.createRoute(link))
                        pendingDeepLink = null
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = ScreenBackground
                ) {
                    DiskDabbaNavGraph(
                        navController = navController,
                        database = app.database,
                        preferences = app.preferences
                    )
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIncomingIntent(intent)
    }

    private fun handleIncomingIntent(intent: Intent?) {
        if (intent?.action == Intent.ACTION_VIEW) {
            val uri = intent.data
            if (uri != null) {
                // e.g. https://diskdabba.com/v/1234 or diskdabba://v/1234
                pendingDeepLink = uri.toString()
            }
        }
    }
}
