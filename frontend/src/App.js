import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from "./components/Navbar";
import LoginPage from './pages/LoginPage';

import RegisterForm from "./components/RegisterForm";
import ViewActiveUsers from "./components/ViewActiveUsers";
import Catalog from './components/Catalog';
import CatalogForm from './components/CatalogForm';

import { ProtectedRoute, AdminRoute, getDecodedToken } from './util/AuthUtil';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div style={{ height: '100%' }}>
                <Navbar vertical={false} user={getDecodedToken()}/>   
                <Switch>
                    <Route path="/login" component={LoginPage}/> 
                    <ProtectedRoute exact path="/catalog" component={Catalog}/>
                    <Route path="/catalog/add" component={CatalogForm}/>
                    <AdminRoute path="/users/active" component={ViewActiveUsers}/>
                    <AdminRoute path="/users/register" component={RegisterForm}/>
                </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
