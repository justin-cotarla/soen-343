import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { invalidate } from './AuthUtil';

const api = axios.create({
    baseURL: `http://${process.env.REACT_APP_IP}/api/`,
});

api.interceptors.response.use(async (response) => {
    return await response;
}, async (error) => {
    if(error.response.status === 401 || error.response.status === 403) {
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    });
}


export const getActiveUsers = async () => {
    return await api.get('/users?active=true', {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
        responseType: 'json',
        crossorigin: true
    });
}

export const getCatalog = async (type='', query='', order='', direction='') => {
    return await api({
        method: 'get',
        url: `/catalog/${type}?query=${query}&order=${order}&direction=${direction}`,
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
    })
}

export const getCatalogItem = async (catalogItemId) => {
    return await api.get(`/catalog/${catalogItemId}`, {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
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
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    });
}

export const deleteCatalogItem = async (catalogItemType, id) => {
    return await api({
        method: 'delete',
        url: `/catalog/${catalogItemType}/${id}`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    });
}

export const addInventoryItem = async (catalogItemType, id) => {
    return await api({
        method: 'put',
        url: `/catalog/${catalogItemType}/${id}/inventory`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const deleteInventoryItem = async (catalogItemType, id) => {
    return await api({
        method: 'delete',
        url: `/catalog/${catalogItemType}/${id}/inventory`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const getTransactions = async (params) => {
    const {
        date,
        query,
        operation,
    } = params;
    return await api({
        method: 'get',
        url: `/transactions`,
        params: {
            timestamp: date,
            query,
            operation,
        },
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const getCart = async () => {
    const token = localStorage.getItem('Authorization');
    return await api({
        method: 'get',
        url: `/carts/${jwtDecode(token).user.id}`,
        headers: {
            'Authorization': `Bearer ${token}` 
        },
    })
}

export const updateCart = async (items) => {
    const token = localStorage.getItem('Authorization');
    return await api({
        method: 'post',
        url: `/carts/${jwtDecode(token).user.id}`,
        data: {
            items,
        },
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const deleteCart = async () => {
    const token = localStorage.getItem('Authorization');
    return await api({
        method: 'delete',
        url: `/carts/${jwtDecode(token).user.id}`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const checkout = async () => {
    return await api({
        method: 'put',
        url: `/transactions`,
        data: {
            operation: 'loan',
        },
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const getLoans = async (userId) => {
    return await api({
        method: 'get',
        url: `/users/${userId}/loans`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}

export const returnItem = async (inventoryItemId) => {
    return await api({
        method: 'put',
        url: '/transactions',
        data: {
            inventoryItemId,
            operation: 'return',
        },
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}` 
        },
    })
}
