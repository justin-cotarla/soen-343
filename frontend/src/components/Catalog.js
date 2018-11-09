import React from 'react'
import { Grid, List, Header } from 'semantic-ui-react'
import CatalogItemPreview from "../components/CatalogItemPreview";
import queryString from 'query-string';

import { getCatalog } from "../util/ApiUtil";

class Catalog extends React.Component {
    state = { catalog: null };

    componentDidMount = async () => {
        try {
            console.log(this.props);
            const { type, query, order, direction }= queryString.parse(this.props.location.search);
            const { data } = await getCatalog(type, query, order, direction);
            this.setState({ catalog: data });
        } catch (error) {

        }
    }
    
    render() {
        return (
            <div style={{ display: 'inline-block', width: '100%', margin: 'auto' }}>
                <Grid textAlign='center' style={{ margin: '3em 1em' }} >
                    <Grid.Column>
                        <Header as='h1' color='teal' textAlign='left' style={{ margin: '1em 0' }}>
                            Catalog
                        </Header>
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
