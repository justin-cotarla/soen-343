import React, { Component } from 'react';
import { Select, Button, Input, Grid, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

class Search extends Component {
    
    state = {
        query: '',
        type: '',
        order: '',
        submitting: false,
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleClick = async () => {
        this.setState({ submitting: true });     
    }
    
    render(){
        const { query, type, order, submitting } = this.state
        const options = [
            { key: 'title', text: 'Title', value: 'title' },
            { key: 'date', text: 'Date', value: 'date' },
        ];
        const types = [
            { key: 'book', text: 'Books', value: 'book' },
            { key: 'movie', text: 'Movies', value: 'movie' },
            { key: 'music', text: 'Music', value: 'music' },
            { key: 'magazine', text: 'Magazines', value: 'magazine' },
        ];

        if (submitting) {
            const { query, type, order } = this.state;
            return <Redirect to={{
                pathname: `/catalog/${type}`,
                search: `?query=${query}&order=${order}&direction=asc`,
            }} />
        }

        return(
            <Grid style={{ height: '100%' }}>
                <Grid.Column verticalAlign="middle" textAlign="center">
                    <Header 
                        size="large" 
                        textAlign="left" 
                        color="teal" 
                        style={{ width: '80%', margin: '0.5em auto'}}>
                        Looking for something?
                    </Header>
                    <Input 
                        fluid
                        name='query'
                        value={query}
                        type='text' 
                        placeholder='Search...' 
                        onChange={this.handleChange}
                        required
                        action
                        style={{ width: '80%', margin: '0 auto'}}>
                        <input />
                        <Select  
                            name='type'
                            value={type}
                            options={types} 
                            placeholder='Books'
                            required
                            onChange={this.handleChange} 
                            style={{ minWidth: '110px'}}/>
                        <Select  
                            name='order'
                            value={order}
                            options={options} 
                            placeholder='Title'
                            required
                            compact
                            onChange={this.handleChange} />
                        <Button 
                            type='submit'
                            loading={submitting}
                            disabled={submitting}
                            onClick={this.handleClick}>
                            Search
                        </Button>
                    </Input>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Search;
