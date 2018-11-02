import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as decode from 'jwt-decode';

export const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() 
            ? <Component {...props}/>
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }}/> 
        }
    />
);

export const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAdmin() 
            ? <Component {...props}/>
            : <Redirect to={{ pathname: '/', state: { from: props.location } }}/> 
        }
    />
);

export const getToken = () => {
    return localStorage.getItem('Authorization');
}

export const getDecodedToken = () => {
    const token = getToken();
    try {
        return decode(token);
    } catch (err) {
        return null;
    }
}

export const isAuthenticated = () => {
    try {
        const token = getDecodedToken();
        if (token) {
            return true;
        }

        return false;
    } catch(err) {
        return false;
    }
};

export const isAdmin = () => {
    try {
        const { isAdmin } = getDecodedToken();
        return isAdmin;
    } catch (err) {
        return false;
    }
};

export const invalidate = () => {
    localStorage.removeItem('Authorization');
    window.location.reload();
}
