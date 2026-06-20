package com.example.neurostay

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

@Serializable data object Login : NavKey
@Serializable data object Register : NavKey
@Serializable data object ForgotPassword : NavKey
@Serializable data object Home : NavKey
@Serializable data class Results(val query: String) : NavKey
@Serializable data object Profile : NavKey
@Serializable data object Saved : NavKey
@Serializable data object Compare : NavKey
@Serializable data object MapView : NavKey
