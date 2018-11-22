import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import TransactionPage from './pages/TransactionPage';

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
            <ToastProvider placement="bottom-right" autoDismissTimeout={3000}>
                <BrowserRouter>
                    <div style={{ height: '100%' }}>
                        <Navbar vertical={false} token={token}/>   
                        <Switch>
                            <Route path="/login" component={LoginPage}/>
                            <ProtectedRoute exact path="/search" component={Search}/>            
                            <AdminRoute path="/catalog/add" component={CatalogForm}/>
                            <ProtectedRoute path="/catalog" component={Catalog}/>
                            <AdminRoute path="/users/active" component={ViewActiveUsers}/>
                            <AdminRoute path="/users/register" component={RegisterForm}/>
                            <AdminRoute path="/transactions" component={TransactionPage}/>
                            <Redirect from="/" to="/login"/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </ToastProvider>
        );
    }
}

export default App;
