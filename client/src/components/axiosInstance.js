import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://e-banking-tech.onrender.com/api",
  withCredentials:true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken'); // or localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors without refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: redirect user to login
      sessionStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;