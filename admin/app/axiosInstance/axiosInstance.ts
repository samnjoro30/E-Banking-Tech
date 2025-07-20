import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https:locahost:5000/api',
})

export default axiosInstance;