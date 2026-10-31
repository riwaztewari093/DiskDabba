package com.diskdabba.player.ui.home

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.VideoLibrary
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.diskdabba.player.data.model.HistoryEntity
import com.diskdabba.player.ui.components.DiskDabbaHomeTopBar
import com.diskdabba.player.ui.components.LinkInputCard
import com.diskdabba.player.ui.components.PremiumBanner
import com.diskdabba.player.ui.theme.*

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToDetails: (String) -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val recentHistory by viewModel.recentHistory.collectAsState()
    val inputLink by viewModel.inputLink.collectAsState()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(ScreenBackground)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 18.dp),
            contentPadding = PaddingValues(bottom = 100.dp)
        ) {
            // 1. Top Bar
            item {
                DiskDabbaHomeTopBar(
                    onSettingsClick = onNavigateToSettings,
                    modifier = Modifier.padding(top = 10.dp)
                )
            }

            // 2. Link Input Card
            item {
                Spacer(modifier = Modifier.height(10.dp))
                LinkInputCard(
                    linkText = inputLink,
                    onLinkChange = { viewModel.onLinkChanged(it) },
                    onSubmit = {
                        if (inputLink.trim().isNotBlank()) {
                            onNavigateToDetails(inputLink.trim())
                        } else {
                            Toast.makeText(context, "Please enter or paste a video link", Toast.LENGTH_SHORT).show()
                        }
                    }
                )
            }

            // 3. Recent History Header
            item {
                Spacer(modifier = Modifier.height(26.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Recent History",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    if (recentHistory.isNotEmpty()) {
                        Text(
                            text = "Clear",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = BrandPrimary,
                            modifier = Modifier
                                .clickable { viewModel.clearHistory() }
                                .padding(4.dp)
                        )
                    }
                }
            }

            // 4. Go Premium PRO Banner Card
            item {
                Spacer(modifier = Modifier.height(14.dp))
                PremiumBanner(
                    onUpgradeClick = {
                        Toast.makeText(
                            context,
                            "DiskDabba Cloud Vault: Zero ads, unlimited high-speed streaming & downloads",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                )
            }

            // 5. Recent History Video Cards or Empty State (Matching Screenshot 1)
            if (recentHistory.isEmpty()) {
                item {
                    Spacer(modifier = Modifier.height(20.dp))
                    EmptyHistoryCard()
                }
            } else {
                items(recentHistory, key = { it.id }) { historyItem ->
                    Spacer(modifier = Modifier.height(12.dp))
                    HistoryVideoCard(
                        item = historyItem,
                        onClick = { onNavigateToDetails(historyItem.id) }
                    )
                }
            }
        }

        // Floating Action Button matching Screenshot 1 (purple rounded box with folder icon)
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 20.dp, bottom = 16.dp)
                .shadow(8.dp, RoundedCornerShape(18.dp), ambientColor = BrandPrimary, spotColor = BrandPrimary)
                .clip(RoundedCornerShape(18.dp))
                .background(BrandAccent)
                .clickable {
                    Toast.makeText(context, "Browsing DiskDabba cloud storage...", Toast.LENGTH_SHORT).show()
                }
                .size(56.dp),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Folder,
                contentDescription = "Folder",
                tint = PureWhite,
                modifier = Modifier.size(28.dp)
            )
        }
    }
}

@Composable
fun EmptyHistoryCard() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .background(CardBackground)
            .border(1.dp, CardBorder, RoundedCornerShape(22.dp))
            .padding(vertical = 40.dp, horizontal = 24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(CircleShape)
                    .background(LavenderHeroBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.VideoLibrary,
                    contentDescription = null,
                    tint = BrandPrimary,
                    modifier = Modifier.size(30.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "No history yet. Play some media to see recents.",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = TextSecondary,
                lineHeight = 18.sp
            )
        }
    }
}

@Composable
fun HistoryVideoCard(
    item: HistoryEntity,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(CardBackground)
            .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Thumbnail / Icon box
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(LavenderHeroBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = null,
                    tint = BrandPrimary,
                    modifier = Modifier.size(26.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = "${item.sizeFormatted} • By ${item.uploaderName}",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }

            // Play badge
            Box(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(LavenderPill)
                    .padding(8.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Play",
                    tint = BrandPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
