import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => <h1>SOEN 343</h1>}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
