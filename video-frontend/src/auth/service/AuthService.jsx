import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const authService = {
    login: (data) => axios.post(`${API_URL}/api/v1/auth/login`, data),
    register: (data) => axios.post(`${API_URL}/api/v1/auth/register`, data),
};
