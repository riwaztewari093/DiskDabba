package com.diskdabba.player.ui.details

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.CloudUpload
import androidx.compose.material.icons.outlined.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.diskdabba.player.data.model.VideoResolveResponse
import com.diskdabba.player.ui.components.DiskDabbaHeaderTopBar
import com.diskdabba.player.ui.components.MetadataPill
import com.diskdabba.player.ui.components.PremiumBanner
import com.diskdabba.player.ui.theme.*

@Composable
fun FileDetailsScreen(
    viewModel: FileDetailsViewModel,
    onBackClick: () -> Unit,
    onPlayClick: (String, String) -> Unit, // videoId, streamUrl
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ScreenBackground)
    ) {
        // Top Bar
        DiskDabbaHeaderTopBar(
            title = "File Details",
            onBackClick = onBackClick
        )

        when (val state = uiState) {
            is DetailsUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = BrandPrimary)
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Fetching video details...",
                            fontSize = 14.sp,
                            color = TextSecondary
                        )
                    }
                }
            }
            is DetailsUiState.Error -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp))
                            .background(CardBackground)
                            .border(1.dp, CardBorder, RoundedCornerShape(24.dp))
                            .padding(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ErrorOutline,
                            contentDescription = null,
                            tint = Color(0xFFEF4444),
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "Cannot Load Video",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = state.message,
                            fontSize = 13.sp,
                            color = TextSecondary,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = { viewModel.loadVideoDetails() },
                            colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Text("Retry", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
            is DetailsUiState.Success -> {
                DetailsContent(
                    video = state.video,
                    isBookmarked = state.isBookmarked,
                    onBookmarkClick = { viewModel.toggleBookmark() },
                    onPlayClick = {
                        val streamUrl = state.video.streamUrl ?: state.video.downloadUrl ?: ""
                        onPlayClick(state.video.id, streamUrl)
                    }
                )
            }
        }
    }
}

@Composable
private fun DetailsContent(
    video: VideoResolveResponse,
    isBookmarked: Boolean,
    onBookmarkClick: () -> Unit,
    onPlayClick: () -> Unit
) {
    val context = LocalContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 18.dp),
        contentPadding = PaddingValues(bottom = 40.dp)
    ) {
        // 1. Hero Preview Card (Matching Screenshot 3)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(26.dp))
                    .background(Color(0xFFF9F8FE))
                    .border(1.dp, Color(0xFFEBE8FA), RoundedCornerShape(26.dp))
                    .padding(vertical = 32.dp, horizontal = 20.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // Large Circular Lavender Icon Box
                    Box(
                        modifier = Modifier
                            .size(110.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFEDE9FE)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Videocam,
                            contentDescription = "Video Icon",
                            tint = BrandPrimary,
                            modifier = Modifier.size(52.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Filename in bold mono
                    Text(
                        text = video.name,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        textAlign = TextAlign.Center,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // "video • 120.6 MB"
                    Text(
                        text = "${video.mimeType ?: "video"} • ${video.sizeFormatted ?: "Unknown"}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextSecondary
                    )
                }
            }
        }

        // 2. "Scroll down to open the file" text
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "Scroll down to open the file",
                fontSize = 13.sp,
                fontWeight = FontWeight.Normal,
                color = TextMuted,
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.Center
            )
        }

        // 3. 2x2 Grid Metadata Cards (Matching Screenshot 3 & 4)
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetadataPill(
                    icon = Icons.Default.Folder,
                    label = "Size",
                    value = video.sizeFormatted ?: "Unknown",
                    modifier = Modifier.weight(1f)
                )
                MetadataPill(
                    icon = Icons.Default.Description,
                    label = "Type",
                    value = video.mimeType ?: "video",
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetadataPill(
                    icon = Icons.Default.CalendarToday,
                    label = "Uploaded",
                    value = video.uploadedAt?.take(10) ?: "Recent",
                    modifier = Modifier.weight(1f)
                )
                MetadataPill(
                    icon = Icons.Default.Person,
                    label = "Uploader",
                    value = video.uploaderName ?: "DiskDabba User",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // 4. Action Buttons Row (Bookmark, Share, Save to Cloud)
        item {
            Spacer(modifier = Modifier.height(28.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                CircularActionButton(
                    icon = if (isBookmarked) Icons.Default.Bookmark else Icons.Outlined.BookmarkBorder,
                    label = "Bookmark",
                    isHighlighted = isBookmarked,
                    onClick = onBookmarkClick
                )

                CircularActionButton(
                    icon = Icons.Outlined.Share,
                    label = "Share",
                    onClick = {
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_SUBJECT, video.name)
                            putExtra(
                                Intent.EXTRA_TEXT,
                                "Watch ${video.name} on DiskDabba:\nhttps://diskdabba.com/v/${video.id}"
                            )
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share Video Link"))
                    }
                )

                CircularActionButton(
                    icon = Icons.Outlined.CloudUpload,
                    label = "Save to Cloud",
                    onClick = {
                        Toast.makeText(context, "Saved to your DiskDabba Vault", Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }

        // 5. Play Video Button
        item {
            Spacer(modifier = Modifier.height(28.dp))
            Button(
                onClick = onPlayClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = "Play",
                        tint = PureWhite,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Play in DiskDabba Player",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = PureWhite
                    )
                }
            }
        }

        // 6. Premium Banner
        item {
            Spacer(modifier = Modifier.height(20.dp))
            PremiumBanner(
                onUpgradeClick = {
                    Toast.makeText(context, "Upgrading to DiskDabba PRO", Toast.LENGTH_SHORT).show()
                }
            )
        }
    }
}

@Composable
fun CircularActionButton(
    icon: ImageVector,
    label: String,
    isHighlighted: Boolean = false,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .clip(CircleShape)
                .background(CardBackground)
                .border(
                    1.5.dp,
                    if (isHighlighted) BrandPrimary else CardBorder,
                    CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isHighlighted) BrandPrimary else TextPrimary,
                modifier = Modifier.size(22.dp)
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = if (isHighlighted) BrandPrimary else TextSecondary
        )
    }
}
