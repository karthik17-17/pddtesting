package com.example.neurostay.data.local

import android.content.Context
import android.content.SharedPreferences
import com.example.neurostay.data.User
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class PreferencesManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("neurostay_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun saveToken(token: String) {
        prefs.edit().putString("auth_token", token).apply()
    }

    fun getToken(): String? {
        return prefs.getString("auth_token", null)
    }

    fun clearToken() {
        prefs.edit().remove("auth_token").apply()
    }

    fun saveUser(user: User) {
        val json = gson.toJson(user)
        prefs.edit().putString("auth_user", json).apply()
    }

    fun getUser(): User? {
        val json = prefs.getString("auth_user", null) ?: return null
        return try {
            gson.fromJson(json, User::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun clearUser() {
        prefs.edit().remove("auth_user").apply()
    }

    fun saveRecentSearches(searches: List<String>) {
        val json = gson.toJson(searches)
        prefs.edit().putString("recent_searches", json).apply()
    }

    fun getRecentSearches(): List<String> {
        val json = prefs.getString("recent_searches", null) ?: return emptyList()
        return try {
            val type = object : TypeToken<List<String>>() {}.type
            gson.fromJson(json, type)
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun addRecentSearch(search: String) {
        val current = getRecentSearches().toMutableList()
        current.remove(search)
        current.add(0, search)
        if (current.size > 10) {
            current.removeAt(current.size - 1)
        }
        saveRecentSearches(current)
    }

    fun clearRecentSearches() {
        prefs.edit().remove("recent_searches").apply()
    }
}
