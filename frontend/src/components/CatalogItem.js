import React, { Component } from 'react';
import { Card, Grid, Divider, Button, Input, Dropdown } from 'semantic-ui-react';

import { isAdmin } from '../util/AuthUtil';

class CatalogItem extends Component {
    constructor(props){
        super(props);
        this.state = { 
            item: { ...props.item },
            editing: false,
            wasEdited: false,
            updating: false,
        };
    }

    handleEditClick = () => {
        this.setState(({ editing }) => ({
            editing: !editing,
        }));
    }

    handleItemEdit = (e, {name, value }) => {
        const { item } = this.state;
        item[name] = value;
        this.setState({ item }, () => {
            this.setState({ wasEdited: this.wasEdited() });
        });
    }

    handleSave = () => {
        this.setState({ updating: true }, async () => {
            try {
                // TODO: API call to update catalog item
            } catch (error) {

            }
        })
    }
    
    handleDelete = () => {
        this.setState({ updating: true }, async () => {
            try {
                // TODO: API call to delete catalog item
            } catch (error) {

            }
        })
    }


    wasEdited = () => {
        const originalItem = this.props.item;
        const { item } = this.state;
        let wasEdited = false;
        for (let key in item) {
            if (originalItem[key] !== item[key]) {
                wasEdited = true;
                break;
            }
        }

        return wasEdited;
    }

    render() {
        const {
            item,
            editing, 
            wasEdited,
            updating,
        } = this.state;
        const { id, title } = item;
        return (
            <Card fluid>
                <Card.Content textAlign="left">
                    <Card.Header textAlign="left" style={{ position: 'relative' }}>
                        {title}
                        {
                            isAdmin() && 
                            <Dropdown
                                direction="left"
                                icon="ellipsis horizontal"
                                style={{ 
                                    position: 'absolute', 
                                    right: 0,
                                    cursor: 'pointer',
                                    color: editing ? 'teal' : '',
                                }}>
                                <Dropdown.Menu>
                                    <Dropdown.Item 
                                        title="Edit Item" 
                                        icon="edit" 
                                        text="Edit"
                                        onClick={this.handleEditClick}/>
                                    <Dropdown.Item 
                                        title="Delete"
                                        icon="delete"
                                        text="Delete"/>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                    </Card.Header>
                    <Divider/>
                    <Grid columns="2">
                    {
                            Object
                            .keys(item)
                            .filter(key => key !== 'title' && key !== 'id')
                            .map((key) => {
                                return (
                                    <Grid.Row key={`item-${id}-${key}`}>
                                        <Grid.Column width={4}>
                                            <strong>{key}:</strong>
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            {
                                                editing ? 
                                                <Input 
                                                    transparent
                                                    fluid
                                                    name={key} 
                                                    value={item[key]} 
                                                    onChange={this.handleItemEdit}/>
                                                : item[key]
                                            }

                                        </Grid.Column>
                                    </Grid.Row>
                                );  
                            })
                    }
                    </Grid>
                    {
                        editing && 
                        <Button 
                            fluid 
                            color="teal"
                            style={{ marginTop: '1em' }}
                            disabled={!wasEdited || updating}>
                            Save
                        </Button>
                    }
                </Card.Content>
            </Card>
        );
    }
}

export default CatalogItem;
