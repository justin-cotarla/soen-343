import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from "./components/Navbar";
import LoginPage from './pages/LoginPage';

import RegisterForm from "./components/RegisterForm";
import ViewActiveUsers from "./components/ViewActiveUsers";
import Catalog from './components/Catalog';
import CatalogForm from './components/CatalogForm';
import Search from './components/Search';

import { getDecodedToken } from './util/AuthUtil';

class App extends Component {
    render() {
        const token = getDecodedToken();
        return (
            <BrowserRouter>
                <div style={{ height: '100%' }}>
                    <Navbar vertical={false} token={token}/>   
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <ProtectedRoute path="/search" component={Search}/>           
                        <ProtectedRoute exact path="/catalog" component={Catalog}/>
                        <AdminRoute path="/catalog/add" component={CatalogForm}/>
                        <AdminRoute path="/users/active" component={ViewActiveUsers}/>
                        <AdminRoute path="/users/register" component={RegisterForm}/>
                        <Redirect from="/" to="/login"/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
