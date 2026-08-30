export default function ReportCard({ report }) {
  if (!report) return null;

  const { skillGapAnalysis, technicalQuestions, behavioralQuestions, jobRole } = report;

  return (
    <div style={{ marginTop: "30px", textAlign: "left", maxWidth: "900px", margin: "30px auto" }}>
      <h2>Analysis & Interview Prep: {jobRole}</h2>

      {/* Skill Gap Analysis */}
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
        <h3>Skill Gap Analysis</h3>
        
        <div>
          <strong style={{ color: "#2e7d32" }}>Matched Skills:</strong>
          <ul>
            {skillGapAnalysis?.matchedSkills?.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <strong style={{ color: "#c62828" }}>Missing / Recommended Skills:</strong>
          <ul>
            {skillGapAnalysis?.missingSkills?.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <strong>Recommendations:</strong>
          <ul>
            {skillGapAnalysis?.recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Questions */}
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
        <h3>Technical Questions</h3>
        {technicalQuestions?.map((q, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <p><strong>Q{i + 1}: {q.question}</strong></p>
            <p style={{ fontStyle: "italic", color: "#555" }}>Intent: {q.intention}</p>
            <blockquote style={{ background: "#f5f5f5", padding: "10px", borderRadius: "4px" }}>
              <strong>Sample Approach:</strong> {q.sampleAnswer}
            </blockquote>
          </div>
        ))}
      </div>

      {/* Behavioral Questions */}
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px" }}>
        <h3>Behavioral Questions</h3>
        {behavioralQuestions?.map((q, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <p><strong>Q{i + 1}: {q.question}</strong></p>
            <p style={{ fontStyle: "italic", color: "#555" }}>Intent: {q.intention}</p>
            <blockquote style={{ background: "#f5f5f5", padding: "10px", borderRadius: "4px" }}>
              <strong>STAR Guide:</strong> {q.sampleAnswer}
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}