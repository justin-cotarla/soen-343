import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import ClientRoute from './components/ClientRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import ToastLoader from './components/ToastLoader';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import TransactionPage from './pages/TransactionPage';
import ViewLoansPage from './pages/ViewLoansPage';
import SearchPage from './pages/SearchPage';
import CatalogPage from './pages/CatalogPage';

import RegisterForm from "./components/RegisterForm";
import ViewActiveUsers from "./components/ViewActiveUsers";
import CatalogForm from './components/CatalogForm';

import { getDecodedToken } from './util/AuthUtil';

class App extends Component {
    render() {
        const token = getDecodedToken();
        return (
            <ToastProvider placement="bottom-right" autoDismissTimeout={3000}>
                <BrowserRouter>
                    <div style={{ height: '100%' }}>
                        <ToastLoader />
                        <Navbar vertical={false} token={token}/>   
                        <Switch>
                            <Route path="/login" component={LoginPage}/>
                            <ProtectedRoute exact path="/search" component={SearchPage}/>            
                            <AdminRoute path="/catalog/add" component={CatalogForm}/>
                            <ProtectedRoute path="/catalog" component={CatalogPage}/>
                            <AdminRoute path="/users/active" component={ViewActiveUsers}/>
                            <AdminRoute path="/users/register" component={RegisterForm}/>
                            <ClientRoute path="/loans" component={ViewLoansPage}/>
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
