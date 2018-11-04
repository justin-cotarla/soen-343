import React from 'react'
import { Link } from 'react-router-dom';
import { Icon, List } from 'semantic-ui-react'

class CatalogItemPreview extends React.Component {
    render() {
        const { item } = this.props;
        const {
            id,
            title,
            date,
        } = item;
        return (
            <List.Item
                as={Link} 
                to={{
                    pathname: `/catalog/${id}`,
                    state: { item },
                }}   
                style={{ padding: '1em 0', color: 'inherit' }}>
                <Icon size="big" name="book"/>
                <List.Content>
                    <List.Header>{title}</List.Header>
                    {date}
                </List.Content>
            </List.Item>
        );
    }
}

export default CatalogItemPreview;