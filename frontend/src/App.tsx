import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoadingPage = lazy(() => import("./pages/LoadingPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const HotelDetailPage = lazy(() => import("./pages/HotelDetailPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const { token } = useAuth();

  const isAuthRoute = ["/login", "/register", "/forgot-password"].includes(
    location.pathname.toLowerCase()
  );

  const showNav = token && !isAuthRoute;

  return (
    <div className="h-screen bg-[#071028] text-white flex flex-col overflow-hidden">
      {showNav && <Navbar />}

      {/* Content area: offset by sidebar width on desktop, fills remaining viewport height */}
      <div className={`flex-1 overflow-auto ${showNav ? "md:ml-64 pb-16 md:pb-0 pt-16 md:pt-0" : ""}`}>
        <main className="w-full min-h-full">
          <Suspense fallback={
            <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          }>
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
          </Suspense>
        </main>

        {showNav && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;