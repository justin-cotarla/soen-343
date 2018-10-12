import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';

class CatalogItem extends Component {
    catalogItem = Object.keys(this.props.item).map(key => {
        if (key !== 'title' && key !== 'id') {
            return (
                <Grid.Row>
                    <Grid.Column><strong>{key}</strong>:</Grid.Column>
                    <Grid.Column>{this.props.item[key]}</Grid.Column>
                </Grid.Row>
            );
        }
    });

    render() {
        return (
            <div className="catalog-spec">
                <Card>
                    <Card.Header textAlign="center">{this.props.item.title}</Card.Header>
                    <Card.Content>
                            <Grid columns="2">
                                {this.catalogItem}
                            </Grid>
                    </Card.Content>
                </Card>
            </div>
        );
    }
}

export default CatalogItem;