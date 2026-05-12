import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";
import ResultsPage from "./pages/ResultsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MapPage from "./pages/MapPage";
import ComparePage from "./pages/ComparePage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectSummaryPage from "./pages/ProjectSummaryPage";
import BookingPage from "./pages/BookingPage";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#071028] text-white flex flex-col">
        {/* NAVBAR */}
        <Navbar />

        {/* PAGES */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/loading"
              element={<LoadingPage />}
            />

            <Route
              path="/results"
              element={<ResultsPage />}
            />

            <Route
              path="/hotel/:id"
              element={<HotelDetailPage />}
            />

            <Route
              path="/map"
              element={<MapPage />}
            />

            <Route
              path="/compare"
              element={<ComparePage />}
            />

            <Route
              path="/contact"
              element={<ContactPage />}
            />

            <Route
              path="/about"
              element={<AboutPage />}
            />

            <Route
              path="/summary"
              element={<ProjectSummaryPage />}
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            {/* BOOKING ROUTES */}
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
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 PAGE */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;