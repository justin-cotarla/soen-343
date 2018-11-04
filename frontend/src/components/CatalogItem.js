import React, { Component } from 'react';
import { Card, Grid, Divider } from 'semantic-ui-react';

class CatalogItem extends Component {
    catalogItem = Object.keys(this.props.item).map((key) => {
        if (key !== 'title' && key !== 'id') {
            return (
                <Grid.Row key={`item-${this.props.item.id}-${key}`}>
                    <Grid.Column width={6}><strong>{key}</strong>:</Grid.Column>
                    <Grid.Column>{this.props.item[key]}</Grid.Column>
                </Grid.Row>
            );
        }

        return null;
    });

    render() {
        return (
            <Card>
                <Card.Content>
                    <Card.Header textAlign="center">{this.props.item.title}</Card.Header>
                    <Divider/>
                    <Grid columns="2">
                        {this.catalogItem}
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}

export default CatalogItem;
