import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

import { AdminRoute } from './util/AuthUtil';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => <h1>SOEN 343</h1>}/>
                    <Route exact path="/login" component={LoginPage}/>
                    <AdminRoute path="/admin" component={AdminDashboard}/>             
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
