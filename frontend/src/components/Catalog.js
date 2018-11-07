import React from 'react'
import { Route } from 'react-router-dom';
import { Grid, List, Header } from 'semantic-ui-react'

import CatalogItem from '../components/CatalogItem';
import CatalogItemPreview from "../components/CatalogItemPreview";

import { getCatalog } from "../util/ApiUtil";

class Catalog extends React.Component {
    state = { catalog: null };

    componentDidMount = async () => {
        try {
            const { data } = await getCatalog();
            this.setState({ catalog: data });
        } catch (error) {

        }
    }

    handlePostDelete = (id) => {
        this.setState(({ catalog }) => ({
            catalog: catalog.filter(item => item.id !== id)
        }), () => {
            this.props.history.push('/catalog');
        });
    }

    renderCatalogItem = (props) => {
        return <CatalogItem {...props} handlePostDelete={this.handlePostDelete}/>;
    }
    
    render() {
        const { match, location } = this.props;
        const { catalog } = this.state;
        return (
            <div style={{ 
                display: 'inline-block',
                width: '100%',
                marginTop: '4em',
                padding: '0 1em' }}>
                <Header as='h1' color='teal' textAlign='left' style={{ margin: '1em 0' }}>
                    Catalog
                </Header>
                <Grid textAlign='center' stackable>
                    <Grid.Column width={location.pathname.match(/^\/catalog\/?$/) ? 16 : 10} floated="left">
                        <List style={{ margin: '0 auto' }} celled>
                            {
                                catalog && catalog.map((catalogItem) => {
                                    return  <CatalogItemPreview key={catalogItem.id} item={catalogItem}/>
                                })
                            }
                        </List>
                    </Grid.Column>
                    <Grid.Column width={location.pathname.match(/^\/catalog\/(book|magazine|movie|music)\/\d+$/) ? 6 : null}>
                            <Route 
                                path={`${match.path}/:type(book|magazine|movie|music)/:id(\\d+)`} 
                                render={this.renderCatalogItem}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Catalog;
