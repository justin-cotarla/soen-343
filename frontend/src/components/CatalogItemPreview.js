import React from 'react'
import { Icon, List } from 'semantic-ui-react'

class CatalogItemPreview extends React.Component {
    
    render() {
        return (
                <List.Item>
                <Icon name="book"/>
                <List.Content>
                    <List.Header>Snickerdoodle</List.Header>
                    An excellent companion
                </List.Content>
                </List.Item>
        );
    }
}

export default CatalogItemPreview;