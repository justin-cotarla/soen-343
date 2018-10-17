import React from 'react'
import { Grid, List, Header, Button } from 'semantic-ui-react'
import CatalogItemPreview from "../components/CatalogItemPreview";
import CatalogForm from '../components/CatalogForm';

import { getCatalog } from "../util/ApiUtil";

class Catalog extends React.Component {
    state = { catalog: null };

    componentDidMount = async () => {
        try {
            const { data } = await getCatalog();
            console.log(data)
            this.setState({ catalog: data });
        } catch (err) {
            console.log(err)
        }
    }
    
    render() {
        return (
            <Grid textAlign='center' >
                <Grid.Column>
                    <Header as='h1' color='teal' textAlign='left' style={{ margin: '3em auto', marginBottom: '1em', width: '80%' }}>
                        Catalog
                    </Header>
                    <List style={{ width: '80%', margin: '0 auto' }} celled>
                        {
                            this.state.catalog && this.state.catalog.map((data, index) => {
                                const { spec } = data;
                                return <CatalogItemPreview key={index} title={spec.title} date={spec.date}/>
                            })
                        }
                    </List>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Catalog;
