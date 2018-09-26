import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => <h1>SOEN 343</h1>}/>
                    <ProtectedRoute path="/admin" component={AdminDashboard}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
