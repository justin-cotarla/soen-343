import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as decode from 'jwt-decode';

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

export const isAuthenticated = () => {
    const token = getToken();
    try {
        decode(token);
        return true;
    } catch(err) {
        return false;
    }
};

export const isAdmin = () => {
    const token = getToken();
    try {
        const { isAdmin } = decode(token);
        return isAdmin;
    } catch (err) {
        return false;
    }
};
