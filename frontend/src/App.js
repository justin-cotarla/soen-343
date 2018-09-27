import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AdminRoute } from './util/AuthUtil';
import AdminDashboard from './pages/AdminDashboard';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => <h1>SOEN 343</h1>}/>
                    <AdminRoute path="/admin" component={AdminDashboard}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
