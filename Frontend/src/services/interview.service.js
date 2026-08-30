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