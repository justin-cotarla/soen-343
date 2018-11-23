import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'semantic-ui-react';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            type: '',
            order: '',
        };
    }

    options = [
        { key: 'title', text: 'Title', value: 'title' },
        { key: 'date', text: 'Date', value: 'date' },
    ];

    types = [
        { key: 'book', text: 'Books', value: 'book' },
        { key: 'movie', text: 'Movies', value: 'movie' },
        { key: 'music', text: 'Music', value: 'music' },
        { key: 'magazine', text: 'Magazines', value: 'magazine' },
    ];

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    onSubmit = () => {
        const { onSubmit } = this.props;
        const {
            query,
            type,
            order,
        } = this.state;

        onSubmit(query, type, order);
    }
    
    render() {
        const {
            query,
            type,
            order,
        } = this.state;
        const {
            typeFilter,
            orderFilter,
        } = this.props;

        return(
            <Form
                onSubmit={this.onSubmit}
            >
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
                { typeFilter &&
                    <Select  
                        name='type'
                        value={type}
                        options={this.types} 
                        placeholder='Books'
                        required
                        onChange={this.handleChange} 
                        style={{ minWidth: '110px'}}/>
                }
                { orderFilter &&
                    <Select  
                        name='order'
                        value={order}
                        options={this.options} 
                        placeholder='Order by'
                        required
                        compact
                        onChange={this.handleChange} />
                }
                <Button 
                    type='submit'
                    >
                    Search
                </Button>
            </Input>
            </Form>
        );
    }
}

export default SearchBar;
