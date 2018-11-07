import axios from 'axios';
import { invalidate } from './AuthUtil';

const token = localStorage.getItem('Authorization');
const api = axios.create({
    baseURL: `http://${process.env.REACT_APP_IP}/api/`,
});

api.interceptors.response.use(async (response) => {
    return await response;
}, async (error) => {
    if(error.response.status === 401 || error.response.status === 401) {
        invalidate();
    }

    throw error;
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
            'Authorization': `Bearer ${token}` 
        }, 
    });
}

export const register = async (firstName, lastName, email, address, phone, password, isAdmin) => {
    return await api({
        method: 'put',
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
            'Authorization': `Bearer ${token}` 
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
            'Authorization': `Bearer ${token}` 
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
            'Authorization': `Bearer ${token}` 
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
            'Authorization': `Bearer ${token}` 
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
            'Authorization': `Bearer ${token}` 
        },
    });
}


export const getActiveUsers = async () => {
    return await api.get('/users?active=true', {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${token}`,
        },
        responseType: 'json',
        crossorigin: true
    });
}

export const getCatalog = async () => {
    return await api.get('/catalog', {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${token}`,
        },
    });
}

export const getCatalogItem = async (type, catalogItemId) => {
    return await api.get(`/catalog/${type}/${catalogItemId}`, {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${token}`,
        },
    });
}

export const editCatalogItem = async (catalogItemType, id, catalogItem) => {
    const date = new Date(catalogItem.date);
    catalogItem.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    return await api({
        method: 'post',
        url: `/catalog/${catalogItemType}/${id}`,
        data: { catalogItem },
        headers: {
            'Authorization': `Bearer ${token}` 
        },
    });
}

export const deleteCatalogItem = async (catalogItemType, id) => {
    return await api({
        method: 'delete',
        url: `/catalog/${catalogItemType}/${id}`,
        headers: {
            'Authorization': `Bearer ${token}` 
        },
    });
}

export const addInventoryItem = async (catalogItemType, id) => {
    return await api({
        method: 'put',
        url: `/catalog/${catalogItemType}/${id}/inventory`,
        headers: {
            'Authorization': `Bearer ${token}` 
        },
    })
}

export const deleteInventoryItem = async (catalogItemType, id) => {
    return await api({
        method: 'delete',
        url: `/catalog/${catalogItemType}/${id}/inventory`,
        headers: {
            'Authorization': `Bearer ${token}` 
        },
    })
}
