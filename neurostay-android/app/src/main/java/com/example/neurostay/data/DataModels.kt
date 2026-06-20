package com.example.neurostay.data

import com.google.gson.annotations.SerializedName

data class User(
    val id: String?,
    val name: String,
    val email: String
)

data class Hotel(
    val id: Int,
    val name: String,
    val city: String?,
    val address: String,
    val price: String,
    val rating: Double,
    val matchScore: Int,
    val why: String,
    val mapLink: String,
    val image: String,
    val images: List<String>? = null,
    val latitude: Double?,
    val longitude: Double?
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String
)

data class UpdateProfileRequest(
    val email: String,
    val name: String
)

data class UpdatePasswordRequest(
    val email: String,
    @SerializedName("currentPassword") val currentPassword: String,
    @SerializedName("newPassword") val newPassword: String
)

data class AuthResponse(
    val success: Boolean,
    val message: String?,
    val token: String?,
    val user: User?
)

data class SearchRequest(
    val query: String
)

data class SearchResponse(
    val success: Boolean,
    val query: String?,
    val count: Int,
    val hotels: List<Hotel>
)

data class SaveHotelRequest(
    val hotelName: String,
    val hotelImage: String,
    val price: String,
    val address: String,
    val rating: Double,
    val matchScore: Int,
    val why: String,
    val mapLink: String
)

data class SavedHotel(
    @SerializedName("_id") val id: String,
    val userId: String,
    val hotelName: String,
    val hotelImage: String?,
    val price: String?,
    val address: String?,
    val rating: Double?,
    val matchScore: Int?,
    val why: String?,
    val mapLink: String?,
    val createdAt: String?
)

data class SavedHotelsResponse(
    val success: Boolean,
    val message: String?,
    val hotels: List<SavedHotel>
)

data class GenericResponse(
    val success: Boolean,
    val message: String?
)
