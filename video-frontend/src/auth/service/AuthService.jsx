import axios from "axios";

export const authService = {
    login: (data) => axios.post('http://localhost:8080/api/v1/auth/login', data),
    register: (data) => axios.post('http://localhost:8080/api/v1/auth/register', data),
};
