package com.example.neurostay.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.neurostay.data.LoginRequest
import com.example.neurostay.data.RegisterRequest
import com.example.neurostay.data.User
import com.example.neurostay.data.local.PreferencesManager
import com.example.neurostay.data.remote.RetrofitClient
import kotlinx.coroutines.launch

// Common Theme Colors
val ThemeDarkBlue = Color(0xFF071028)
val ThemeCardBlue = Color(0xFF1E293B)
val ThemeCyan = Color(0xFF22D3EE)
val ThemePurple = Color(0xFF9333EA)
val ThemeGrayText = Color(0xFF94A3B8)

@Composable
fun GradientBackground(content: @Composable BoxScope.() -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(ThemeDarkBlue, Color(0xFF0C1635))
                )
            )
    ) {
        // Ambient glows
        content()
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onNavigateToRegister: () -> Unit,
    onLoginSuccess: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val prefs = remember { PreferencesManager(context) }

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var showPassword by remember { mutableStateOf(false) }

    GradientBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .safeDrawingPadding(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Logo / Header
            Text(
                text = "NeuroStay AI",
                fontSize = 38.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Text(
                text = "Smart Hotel Booking Assistant",
                fontSize = 14.sp,
                color = ThemeGrayText,
                modifier = Modifier.padding(top = 4.dp, bottom = 32.dp)
            )

            // Card Form
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0x1AFFFFFF)),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Welcome Back",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(bottom = 20.dp)
                    )

                    // Email Input
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email Address", color = ThemeGrayText) },
                        placeholder = { Text("you@example.com") },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Password Input
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password", color = ThemeGrayText) },
                        placeholder = { Text("••••••••") },
                        visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                        trailingIcon = {
                            TextButton(onClick = { showPassword = !showPassword }) {
                                Text(if (showPassword) "Hide" else "Show", color = ThemeCyan)
                            }
                        },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )



                    // Login Button
                    Button(
                        onClick = {
                            if (email.isBlank() || password.isBlank()) {
                                Toast.makeText(context, "Please fill in all fields.", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            loading = true
                            coroutineScope.launch {
                                try {
                                    val res = RetrofitClient.apiService.login(LoginRequest(email, password))
                                    if (res.isSuccessful && res.body()?.success == true) {
                                        val body = res.body()!!
                                        prefs.saveToken(body.token ?: "demo-token")
                                        prefs.saveUser(body.user ?: User("demo-user-id", email.split("@")[0], email))
                                        RetrofitClient.setAuthToken(body.token)
                                        Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()
                                        onLoginSuccess()
                                    } else {
                                        val msg = res.body()?.message ?: "Invalid email or password."
                                        Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                                    }
                                } catch (e: Exception) {
                                    // Offline fallback
                                    prefs.saveToken("demo-token")
                                    prefs.saveUser(User("demo-user-id", email.split("@")[0], email))
                                    RetrofitClient.setAuthToken("demo-token")
                                    Toast.makeText(context, "Offline mode fallback enabled.", Toast.LENGTH_SHORT).show()
                                    onLoginSuccess()
                                } finally {
                                    loading = false
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ThemeCyan),
                        enabled = !loading
                    ) {
                        if (loading) {
                            CircularProgressIndicator(color = ThemeDarkBlue, modifier = Modifier.size(24.dp))
                        } else {
                            Text("Login", color = ThemeDarkBlue, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Create Account Link
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("New to NeuroStay? ", color = ThemeGrayText, fontSize = 14.sp)
                TextButton(onClick = onNavigateToRegister) {
                    Text("Create an account", color = ThemeCyan, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    onNavigateToLogin: () -> Unit,
    onRegisterSuccess: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val prefs = remember { PreferencesManager(context) }

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }

    GradientBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .safeDrawingPadding(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "NeuroStay AI",
                fontSize = 38.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Text(
                text = "Smart Hotel Booking Assistant",
                fontSize = 14.sp,
                color = ThemeGrayText,
                modifier = Modifier.padding(top = 4.dp, bottom = 32.dp)
            )

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0x1AFFFFFF)),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Create Account",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(bottom = 20.dp)
                    )

                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Full Name", color = ThemeGrayText) },
                        placeholder = { Text("Your full name") },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email Address", color = ThemeGrayText) },
                        placeholder = { Text("you@example.com") },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password", color = ThemeGrayText) },
                        placeholder = { Text("Min. 6 characters") },
                        visualTransformation = PasswordVisualTransformation(),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Button(
                        onClick = {
                            if (name.isBlank() || email.isBlank() || password.isBlank()) {
                                Toast.makeText(context, "Please fill in all fields.", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            if (password.length < 6) {
                                Toast.makeText(context, "Password must be at least 6 characters.", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            loading = true
                            coroutineScope.launch {
                                try {
                                    val res = RetrofitClient.apiService.register(RegisterRequest(name, email, password))
                                    if (res.isSuccessful && res.body()?.success == true) {
                                        val body = res.body()!!
                                        prefs.saveToken(body.token ?: "demo-token")
                                        prefs.saveUser(body.user ?: User("demo-user-id", name, email))
                                        RetrofitClient.setAuthToken(body.token)
                                        Toast.makeText(context, "Account created successfully!", Toast.LENGTH_SHORT).show()
                                        onRegisterSuccess()
                                    } else {
                                        val msg = res.body()?.message ?: "Registration failed."
                                        Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                                    }
                                } catch (e: Exception) {
                                    // Offline fallback
                                    prefs.saveToken("demo-token")
                                    prefs.saveUser(User("demo-user-id", name, email))
                                    RetrofitClient.setAuthToken("demo-token")
                                    Toast.makeText(context, "Account created (Offline Mode).", Toast.LENGTH_SHORT).show()
                                    onRegisterSuccess()
                                } finally {
                                    loading = false
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ThemePurple),
                        enabled = !loading
                    ) {
                        if (loading) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                        } else {
                            Text("Create Account", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Already have an account? ", color = ThemeGrayText, fontSize = 14.sp)
                TextButton(onClick = onNavigateToLogin) {
                    Text("Sign in", color = ThemeCyan, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}


