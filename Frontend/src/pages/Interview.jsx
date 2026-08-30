import { useState } from "react";
import { useInterview } from "../context/InterviewContext";
import ReportCard from "../components/ReportCard";
import { Link } from "react-router-dom";

export default function Interview() {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const { createReport, currentReport, loading } = useInterview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF resume");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append("jobRole", jobRole);
      formData.append("jobDescription", jobDescription);
      formData.append("resume", file);

      await createReport(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview report");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>AI Interview Prep Generator</h1>
        <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>← Back to Dashboard</Link>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Target Job Role:*</label>
          <input
            type="text"
            required
            value={jobRole}
            placeholder="e.g. Full Stack Developer, Python Engineer"
            onChange={(e) => setJobRole(e.target.value)}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Job Description (Optional):</label>
          <textarea
            rows="4"
            value={jobDescription}
            placeholder="Paste role requirements, tech stack, or job posting..."
            onChange={(e) => setJobDescription(e.target.value)}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Upload Resume (PDF):*</label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing Resume with Gemini AI..." : "Generate Interview Plan"}
        </button>
      </form>

      {currentReport && <ReportCard report={currentReport} />}
    </div>
  );
}