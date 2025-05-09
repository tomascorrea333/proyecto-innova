
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Social from "@/pages/Social";
import Games from "@/pages/Games";
import Auth from "@/pages/Auth";
import MemoryGame from "@/pages/games/MemoryGame";
import AttentionGame from "@/pages/games/AttentionGame";
import PlanningGame from "@/pages/games/PlanningGame";
import SimonGame from "@/pages/games/SimonGame";

import DailyChallenge from "@/pages/DailyChallenge";
import PremiumPage from "@/pages/PremiumPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <Social />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <Games />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/memory"
                element={
                  <ProtectedRoute>
                    <MemoryGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/attention"
                element={
                  <ProtectedRoute>
                    <AttentionGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/planning"
                element={
                  <ProtectedRoute>
                    <PlanningGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/simon"
                element={
                  <ProtectedRoute>
                    <SimonGame />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/reto-del-dia"
                element={
                  <ProtectedRoute>
                    <DailyChallenge />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/premium"
                element={
                  <ProtectedRoute>
                    <PremiumPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
