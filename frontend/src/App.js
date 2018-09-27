import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => <h1>SOEN 343</h1>}/>
                    <Route exact path="/login" component={LoginPage}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
