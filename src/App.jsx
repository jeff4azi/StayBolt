import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ListingsProvider } from "./context/ListingsContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AgentProfilePage from "./pages/AgentProfilePage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingsProvider>
          <div className="min-h-screen bg-gradient-to-br from-black via-[#0d0820] to-[#1a0d35] text-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/listing/:id" element={<PropertyDetailPage />} />
              <Route path="/:slug" element={<AgentProfilePage />} />
            </Routes>
          </div>
        </ListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
