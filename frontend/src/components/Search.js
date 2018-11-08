import React, { Component } from 'react';
import { Select, Button, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import { getCatalog } from '../util/ApiUtil';

class Search extends Component {
    
    state = {
        query: '',
        type: '',
        order: '',
        submitting: false,
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleClick = async () => {
        this.setState({ submitting: true }, async () => {
            try {
                const { query, type, order } = this.state;
                const { data } = await getCatalog(type, query, order, 'asc');
            } catch (error) {

            }
            if (this.state.submitting) {
                
            }
        });     
        console.log("Input: "+this.state.query+" Order: "+this.state.order+" Submitting: "+this.state.submitting);
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
            { key: 'music', text: 'Musics', value: 'music' },
            { key: 'magazine', text: 'Magazines', value: 'magazine' },
        ];

        return(
            <div style={{ padding: '25%'}}>
            <Input 
                fluid
                name='query'
                value={query}
                type='text' 
                placeholder='Search...' 
                onChange={this.handleChange}
                required
                action>
            <input />
            <Select  
                name='type'
                value={type}
                options={types} 
                placeholder='Book'
                required
                onChange={this.handleChange} />
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
            </div>
        );
    }
}

export default Search;
