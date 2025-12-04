import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", //"https://e-banking-tech.onrender.com/api",
});

// Request interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/auth'; // Force full page reload to clear state
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;