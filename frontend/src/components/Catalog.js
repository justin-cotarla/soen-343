import React from 'react'
import { Grid, List, Header, Select } from 'semantic-ui-react'
import CatalogItemPreview from "../components/CatalogItemPreview";
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import { getCatalog } from "../util/ApiUtil";

class Catalog extends React.Component {
    state = { 
        catalog: null,
        type: '',
        query: '',
        order: '',
        direction: '',
     };

    componentDidMount = async () => {
        try {
            console.log(this.props);
            const { type, query, order, direction } = queryString.parse(this.props.location.search);
            //const { data } = await getCatalog(type, query, order, direction);
            this.setState({ 
                type: type,
                query: query,
                order: order,
                direction: direction,
             });
        } catch (error) {

        }
    }

    componentDidUpdate = async (prevProps) => {
        const { type, query, order, direction } = queryString.parse(this.props.location.search);
        //const { data } = await getCatalog(type, query, order, direction);
        if (this.props.location.search !== prevProps.location.search) {
          this.setState({ 
              type: type,
              query: query,
              order: order,
              direction: direction,

           });
           console.log(query)
        }
      }

    handleChange = (e, { name, value }) => this.setState({ [name]: value }, () => {
         const { type, query, order, direction } = this.state;
        // const { data } = await getCatalog(type, query, order, direction);
        //     this.setState({  
        //         catalog: data,
        //     })
        if (direction === "asc") {
            window.history.pushState({
                urlPath:`/catalog?query=${query}&type=${type}&order=${order}&direction=asc`},
                "",
                `/catalog?query=${query}&type=${type}&order=${order}&direction=asc`);
        } else if (direction === "desc") {
            window.history.pushState({
                urlPath:`/catalog?query=${query}&type=${type}&order=${order}&direction=desc`},
                "",
                `/catalog?query=${query}&type=${type}&order=${order}&direction=desc`);
        }
    });
    
    render() {

        const options = [
            { key: 'asc', text: this.state.order === 'title' ? 'A-Z' : 'Newest', value: 'asc' },
            { key: 'desc', text: this.state.order === 'title' ? 'Z-A' : 'Oldest', value: 'desc' },
        ];

        return (
            <div style={{ display: 'inline-block', width: '100%', margin: 'auto' }}>
                <Grid textAlign='center' style={{ margin: '3em 1em' }} >
                    <Grid.Column>
                        <div style={{ display: 'flex' }}>
                        <Header as='h1' color='teal' textAlign='left' style={{ margin: '1em 0', flex: '1' }}>
                            Catalog
                        </Header>
                        <Select  
                            name='direction'
                            options={options} 
                            placeholder='Order By'
                            onChange={this.handleChange}
                            style ={{ float: 'right', marginTop: '4%', marginBottom: '4%' }} />
                        </div>
                        <List style={{ width: '80%', margin: '0 auto' }} celled>
                            {
                                this.state.catalog && this.state.catalog.map((data, index) => {
                                    const catalogItem = data;
                                    return <CatalogItemPreview 
                                                key={index} 
                                                title={catalogItem.title} 
                                                date={catalogItem.date}
                                                author={catalogItem.author}/>
                                })
                            }
                        </List>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Catalog;
