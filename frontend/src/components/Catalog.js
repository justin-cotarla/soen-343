import React from 'react'
import { Grid, List } from 'semantic-ui-react'
import { Route } from 'react-router-dom';

import CatalogTypeFilter from '../components/CatalogTypeFilter';
import CatalogItem from '../components/CatalogItem';
import CatalogItemPreview from "../components/CatalogItemPreview";

import { getCatalog } from "../util/ApiUtil";

import '../styles/Catalog.css';

class Catalog extends React.Component {
    state = { 
        catalog: null,
        type: '',
        query: '',
        order: '',
        direction: '',
    };

    componentDidMount = async () => {
        const { location: { state } } = this.props;
        let { type, query, order, direction } = this.state;
        if (state) {
            query = state.query;
            type = state.type;
            order = state.order;
        }

        try {
            const { data } = await getCatalog(type, query, order, direction);
            this.setState({ 
                catalog: data,
                type,
                query,
                order,
            });
        } catch (error) {

        }
    }

    handleTypeFilterClick = (e, { value }) => this.setState({ type: value }, async () => {
        const { type, query, order, direction } = this.state;
        const { data } = await getCatalog(type, query, order, direction);
        this.setState({ catalog: data });
    });

    handleDropdownChange = async (e, { name, value }) => {
        const { type, query } = this.state;
        let order, direction;
        switch (value) {
            case 'Oldest': 
                order = 'date';
                direction = 'asc';
                break;
            case 'Newest':
                order = 'date';
                direction = 'desc';
                break;
            case 'A-Z':
                order = 'title';
                direction = 'asc';
                break;
            case 'Z-A':
                order = 'title';
                direction = 'desc';
                break;
            default:
        }
        
        const { data } = await getCatalog(type, query, order, direction);
        this.setState({ 
            catalog: data,
            order,
            direction,
        });
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
        const { catalog, type } = this.state;
        return (
            <div style={{
                display: 'inline-block',
                width: '100%',
                marginTop: '4em',
                padding: '1em 2em' }}>
                <CatalogTypeFilter 
                    selectedTypeFilter={type} 
                    handleTypeFilterClick={this.handleTypeFilterClick}
                    handleDropdownChange={this.handleDropdownChange}/>
                <Grid textAlign='center' stackable>
                    <Grid.Column width={location.pathname.match(/^\/catalog(\/(book|magazine|movie|music))?\/?$/) ? 16 : 10} floated="left">
                        <List 
                            className="catalog-list"
                            style={{ margin: '0 auto', overflowY: 'auto' }} 
                            celled>
                            {
                                catalog && catalog.map((catalogItem) => {
                                    return  <CatalogItemPreview key={catalogItem.id} item={catalogItem}/>
                                })
                            }
                        </List>
                    </Grid.Column>
                    <Grid.Column width={location.pathname.match(/^\/catalog\/(book|magazine|movie|music)\/\d+/) ? 6 : null}>
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
