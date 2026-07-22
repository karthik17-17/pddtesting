package com.example.neurostay.data

import com.google.gson.annotations.SerializedName

data class User(
    val id: String?,
    val name: String,
    val email: String
)

data class Hotel(
    val id: Any? = "1",
    val name: String = "Hotel Recommendation",
    val city: String? = null,
    val address: String = "Address not available",
    val price: Any? = "₹1,200",
    val rating: Double = 4.5,
    val matchScore: Int = 90,
    val why: String = "Recommended based on location and guest rating.",
    val mapLink: String = "",
    val image: String = "",
    val images: List<String>? = null,
    val latitude: Double? = null,
    val longitude: Double? = null
) {
    fun getFormattedPrice(): String {
        return when (price) {
            is String -> price
            is Number -> "₹${price.toInt()}"
            else -> "₹1,200"
        }
    }

    fun getIdString(): String {
        return id?.toString() ?: "1"
    }
}

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
    val success: Boolean = true,
    val query: String? = null,
    val count: Int? = 0,
    val hotels: List<Hotel> = emptyList(),
    val results: List<Hotel> = emptyList(),
    val data: List<Hotel> = emptyList()
) {
    fun getHotelList(): List<Hotel> {
        return when {
            hotels.isNotEmpty() -> hotels
            results.isNotEmpty() -> results
            data.isNotEmpty() -> data
            else -> emptyList()
        }
    }
}

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
    val hotels: List<SavedHotel> = emptyList()
)

data class GenericResponse(
    val success: Boolean,
    val message: String?
)
