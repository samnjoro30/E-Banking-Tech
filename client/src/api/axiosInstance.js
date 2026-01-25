import axios from 'axios';
import { fetchCsrfToken } from '../utils/csrf';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', //'https://e-banking-tech.onrender.com/api',
  withCredentials: true,
});
// Request interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  config => {
    config.withCredentials = true;
    return config;
  },

  error => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';

    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/refresh-token');

      if (error.response?.status === 403 && !isAuthEndpoint) {
        originalRequest._retry = true; // ⭐ CRITICAL
        await fetchCsrfToken();
        return axiosInstance(originalRequest);
      }
  
      // 4️⃣ Refresh token logic
      if (error.response?.status === 401 && !url.includes('/auth/refresh-token')) {
        try {
          originalRequest._retry = true;
          await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
  }
);

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
