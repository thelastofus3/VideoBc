import axios from "axios";

export const authService = {
    login: (data) => axios.post('/api/v1/auth/login', data),
    register: (data) => axios.post('/api/v1/auth/register', data),
};
