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
            catalogItemType,
        } = item;

        let icon;
        switch (catalogItemType) {
        case 'book':
            icon = 'book';
            break;
        case 'magazine':
            icon = 'newspaper';
            break;
        case 'movie':
            icon = 'video play'
            break;
        case 'music':
            icon = 'music'
            break;
            default:
        }
        return (
            <List.Item
                as={Link} 
                to={`/catalog/${catalogItemType}/${id}`} 
                style={{ padding: '1em 0', color: 'inherit' }}>
                <Icon size="big" name={icon}/>
                <List.Content>
                    <List.Header>{title}</List.Header>
                    {new Date(date).toLocaleDateString()}
                </List.Content>
            </List.Item>
        );
    }
}

export default CatalogItemPreview;
