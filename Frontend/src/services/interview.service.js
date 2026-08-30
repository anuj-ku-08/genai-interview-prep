import api from "./api";

export const generateReport = async (formData) => {
  const response = await api.post("/interview/generate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getMyReports = async () => {
  const response = await api.get("/interview/my-reports");
  return response.data;
};

export const getReportById = async (id) => {
  const response = await api.get(`/interview/report/${id}`);
  return response.data;
};

export const downloadPdfReport = async (id, jobRole) => {
  const response = await api.get(`/interview/report/${id}/pdf`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Prep_${jobRole || "Report"}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};