import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";
import ResultsPage from "./pages/ResultsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import ComparePage from "./pages/ComparePage";
import MapPage from "./pages/MapPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isAuthRoute = ["/login", "/register", "/forgot-password"].includes(
    location.pathname.toLowerCase()
  );

  const showNav = token && !isAuthRoute;

  return (
    <div className="min-h-screen bg-[#071028] text-white flex w-full">
      {showNav && <Navbar />}

      <div className={`flex-1 flex flex-col ${showNav ? "md:ml-64 pt-16 pb-16 md:pt-0 md:pb-0" : ""} w-full`}>
        <main className="flex-1 w-full">
          <Routes>
            {/* Public Routes - protected */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/loading" element={<ProtectedRoute><LoadingPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/hotel/:id" element={<ProtectedRoute><HotelDetailPage /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />

            {/* Booking */}
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />

            {/* Saved */}
            <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />

            {/* Profile */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {showNav && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;