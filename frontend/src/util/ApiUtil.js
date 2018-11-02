import axios from 'axios';
import { getToken } from './AuthUtil';

const api = axios.create({
    baseURL: `http://${process.env.REACT_APP_IP}/api/`,
});

export const login = async (email, password) => {
    return await api.post('/users/login', {
        email,
        password,
    });
}

export const logout = async () => {
    return await api({
        method: 'post',
        url: '/users/logout',
        headers: {
                'Authorization': `Bearer ${getToken()}` 
        }, 
    });
}

export const register = async (firstName, lastName, email, address, phone, password, isAdmin) => {
    return await api({
        method: 'post',
        url: '/users',
        data: {
            firstName,
            lastName,
            email,
            address,
            phone,
            password,
            isAdmin,
        }, 
        headers: { 
            'Authorization': `Bearer ${getToken()}` 
        },
    });
}

export const createBook = async (catalogItem, quantity) => {
    return await api({
        method: 'put',
        url: '/catalog/book',
        data: {
            catalogItem,
            quantity,
        },
        headers: {
            'Authorization': `Bearer ${getToken()}` 
        },
    });
}

export const createMagazine = async (catalogItem, quantity) => {
    return await api({
        method: 'put',
        url: '/catalog/magazine',
        data: {
            catalogItem,
            quantity,
        },
        headers: {
            'Authorization': `Bearer ${getToken()}` 
        },
    });
}

export const createMovie = async (catalogItem, quantity) => {
    return await api({
        method: 'put',
        url: '/catalog/movie',
        data: {
            catalogItem,
            quantity,
        },
        headers: {
            'Authorization': `Bearer ${getToken()}` 
        },
    });
}

export const createMusic = async (catalogItem, quantity) => {
    return await api({
        method: 'put',
        url: '/catalog/music',
        data: {
            catalogItem,
            quantity,
        },
        headers: {
            'Authorization': `Bearer ${getToken()}` 
        },
    });
}


export const getActiveUsers = async () => {
    return await api.get('/users?active=true', {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${getToken()}`,
        },
        responseType: 'json',
        crossorigin: true
    });
}

export const getCatalog = async () => {
    return await api.get('/catalog', {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${getToken()}`,
        },
    });
}
