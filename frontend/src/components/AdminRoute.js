import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isAdmin } from '../util/AuthUtil';

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAdmin() 
            ? <Component {...props}/>
            : <Redirect to={{ pathname: '/', state: { from: props.location } }}/> 
        }
    />
);

export default AdminRoute;
