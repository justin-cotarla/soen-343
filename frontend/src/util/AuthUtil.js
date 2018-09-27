import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAdmin = () => true;

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
