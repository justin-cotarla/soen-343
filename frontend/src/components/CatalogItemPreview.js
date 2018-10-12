import React from 'react'
import { Image, List } from 'semantic-ui-react'

class CatalogItemPreview extends React.Component {
    
    render() {
        return (
            <List celled>
                <List.Item>
                <Image file alternate outline/>
                <List.Content>
                    <List.Header>Snickerdoodle</List.Header>
                    An excellent companion
                </List.Content>
                </List.Item>
            </List>
        );
    }
}

export default CataCatalogItemPreviewlog;