import React from 'react'
import { Icon, List } from 'semantic-ui-react'

class CatalogItemPreview extends React.Component {
    
    render() {
        return (
            <List.Item style={{ padding: '1em 0' }}>
                <Icon size="big" name="book"/>
                <List.Content>
                    <List.Header>{this.props.title}</List.Header>
                    {this.props.date}
                </List.Content>
            </List.Item>
        );
    }
}

export default CatalogItemPreview;