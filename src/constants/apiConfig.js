// API Configuration
export const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/login`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  
  // Dashboard (untuk future development)
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard/stats`,
  DASHBOARD_FORECAST: `${API_BASE_URL}/dashboard/forecast`,
};

export default API_BASE_URL;
