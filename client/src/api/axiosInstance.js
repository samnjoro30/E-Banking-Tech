import axios from 'axios';
import { fetchCsrfToken } from '../utils/csrf';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',//"https://e-banking-tech.onrender.com/api",
  withCredentials: true
});

// Request interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
      config.withCredentials = true;
      return config;
  },
  
  (error) => {
      return Promise.reject(error);
  }

);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) =>{

    if (error.response?.status === 403) {
      await fetchCsrfToken();
      return axiosInstance(originalRequest);
    }
      const originalRequest = error.config;

      if(originalRequest.url.includes('/auth/refresh-token')){
          window.location.href="/auth"
          return Promise.reject(error);
      }
      if(error.response && error.response.status===401){
          try{
             await axiosInstance.post("/auth/refresh-token", {}, {withCredentials: true});
             return axiosInstance(originalRequest);
          }
          catch(refreshError){
             window.location.href="/auth"
             return Promise.reject(refreshError);
          }
      }
      return Promise.reject(error);
  }
);

axiosInstance.defaults.withCredentials=true


export default axiosInstance;