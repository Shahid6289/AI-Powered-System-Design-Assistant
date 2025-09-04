import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
