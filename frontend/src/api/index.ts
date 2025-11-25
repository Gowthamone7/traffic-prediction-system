import axios from 'axios';

// API base URL from environment variable or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const trafficAPI = {
  getAll: (params?: any) => api.get('/traffic', { params }),
  getLive: () => api.get('/traffic/live'),
  getByRoute: (routeId: string, hours?: number) => 
    api.get(`/traffic/route/${routeId}`, { params: { hours } }),
  getByTimeRange: (params: any) => api.get('/traffic/time-range', { params }),
  create: (data: any) => api.post('/traffic', data),
};

export const routeAPI = {
  getAll: () => api.get('/routes'),
  getById: (id: string) => api.get(`/routes/${id}`),
  create: (data: any) => api.post('/routes', data),
  update: (id: string, data: any) => api.put(`/routes/${id}`, data),
  delete: (id: string) => api.delete(`/routes/${id}`),
};

export const predictionAPI = {
  predict: (data: any) => api.post('/predictions', data),
  getByRoute: (routeId: string, hours?: number) => 
    api.get(`/predictions/route/${routeId}`, { params: { hours } }),
  getHourly: (routeId: string, dayOfWeek: number) => 
    api.get(`/predictions/hourly/${routeId}`, { params: { day_of_week: dayOfWeek } }),
  getAll: (hour: number, dayOfWeek: number) => 
    api.get('/predictions/all', { params: { hour, day_of_week: dayOfWeek } }),
};

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getTrends: (params?: any) => api.get('/analytics/trends', { params }),
  getHeatmap: (routeId?: string) => 
    api.get('/analytics/heatmap', { params: { routeId } }),
  compareRoutes: (routeIds: string[]) => 
    api.post('/analytics/compare', { routeIds }),
  getHourlyPatterns: (routeId?: string) => 
    api.get('/analytics/hourly-patterns', { params: { routeId } }),
  getRouteStats: (routeId: string) => 
    api.get(`/analytics/route-stats/${routeId}`),
};

export default api;
