import axios from 'axios';

const api = axios.create({
    baseURL: 'localhost/api/',
});

export const login = async (email, password) => {
    return await api.post('/accounts/login', {
        email,
        password,
    });
}
