import React from 'react'
import { Grid, List } from 'semantic-ui-react'
import { Route, Redirect } from 'react-router-dom';


import CatalogTypeFilter from '../components/CatalogTypeFilter';
import CatalogItem from '../components/CatalogItem';
import CatalogItemPreview from '../components/CatalogItemPreview';
import SearchBar from '../components/SearchBar';

import { getCatalog } from '../util/ApiUtil';

import '../styles/Catalog.css';

class CatalogPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            catalog: null,
            type: '',
            query: '',
            order: '',
            direction: '',
        };
    }

    onSubmit = async (query, type, order) => {
        const { direction } = this.state;
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

    handleTypeFilterClick = async (e, { value }) => {
        const { query, order, direction } = this.state;
        try {
            const { data } = await getCatalog(value, query, order, direction);
            this.setState({ 
                catalog: data,
                type: value,
            });
        } catch (error) {

        }
    }

    handleDropdownChange = async (e, { value }) => {
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

        try {
            const { data } = await getCatalog(type, query, order, direction);
            this.setState({ 
                catalog: data,
                order,
                direction,
            });
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
        const { catalog, type, form } = this.state;
        return (
            <div style={{
                display: 'inline-block',
                width: '100%',
                padding: '2em 2em' }}>
                <SearchBar onSubmit={this.onSubmit}/>
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

export default CatalogPage;
