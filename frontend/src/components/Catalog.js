import React from 'react'
import { List } from 'semantic-ui-react'

class Catalog extends React.Component {
    
    render() {
        return (
            <List>
                    {
                        this.props.catalog.map((item) => {
                            return <CatalogItemPreview title={item.title} date={item.date}/>
                        })
                    }
            </List>
        );
    }
}

export default Catalog;