import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import SearchBar from '../components/SearchBar';

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: undefined,
        };
    }

    onSubmit = (query, type, order) => {
        this.setState({
            form: {
                query,
                type,
                order,
            },
        });
    };

    render() {
        const { form } = this.state;

        return (
            <Grid style={{ height: '100%', marginTop: '-5%' }}>
                { form &&
                    <Redirect to={{
                        pathname: '/catalog',
                        state: form,
                    }} />
                }
                <Grid.Column verticalAlign="middle" textAlign="center">
                    <Header 
                        size="large" 
                        textAlign="left" 
                        color="teal" 
                        style={{ width: '80%', margin: '0.5em auto'}}>
                        Looking for something?
                    </Header>
                    <SearchBar
                        onSubmit={this.onSubmit}
                        typeFilter
                        orderFilter
                    />
                </Grid.Column>
            </Grid>
        );
    }
}

export default SearchPage;
