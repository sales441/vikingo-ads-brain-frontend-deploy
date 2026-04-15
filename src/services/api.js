import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message || "Erro desconhecido";
    return Promise.reject(new Error(msg));
  }
);

// Campaigns
export const getCampaigns = () => api.get("/campaigns");
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const createCampaign = (data) => api.post("/campaigns", data);

// Keywords
export const getKeywords = (campaignId) =>
  api.get("/keywords", { params: { campaignId } });
export const updateKeyword = (id, data) => api.put(`/keywords/${id}`, data);
export const createKeyword = (data) => api.post("/keywords", data);
export const deleteKeyword = (id) => api.delete(`/keywords/${id}`);

// Competition
export const getCompetitionData = (keyword) =>
  api.get("/competition", { params: { keyword } });
export const getCompetitorProducts = () => api.get("/competition/products");

// Reports
export const getReports = (params) => api.get("/reports", { params });
export const getDashboardMetrics = () => api.get("/reports/dashboard");

// Settings
export const getSettings = () => api.get("/settings");
export const saveSettings = (data) => api.put("/settings", data);

export default api;
