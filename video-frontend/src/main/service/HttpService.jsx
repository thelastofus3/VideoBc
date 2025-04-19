import axios from 'axios';

const httpService = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
});

httpService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpService;