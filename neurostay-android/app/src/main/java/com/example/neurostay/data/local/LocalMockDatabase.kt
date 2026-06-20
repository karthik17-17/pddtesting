package com.example.neurostay.data.local

import android.content.Context
import android.content.SharedPreferences
import com.example.neurostay.data.SavedHotel
import com.example.neurostay.data.SaveHotelRequest
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.UUID

class LocalMockDatabase(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("neurostay_mock_db", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun getSavedHotels(): List<SavedHotel> {
        val json = prefs.getString("saved_hotels", null) ?: return emptyList()
        return try {
            val type = object : TypeToken<List<SavedHotel>>() {}.type
            gson.fromJson(json, type)
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun saveHotel(req: SaveHotelRequest, userId: String): Boolean {
        val current = getSavedHotels().toMutableList()
        
        // Prevent duplicates
        val exists = current.any { it.hotelName == req.hotelName && it.userId == userId }
        if (exists) return false
        
        val newHotel = SavedHotel(
            id = "mock-id-" + UUID.randomUUID().toString().substring(0, 8),
            userId = userId,
            hotelName = req.hotelName,
            hotelImage = req.hotelImage,
            price = req.price,
            address = req.address,
            rating = req.rating,
            matchScore = req.matchScore,
            why = req.why,
            mapLink = req.mapLink,
            createdAt = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).format(java.util.Date())
        )
        current.add(0, newHotel)
        
        prefs.edit().putString("saved_hotels", gson.toJson(current)).apply()
        return true
    }

    fun deleteHotel(hotelId: String): Boolean {
        val current = getSavedHotels().toMutableList()
        val index = current.indexOfFirst { it.id == hotelId }
        if (index == -1) return false
        
        current.removeAt(index)
        prefs.edit().putString("saved_hotels", gson.toJson(current)).apply()
        return true
    }
}
