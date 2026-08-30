import { useAuth } from "../context/AuthContext";
import { useInterview } from "../context/InterviewContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const { reports, setCurrentReport } = useInterview();

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        <div>
          <h2>Dashboard</h2>
          <p>Welcome, <strong>{user?.fullName}</strong> ({user?.email})</p>
        </div>
        <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer" }}>Logout</button>
      </header>

      <div style={{ marginTop: "30px" }}>
        <Link
          to="/interview"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          + Prepare New Interview
        </Link>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Your Past Reports ({reports.length})</h3>
        {reports.length === 0 ? (
          <p>No reports generated yet. Click above to get started!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reports.map((report) => (
              <li
                key={report._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 5px" }}>{report.jobRole}</h4>
                  <small style={{ color: "#666" }}>
                    Created on {new Date(report.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Link
                  to="/interview"
                  onClick={() => setCurrentReport(report)}
                  style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}
                >
                  View Details →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}