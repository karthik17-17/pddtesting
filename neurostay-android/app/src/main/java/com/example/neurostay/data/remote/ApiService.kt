package com.example.neurostay.data.remote

import com.example.neurostay.data.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("/api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("/api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("/api/otp/send-otp")
    suspend fun sendOtp(@Body request: Map<String, String>): Response<GenericResponse>

    @POST("/api/auth/forgot-password")
    suspend fun forgotPassword(@Body request: Map<String, String>): Response<GenericResponse>

    @POST("/api/auth/reset-password")
    suspend fun resetPassword(@Body request: Map<String, String>): Response<GenericResponse>

    @PUT("/api/auth/profile")
    suspend fun updateProfile(@Body request: UpdateProfileRequest): Response<AuthResponse>

    @PUT("/api/auth/password")
    suspend fun updatePassword(@Body request: UpdatePasswordRequest): Response<GenericResponse>

    @POST("/api/serpapi/hotels")
    suspend fun searchHotels(@Body request: SearchRequest): Response<SearchResponse>

    @POST("/api/saved")
    suspend fun saveHotel(@Body request: SaveHotelRequest): Response<GenericResponse>

    @GET("/api/saved")
    suspend fun getSavedHotels(): Response<SavedHotelsResponse>

    @DELETE("/api/saved/{id}")
    suspend fun deleteSavedHotel(@Path("id") id: String): Response<GenericResponse>
}
