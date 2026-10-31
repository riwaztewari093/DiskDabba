package com.diskdabba.player.ui.settings

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.diskdabba.player.ui.components.DiskDabbaHeaderTopBar
import com.diskdabba.player.ui.theme.*

@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val appTheme by viewModel.appTheme.collectAsState()
    val apiStatus by viewModel.apiStatus.collectAsState()

    var showThemeDialog by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ScreenBackground)
    ) {
        // Top Header matching Screenshot 2
        DiskDabbaHeaderTopBar(
            title = "Settings",
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 18.dp),
            contentPadding = PaddingValues(top = 8.dp, bottom = 40.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 1. Theme
            item {
                SettingsCardItem(
                    icon = Icons.Outlined.Tune,
                    title = "Theme",
                    description = "Choose app appearance: light, dark or system adaptive",
                    onClick = { showThemeDialog = true }
                )
            }

            // 2. App Icon
            item {
                SettingsCardItem(
                    icon = Icons.Outlined.AddPhotoAlternate,
                    title = "App Icon",
                    description = "Make DiskDabba yours with a custom launcher icon",
                    onClick = {
                        Toast.makeText(context, "Default DiskDabba Purple Icon selected", Toast.LENGTH_SHORT).show()
                    }
                )
            }

            // 3. Language
            item {
                SettingsCardItem(
                    icon = Icons.Outlined.Translate,
                    title = "Language",
                    description = "Select Language",
                    onClick = {
                        Toast.makeText(context, "Language: English (US)", Toast.LENGTH_SHORT).show()
                    }
                )
            }

            // 4. Subtitle Settings
            item {
                SettingsCardItem(
                    icon = Icons.Outlined.Subtitles,
                    title = "Subtitle Settings",
                    description = "Adjust text size for better readability",
                    onClick = {
                        Toast.makeText(context, "Default subtitle font size: Medium", Toast.LENGTH_SHORT).show()
                    }
                )
            }

            // 5. Download Settings
            item {
                SettingsCardItem(
                    icon = Icons.Outlined.FileDownload,
                    title = "Download Settings",
                    description = "Speed boost, retries & download preferences",
                    onClick = {
                        Toast.makeText(context, "HTTP Range multi-chunk downloads enabled", Toast.LENGTH_SHORT).show()
                    }
                )
            }

            // 6. Privacy Settings
            item {
                SettingsCardItem(
                    icon = Icons.Outlined.Security,
                    title = "Privacy Settings",
                    description = "Manage file visibility and ad personalization.",
                    onClick = {
                        Toast.makeText(context, "Zero data shared. Cloud credentials never stored on device.", Toast.LENGTH_LONG).show()
                    }
                )
            }

            // 7. System Info & API Connection Card
            item {
                Spacer(modifier = Modifier.height(14.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(CardBackground)
                        .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
                        .padding(18.dp)
                ) {
                    Column {
                        Text(
                            text = "Platform Connection",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = apiStatus,
                            fontSize = 12.sp,
                            color = BrandPrimary,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "DiskDabba Player Android v1.0.0 (Official Native Build)",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                }
            }
        }
    }

    if (showThemeDialog) {
        AlertDialog(
            onDismissRequest = { showThemeDialog = false },
            title = { Text("Choose Theme", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    listOf("system" to "System Adaptive", "light" to "Light", "dark" to "Dark").forEach { (key, label) ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.updateTheme(key)
                                    showThemeDialog = false
                                }
                                .padding(vertical = 12.dp)
                        ) {
                            RadioButton(
                                selected = appTheme == key,
                                onClick = {
                                    viewModel.updateTheme(key)
                                    showThemeDialog = false
                                },
                                colors = RadioButtonDefaults.colors(selectedColor = BrandPrimary)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(label, fontSize = 15.sp, color = TextPrimary)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showThemeDialog = false }) {
                    Text("Close", color = BrandPrimary, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = CardBackground
        )
    }
}

@Composable
fun SettingsCardItem(
    icon: ImageVector,
    title: String,
    description: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .background(CardBackground)
            .border(1.dp, CardBorder, RoundedCornerShape(22.dp))
            .clickable(onClick = onClick)
            .padding(18.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Rounded square icon container with subtle border & purple outline icon
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0xFFF9F7FE))
                    .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(14.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = BrandPrimary,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = description,
                    fontSize = 12.sp,
                    color = TextSecondary,
                    lineHeight = 16.sp
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Right Chevron
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(14.dp)
            )
        }
    }
}
