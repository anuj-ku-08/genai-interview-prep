import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome, {user?.fullName || "User"}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout} style={{ marginTop: "20px", padding: "8px 16px" }}>
        Logout
      </button>
    </div>
  );
}