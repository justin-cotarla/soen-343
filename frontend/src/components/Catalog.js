import React from 'react'
import { List } from 'semantic-ui-react'
import CatalogItemPreview from "../components/CatalogItemPreview";

class Catalog extends React.Component {
    
    render() {
        return (
            <List>
                    {
                        this.props.catalog.map((item, index) => {
                            return <CatalogItemPreview key={index} title={item.title} date={item.date}/>
                        })
                    }
            </List>
        );
    }
}

export default Catalog;