package com.example.neurostay.ui.screens

import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.window.Dialog
import com.example.neurostay.data.*
import com.example.neurostay.data.local.LocalMockDatabase
import com.example.neurostay.data.local.PreferencesManager
import com.example.neurostay.data.remote.RetrofitClient
import kotlinx.coroutines.launch
import java.net.URLEncoder
import androidx.compose.ui.text.input.PasswordVisualTransformation

// Helper navigation bar for main screens
@Composable
fun MainNavBar(
    activeTab: String,
    onNavigateToHome: () -> Unit,
    onNavigateToSaved: () -> Unit,
    onNavigateToMap: () -> Unit,
    onNavigateToProfile: () -> Unit
) {
    NavigationBar(
        containerColor = ThemeCardBlue,
        contentColor = Color.White
    ) {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
            label = { Text("Home", color = Color.White) },
            selected = activeTab == "home",
            onClick = onNavigateToHome,
            colors = NavigationBarItemDefaults.colors(indicatorColor = ThemeCyan)
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Favorite, contentDescription = "Saved") },
            label = { Text("Saved", color = Color.White) },
            selected = activeTab == "saved",
            onClick = onNavigateToSaved,
            colors = NavigationBarItemDefaults.colors(indicatorColor = ThemeCyan)
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.LocationOn, contentDescription = "Map") },
            label = { Text("Map", color = Color.White) },
            selected = activeTab == "map",
            onClick = onNavigateToMap,
            colors = NavigationBarItemDefaults.colors(indicatorColor = ThemeCyan)
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
            label = { Text("Profile", color = Color.White) },
            selected = activeTab == "profile",
            onClick = onNavigateToProfile,
            colors = NavigationBarItemDefaults.colors(indicatorColor = ThemeCyan)
        )
    }
}

// 1. HomeScreen
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onSearch: (String) -> Unit,
    onNavigateToSaved: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToMap: () -> Unit
) {
    val context = LocalContext.current
    val prefs = remember { PreferencesManager(context) }
    val user = remember { prefs.getUser() }

    var query by remember { mutableStateOf("") }
    val suggestions = listOf(
        "Cheap AC hotel near Chennai",
        "Luxury hotels in Hyderabad",
        "Budget rooms in Bangalore",
        "Beach resorts in Goa"
    )

    Scaffold(
        bottomBar = {
            MainNavBar(
                activeTab = "home",
                onNavigateToHome = {},
                onNavigateToSaved = onNavigateToSaved,
                onNavigateToMap = onNavigateToMap,
                onNavigateToProfile = onNavigateToProfile
            )
        }
    ) { innerPadding ->
        GradientBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Welcome header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 24.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(Brush.linearGradient(listOf(ThemeCyan, ThemePurple))),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = (user?.name?.take(2) ?: "U").uppercase(),
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Welcome back,", color = ThemeGrayText, fontSize = 12.sp)
                        Text(user?.name ?: "Guest", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }

                Text(
                    text = "NeuroStay AI",
                    fontSize = 42.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Find your perfect hotel with smart AI matching",
                    fontSize = 14.sp,
                    color = ThemeGrayText,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(bottom = 28.dp)
                )

                // Search field card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        OutlinedTextField(
                            value = query,
                            onValueChange = { query = it },
                            placeholder = { Text("Try: AC hotels in Chennai...", color = ThemeGrayText) },
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = ThemeDarkBlue,
                                unfocusedContainerColor = ThemeDarkBlue,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = {
                                if (query.isNotBlank()) {
                                    prefs.addRecentSearch(query)
                                    onSearch(query)
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = ThemeCyan),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Search with AI ✨", color = ThemeDarkBlue, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Suggestions
                Text(
                    "Try searching for:",
                    color = ThemeGrayText,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(top = 24.dp, bottom = 8.dp)
                )
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    suggestions.forEach { s ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    prefs.addRecentSearch(s)
                                    onSearch(s)
                                },
                            colors = CardDefaults.cardColors(containerColor = Color(0x0CFFFFFF))
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("🏙️", fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(s, color = Color.White, fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

// 2. ResultsScreen
@Composable
fun ResultsScreen(
    query: String,
    onBack: () -> Unit,
    onNavigateToCompare: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val mockDb = remember { LocalMockDatabase(context) }
    val prefs = remember { PreferencesManager(context) }
    val user = remember { prefs.getUser() }

    var loading by remember { mutableStateOf(true) }
    var hotels by remember { mutableStateOf<List<Hotel>>(emptyList()) }
    val savedHotelNames = remember { mutableStateListOf<String>() }

    // Fetch wishlist to display heart status
    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val dbSaved = mockDb.getSavedHotels()
                dbSaved.forEach { savedHotelNames.add(it.hotelName) }
                
                val res = RetrofitClient.apiService.getSavedHotels()
                if (res.isSuccessful && res.body()?.success == true) {
                    res.body()!!.hotels.forEach { savedHotelNames.add(it.hotelName) }
                }
            } catch (e: Exception) {}
        }
    }

    // Fetch search recommendations
    LaunchedEffect(query) {
        coroutineScope.launch {
            try {
                val res = RetrofitClient.apiService.searchHotels(SearchRequest(query))
                if (res.isSuccessful && res.body()?.success == true) {
                    hotels = res.body()!!.hotels
                } else {
                    hotels = generateMockHotels(query)
                }
            } catch (e: Exception) {
                hotels = generateMockHotels(query)
            } finally {
                loading = false
            }
        }
    }

    GradientBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .safeDrawingPadding()
                .padding(16.dp)
        ) {
            // Header Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Text("Search Results", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                Button(
                    onClick = onNavigateToCompare,
                    colors = ButtonDefaults.buttonColors(containerColor = ThemePurple),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Compare", fontSize = 12.sp)
                }
            }

            Text(
                text = "Results for: \"$query\"",
                color = ThemeGrayText,
                fontSize = 13.sp,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            if (loading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = ThemeCyan)
                }
            } else if (hotels.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No recommendations found.", color = ThemeGrayText)
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(hotels) { hotel ->
                        val isSaved = savedHotelNames.contains(hotel.name)
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = hotel.name,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp,
                                        color = Color.White,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis,
                                        modifier = Modifier.weight(1f)
                                    )
                                    IconButton(
                                        onClick = {
                                            coroutineScope.launch {
                                                if (isSaved) {
                                                    // Remove from saved list
                                                    mockDb.getSavedHotels()
                                                        .find { it.hotelName == hotel.name }
                                                        ?.let { mockDb.deleteHotel(it.id) }
                                                    savedHotelNames.remove(hotel.name)
                                                    Toast.makeText(context, "Removed from Wishlist", Toast.LENGTH_SHORT).show()
                                                } else {
                                                    // Save
                                                    val request = SaveHotelRequest(
                                                        hotelName = hotel.name,
                                                        hotelImage = hotel.image,
                                                        price = hotel.price,
                                                        address = hotel.address,
                                                        rating = hotel.rating,
                                                        matchScore = hotel.matchScore,
                                                        why = hotel.why,
                                                        mapLink = hotel.mapLink
                                                    )
                                                    mockDb.saveHotel(request, user?.id ?: "demo-user-id")
                                                    savedHotelNames.add(hotel.name)
                                                    Toast.makeText(context, "Added to Wishlist", Toast.LENGTH_SHORT).show()
                                                }
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                            contentDescription = "Save",
                                            tint = if (isSaved) Color.Red else Color.White
                                        )
                                    }
                                }

                                Text(hotel.address, fontSize = 12.sp, color = ThemeGrayText, maxLines = 1)
                                
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(top = 10.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("⭐ ${hotel.rating}", color = ThemeCyan, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    Text(hotel.price, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(ThemePurple)
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text("Match: ${hotel.matchScore}%", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }

                                Divider(color = Color(0x1AFFFFFF), modifier = Modifier.padding(vertical = 10.dp))
                                
                                Row(verticalAlignment = Alignment.Top) {
                                    Text("🤖 ", fontSize = 14.sp)
                                    Text(hotel.why, fontSize = 12.sp, color = ThemeGrayText, lineHeight = 16.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// 3. ProfileScreen
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onBack: () -> Unit,
    onLogout: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val prefs = remember { PreferencesManager(context) }
    val mockDb = remember { LocalMockDatabase(context) }
    val user = remember { prefs.getUser() }

    var savedCount by remember { mutableIntStateOf(0) }
    var showEditNameDialog by remember { mutableStateOf(false) }
    var editName by remember { mutableStateOf(user?.name ?: "") }
    var showPasswordDialog by remember { mutableStateOf(false) }
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        savedCount = mockDb.getSavedHotels().size
    }

    Scaffold(
        bottomBar = {
            MainNavBar(
                activeTab = "profile",
                onNavigateToHome = onBack,
                onNavigateToSaved = {},
                onNavigateToMap = {},
                onNavigateToProfile = {}
            )
        }
    ) { innerPadding ->
        GradientBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Text(
                    "Profile Dashboard",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                // Avatar / Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(Brush.linearGradient(listOf(ThemeCyan, ThemePurple))),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = (user?.name?.take(2) ?: "U").uppercase(),
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 24.sp
                            )
                        }
                        
                        Text(user?.name ?: "User", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.padding(top = 8.dp))
                        Text(user?.email ?: "you@example.com", color = ThemeGrayText, fontSize = 12.sp)

                        Divider(color = Color(0x1AFFFFFF), modifier = Modifier.padding(vertical = 16.dp))

                        // Controls
                        Button(
                            onClick = { showEditNameDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0x1AFFFFFF)),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("✏️ Edit Profile", color = Color.White)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { showPasswordDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0x1AFFFFFF)),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("🔒 Change Password", color = Color.White)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = {
                                prefs.clearToken()
                                prefs.clearUser()
                                onLogout()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626)),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("🚪 Logout", color = Color.White)
                        }
                    }
                }

                // Stats row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = ThemeCardBlue)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Saved Hotels", color = ThemeGrayText, fontSize = 12.sp)
                            Text("$savedCount", color = ThemeCyan, fontWeight = FontWeight.Black, fontSize = 28.sp)
                        }
                    }
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = ThemeCardBlue)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Account Status", color = ThemeGrayText, fontSize = 12.sp)
                            Text("Active", color = Color(0xFF4ADE80), fontWeight = FontWeight.Bold, fontSize = 22.sp, modifier = Modifier.padding(top = 6.dp))
                        }
                    }
                }
            }
        }
    }

    // Dialogs
    if (showEditNameDialog) {
        Dialog(onDismissRequest = { showEditNameDialog = false }) {
            Card(
                colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Edit Profile", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = editName,
                        onValueChange = { editName = it },
                        label = { Text("Name", color = ThemeGrayText) },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = ThemeDarkBlue,
                            unfocusedContainerColor = ThemeDarkBlue,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showEditNameDialog = false }) { Text("Cancel", color = ThemeGrayText) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (editName.isNotBlank() && user != null) {
                                    prefs.saveUser(user.copy(name = editName))
                                    Toast.makeText(context, "Profile updated (Offline Mock)!", Toast.LENGTH_SHORT).show()
                                    showEditNameDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = ThemeCyan)
                        ) {
                            Text("Save", color = ThemeDarkBlue)
                        }
                    }
                }
            }
        }
    }

    if (showPasswordDialog) {
        Dialog(onDismissRequest = { showPasswordDialog = false }) {
            Card(
                colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Change Password", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = currentPassword,
                        onValueChange = { currentPassword = it },
                        label = { Text("Current Password", color = ThemeGrayText) },
                        visualTransformation = PasswordVisualTransformation(),
                        colors = TextFieldDefaults.colors(focusedContainerColor = ThemeDarkBlue, unfocusedContainerColor = ThemeDarkBlue, focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = newPassword,
                        onValueChange = { newPassword = it },
                        label = { Text("New Password", color = ThemeGrayText) },
                        visualTransformation = PasswordVisualTransformation(),
                        colors = TextFieldDefaults.colors(focusedContainerColor = ThemeDarkBlue, unfocusedContainerColor = ThemeDarkBlue, focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showPasswordDialog = false }) { Text("Cancel", color = ThemeGrayText) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (currentPassword.isNotBlank() && newPassword.length >= 6) {
                                    Toast.makeText(context, "Password updated (Offline Mock)!", Toast.LENGTH_SHORT).show()
                                    showPasswordDialog = false
                                    currentPassword = ""
                                    newPassword = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = ThemeCyan)
                        ) {
                            Text("Update", color = ThemeDarkBlue)
                        }
                    }
                }
            }
        }
    }
}

// 4. SavedScreen
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedScreen(
    onBack: () -> Unit,
    onNavigateToCompare: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val mockDb = remember { LocalMockDatabase(context) }
    var savedHotels by remember { mutableStateOf<List<SavedHotel>>(emptyList()) }

    LaunchedEffect(Unit) {
        savedHotels = mockDb.getSavedHotels()
    }

    Scaffold(
        bottomBar = {
            MainNavBar(
                activeTab = "saved",
                onNavigateToHome = onBack,
                onNavigateToSaved = {},
                onNavigateToMap = {},
                onNavigateToProfile = {}
            )
        }
    ) { innerPadding ->
        GradientBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(20.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Saved Wishlist", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    if (savedHotels.isNotEmpty()) {
                        Button(
                            onClick = onNavigateToCompare,
                            colors = ButtonDefaults.buttonColors(containerColor = ThemePurple)
                        ) {
                            Text("Compare Matrix")
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (savedHotels.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No saved hotels yet.", color = ThemeGrayText)
                    }
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(savedHotels) { hotel ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(hotel.hotelName, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
                                        IconButton(
                                            onClick = {
                                                mockDb.deleteHotel(hotel.id)
                                                savedHotels = mockDb.getSavedHotels()
                                                Toast.makeText(context, "Removed from wishlist", Toast.LENGTH_SHORT).show()
                                            }
                                        ) {
                                            Icon(Icons.Default.Favorite, contentDescription = "Remove", tint = Color.Red)
                                        }
                                    }

                                    Text(hotel.address ?: "Address not available", fontSize = 12.sp, color = ThemeGrayText)
                                    
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(top = 10.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text("⭐ ${hotel.rating ?: 4.0}", color = ThemeCyan, fontWeight = FontWeight.Bold)
                                        Text(hotel.price ?: "Price not available", color = Color.White, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// 5. CompareScreen
@Composable
fun CompareScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val mockDb = remember { LocalMockDatabase(context) }
    val savedHotels = remember { mockDb.getSavedHotels() }

    GradientBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .safeDrawingPadding()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Text("Compare Saved Hotels", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (savedHotels.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Add hotels to your wishlist to compare them.", color = ThemeGrayText)
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    items(savedHotels) { hotel ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = ThemeCardBlue),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(hotel.hotelName, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = ThemeCyan)
                                Spacer(modifier = Modifier.height(10.dp))

                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text("Rating", color = ThemeGrayText, fontSize = 11.sp)
                                        Text("⭐ ${hotel.rating ?: 4.0}", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    }
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text("Match Score", color = ThemeGrayText, fontSize = 11.sp)
                                        Text("${hotel.matchScore ?: 80}%", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    }
                                    Column(modifier = Modifier.weight(1.2f)) {
                                        Text("Price", color = ThemeGrayText, fontSize = 11.sp)
                                        Text(hotel.price ?: "Price N/A", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    }
                                }
                                
                                Spacer(modifier = Modifier.height(10.dp))
                                Text("Address", color = ThemeGrayText, fontSize = 11.sp)
                                Text(hotel.address ?: "—", color = Color.White, fontSize = 12.sp)

                                Spacer(modifier = Modifier.height(10.dp))
                                Text("AI Match Description", color = ThemeGrayText, fontSize = 11.sp)
                                Text(hotel.why ?: "No description available.", color = Color.White, fontSize = 12.sp, lineHeight = 16.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

// 6. MapScreen
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapScreen(
    onBack: () -> Unit
) {
    val defaultUrl = "https://www.openstreetmap.org/#map=5/21.84/82.79"

    Scaffold(
        bottomBar = {
            MainNavBar(
                activeTab = "map",
                onNavigateToHome = onBack,
                onNavigateToSaved = {},
                onNavigateToMap = {},
                onNavigateToProfile = {}
            )
        }
    ) { innerPadding ->
        GradientBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                // Interactive OpenStreetMap inside standard android WebView
                AndroidView(
                    factory = { ctx ->
                        WebView(ctx).apply {
                            settings.javaScriptEnabled = true
                            webViewClient = WebViewClient()
                            loadUrl(defaultUrl)
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }
        }
    }
}

// Helper mock data generator
fun generateMockHotels(query: String): List<Hotel> {
    val q = query.lowercase()
    val city = if (q.contains("chennai")) "Chennai"
    else if (q.contains("bangalore")) "Bangalore"
    else if (q.contains("hyderabad")) "Hyderabad"
    else if (q.contains("goa")) "Goa"
    else "Chennai"

    return listOf(
        Hotel(
            id = 1,
            name = "Grand Plaza Hotel",
            city = city,
            address = "12 Mount Road, $city, India",
            price = "₹2,500",
            rating = 4.5,
            matchScore = 95,
            why = "Highly recommended based on your preference for budget AC rooms in $city.",
            mapLink = "",
            image = "",
            latitude = 13.0827,
            longitude = 80.2707
        ),
        Hotel(
            id = 2,
            name = "Seaside Comfort Inn",
            city = city,
            address = "45 Beach Way, $city, India",
            price = "₹1,800",
            rating = 4.2,
            matchScore = 88,
            why = "Good rating and proximity to railway access makes this a great choice in $city.",
            mapLink = "",
            image = "",
            latitude = 13.0600,
            longitude = 80.2500
        ),
        Hotel(
            id = 3,
            name = "Oakwood Luxury Residency",
            city = city,
            address = "78 High Tech Zone, $city, India",
            price = "₹4,200",
            rating = 4.8,
            matchScore = 82,
            why = "Luxury listing with amenities like swimming pool and gym matching preference.",
            mapLink = "",
            image = "",
            latitude = 13.0400,
            longitude = 80.2200
        )
    )
}
