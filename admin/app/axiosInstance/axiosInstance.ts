import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https:locahost:5000/api',
    withCredentials: true,
})


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(originalRequest.url.includes('/auth/refresh')){
            window.location.href="/auth/login"
            return Promise.reject(error);
        }
        if(error.response && error.response.status===401){
            try{
               await axiosInstance.post("/auth/refresh", {}, {withCredentials: true});
               return axiosInstance(originalRequest);
            }
            catch(refreshError){
               window.location.href="/auth/login"
               return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;