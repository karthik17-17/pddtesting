package com.example.neurostay

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.example.neurostay.data.local.PreferencesManager
import com.example.neurostay.ui.screens.*

@Composable
fun MainNavigation() {
  val context = LocalContext.current
  val prefs = remember { PreferencesManager(context) }
  val startDestination = remember {
    if (prefs.getToken() != null) Home else Login
  }
  val backStack = rememberNavBackStack(startDestination)

  NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider =
      entryProvider {
        entry<Login> {
          LoginScreen(
            onNavigateToRegister = { backStack.add(Register) },
            onNavigateToForgotPassword = { backStack.add(ForgotPassword) },
            onLoginSuccess = { 
              backStack.removeLastOrNull()
              backStack.add(Home) 
            }
          )
        }
        entry<Register> {
          RegisterScreen(
            onNavigateToLogin = { backStack.removeLastOrNull() },
            onRegisterSuccess = { 
              backStack.removeLastOrNull()
              backStack.add(Home) 
            }
          )
        }
        entry<ForgotPassword> {
          ForgotPasswordScreen(
            onNavigateToLogin = { backStack.removeLastOrNull() }
          )
        }
        entry<Home> {
          HomeScreen(
            onSearch = { query -> backStack.add(Results(query)) },
            onNavigateToSaved = { backStack.add(Saved) },
            onNavigateToProfile = { backStack.add(Profile) },
            onNavigateToMap = { backStack.add(MapView) }
          )
        }
        entry<Results> { entry ->
          val query = (entry.key as Results).query
          ResultsScreen(
            query = query,
            onBack = { backStack.removeLastOrNull() },
            onNavigateToCompare = { backStack.add(Compare) }
          )
        }
        entry<Profile> {
          ProfileScreen(
            onBack = { backStack.removeLastOrNull() },
            onLogout = { 
              backStack.removeLastOrNull()
              backStack.add(Login) 
            }
          )
        }
        entry<Saved> {
          SavedScreen(
            onBack = { backStack.removeLastOrNull() },
            onNavigateToCompare = { backStack.add(Compare) }
          )
        }
        entry<Compare> {
          CompareScreen(
            onBack = { backStack.removeLastOrNull() }
          )
        }
        entry<MapView> {
          MapScreen(
            onBack = { backStack.removeLastOrNull() }
          )
        }
      },
  )
}
