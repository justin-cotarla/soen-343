import React from 'react'
import { Grid, List, Header } from 'semantic-ui-react'
import CatalogItemPreview from "../components/CatalogItemPreview";

import { getCatalog } from "../util/ApiUtil";

class Catalog extends React.Component {
    state = { catalog: null };

    componentDidMount = async () => {
        try {
            const { data } = await getCatalog();
            this.setState({ catalog: data });
        } catch (err) {
            console.log(err)
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
