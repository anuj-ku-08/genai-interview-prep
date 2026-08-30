import { createContext, useContext, useState, useEffect } from "react";
import { getMyReports, generateReport as apiGenerateReport } from "../services/interview.service";

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (formData) => {
    setLoading(true);
    try {
      const data = await apiGenerateReport(formData);
      setReports((prev) => [data.report, ...prev]);
      setCurrentReport(data.report);
      return data.report;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        reports,
        currentReport,
        setCurrentReport,
        createReport,
        fetchReports,
        loading,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => useContext(InterviewContext);