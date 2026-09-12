import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interview from "./pages/Interview";

export default function App() {
  const { user } = useAuth();

  return (
    <InterviewProvider>
      <Routes>
        {/* Guest / Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route
          path="/interview"
          element={<Interview />}
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </InterviewProvider>
  );
}