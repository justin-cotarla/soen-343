import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isAuthenticated, isAdmin } from '../util/AuthUtil';

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() && !isAdmin()
            ? <Component {...props}/>
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }}/> 
        }
    />
);

export default ProtectedRoute;
