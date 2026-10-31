package com.diskdabba.player.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.diskdabba.player.data.local.AppDatabase
import com.diskdabba.player.data.local.UserPreferences
import com.diskdabba.player.data.repository.VideoRepository
import com.diskdabba.player.ui.components.DiskDabbaBottomNavBar
import com.diskdabba.player.ui.details.FileDetailsScreen
import com.diskdabba.player.ui.details.FileDetailsViewModel
import com.diskdabba.player.ui.home.HomeScreen
import com.diskdabba.player.ui.home.HomeViewModel
import com.diskdabba.player.ui.player.VideoPlayerScreen
import com.diskdabba.player.ui.saved.SavedScreen
import com.diskdabba.player.ui.saved.SavedViewModel
import com.diskdabba.player.ui.settings.SettingsScreen
import com.diskdabba.player.ui.settings.SettingsViewModel
import java.net.URLDecoder
import java.nio.charset.StandardCharsets

@Composable
fun DiskDabbaNavGraph(
    navController: NavHostController,
    database: AppDatabase,
    preferences: UserPreferences,
    modifier: Modifier = Modifier
) {
    val repository = VideoRepository(database)
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Home.route

    val showBottomNav = currentRoute in listOf(
        Screen.Home.route,
        Screen.Saved.route
    )

    Scaffold(
        bottomBar = {
            if (showBottomNav) {
                DiskDabbaBottomNavBar(
                    currentRoute = currentRoute,
                    onTabSelected = { route ->
                        if (route != currentRoute) {
                            navController.navigate(route) {
                                popUpTo(Screen.Home.route) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = modifier.padding(innerPadding)
        ) {
            // Home
            composable(Screen.Home.route) {
                val homeViewModel = HomeViewModel(repository)
                HomeScreen(
                    viewModel = homeViewModel,
                    onNavigateToDetails = { target ->
                        navController.navigate(Screen.FileDetails.createRoute(target))
                    },
                    onNavigateToSettings = {
                        navController.navigate(Screen.Settings.route)
                    }
                )
            }

            // Saved
            composable(Screen.Saved.route) {
                val savedViewModel = SavedViewModel(repository)
                SavedScreen(
                    viewModel = savedViewModel,
                    onNavigateToDetails = { videoId ->
                        navController.navigate(Screen.FileDetails.createRoute(videoId))
                    }
                )
            }

            // Settings / Profile
            composable(Screen.Settings.route) {
                val settingsViewModel = SettingsViewModel(preferences)
                SettingsScreen(
                    viewModel = settingsViewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            // File Details
            composable(
                route = Screen.FileDetails.route,
                arguments = listOf(navArgument("target") { type = NavType.StringType })
            ) { backStackEntry ->
                val encodedTarget = backStackEntry.arguments?.getString("target") ?: ""
                val target = URLDecoder.decode(encodedTarget, StandardCharsets.UTF_8.toString())
                val detailsViewModel = FileDetailsViewModel(repository, target)

                FileDetailsScreen(
                    viewModel = detailsViewModel,
                    onBackClick = { navController.popBackStack() },
                    onPlayClick = { videoId, streamUrl ->
                        navController.navigate(
                            Screen.Player.createRoute("$videoId?streamUrl=$streamUrl")
                        )
                    }
                )
            }

            // Fullscreen Video Player
            composable(
                route = Screen.Player.route,
                arguments = listOf(navArgument("target") { type = NavType.StringType })
            ) { backStackEntry ->
                val encodedTarget = backStackEntry.arguments?.getString("target") ?: ""
                val fullTarget = URLDecoder.decode(encodedTarget, StandardCharsets.UTF_8.toString())

                val videoId = fullTarget.substringBefore("?")
                val streamUrl = if (fullTarget.contains("streamUrl=")) {
                    fullTarget.substringAfter("streamUrl=")
                } else ""

                VideoPlayerScreen(
                    videoId = videoId,
                    streamUrl = streamUrl,
                    title = "Playing Video",
                    onBackClick = { navController.popBackStack() }
                )
            }
        }
    }
}
