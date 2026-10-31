package com.diskdabba.player.ui.navigation

import java.net.URLEncoder
import java.nio.charset.StandardCharsets

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Saved : Screen("saved")
    object Settings : Screen("settings")
    object FileDetails : Screen("details/{target}") {
        fun createRoute(target: String): String {
            val encoded = URLEncoder.encode(target, StandardCharsets.UTF_8.toString())
            return "details/$encoded"
        }
    }
    object Player : Screen("player/{target}") {
        fun createRoute(target: String): String {
            val encoded = URLEncoder.encode(target, StandardCharsets.UTF_8.toString())
            return "player/$encoded"
        }
    }
}
