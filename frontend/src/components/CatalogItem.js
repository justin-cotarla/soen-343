import React, { Component } from 'react';
import { Card, Grid, Divider, Button, Input, Dropdown, Message, Icon, Modal } from 'semantic-ui-react';

import { isAdmin } from '../util/AuthUtil';
import { editCatalogItem, deleteCatalogItem } from '../util/ApiUtil';

class CatalogItem extends Component {
    constructor(props){
        super(props);
        this.state = { 
            item: { 
                ...props.item,
                date: new Date(props.item.date).toLocaleDateString(), 
            },
            editing: false,
            wasEdited: false,
            updating: false,
            success: false,
            updateError: false,
            modalOpen: false,
            deleteError: false,
        };
    }

    handleEditClick = () => {
        this.setState(({ editing }) => ({
            editing: !editing,
            updateError: false,
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
            const { item } = this.state;
            const { catalogItemType, id } = item;
            try {
                throw Error();
                await editCatalogItem(catalogItemType, id, item);
                this.setState({ 
                    updating: false,
                    wasEdited: false,
                    success: true,
                })
            } catch (error) {
                this.setState({
                    updating: false, 
                    updateError: true 
                });
            }
        })
    }

    handleModalOpen = () => this.setState({ modalOpen: true });
    handleCancelDelete = () => this.setState({ modalOpen: false, deleteError: false });
    handleDeleteConfirmation = () => this.handleDelete();
    
    handleDelete = () => {
        this.setState({ updating: true }, async () => {
            const { item } = this.state;
            const { catalogItemType, id } = item;
            try {
                await deleteCatalogItem(catalogItemType, id);
                this.props.handlePostDelete(this.state.item.id);
            } catch (error) {
                this.setState({
                    updating: false, 
                    deleteError: true 
                });
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
            success,
            modalOpen,
            updateError,
            deleteError,
        } = this.state;
        const { id, title } = item;
        return (
            <React.Fragment>
                <DeleteModal 
                    itemName={title}
                    open={modalOpen} 
                    deleting={updating}
                    error={deleteError}
                    handleCancelDelete={this.handleCancelDelete} 
                    handleDeleteConfirmation={this.handleDeleteConfirmation}/>
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
                                            text="Delete"
                                            onClick={this.handleModalOpen}/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                        </Card.Header>
                        <Divider/>
                        <Grid columns="2" style={{ marginBottom: '1.5rem' }}>
                            <Grid.Column width={16} style={{ paddingBottom: '0.5rem' }}>
                                <Grid.Row>
                                    <strong>Details:</strong>
                                </Grid.Row>
                            </Grid.Column>
                            {
                                Object
                                .keys(item)
                                .filter(key => key !== 'title' && key !== 'id' && key !== 'catalogItemType')
                                .map((key) => {
                                    return (
                                        <Grid.Row key={`item-${id}-${key}`} style={{ padding: '0.5rem 0'}}>
                                            <Grid.Column width={6}>
                                                <strong>{key}:</strong>
                                            </Grid.Column>
                                            <Grid.Column width={10}>
                                                {
                                                    editing ? 
                                                    <Input 
                                                        transparent
                                                        fluid
                                                        name={key} 
                                                        value={item[key] === 'null' ? 'N/A' : item[key]} 
                                                        onChange={this.handleItemEdit}/>
                                                    : (item[key] === 'null' ? 'N/A' : item[key])
                                                }
                                            </Grid.Column>
                                        </Grid.Row>
                                    );  
                                })
                            }
                        </Grid>
                        {
                            editing && success &&
                            <Message
                                success
                                header="Edit successful!"
                                content={`'${title}' was successfully updated with the new information.`}/>
                        }
                        {
                            editing && updateError &&
                            <Message 
                                error={updateError}
                                header="Edit failed" 
                                content="There was an error updating the catalog item. Please try again later."
                                style={{ textAlign: 'left' }} />
                        }
                        {
                            editing && 
                            <Button 
                                fluid 
                                color="teal"
                                style={{ marginTop: '1em' }}
                                loading={updating}
                                disabled={!wasEdited || updating}
                                onClick={this.handleSave}>
                                Save
                            </Button>
                        }
                        <Divider/>
                        <Grid columns="2">
                            <Grid.Row>
                                <Grid.Column width={6} style={{ padding: '0.5rem 0 !important'}}>
                                    <strong>Inventory:</strong>
                                </Grid.Column>
                                <Grid.Column width={10} style={{ padding: '0.5rem 0 !important'}}>
                                    # Available { isAdmin() && '(out of #)' }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Grid columns="1">
                            <Grid.Row style={{ paddingTop: 0 }}>
                                {
                                    isAdmin() && 
                                    <Grid.Column width={16}>
                                        <Button.Group fluid size="small" floated="right">
                                            <Button 
                                                icon 
                                                labelPosition="left"
                                                color="teal">
                                                <Icon name="plus"/>
                                                Add
                                            </Button>
                                            <Button icon labelPosition="left">
                                                <Icon name="minus"/>
                                                Remove
                                            </Button>
                                        </Button.Group>
                                    </Grid.Column> 
                                }
                            </Grid.Row>
                        </Grid>         
                    </Card.Content>
                </Card>
            </React.Fragment>
        );
    }
}

export default CatalogItem;

const DeleteModal = (props) => {
    return (
        <Modal
            open={props.open}
            dimmer="blurring"
            closeOnEscape
            closeOnDimmerClick
            onClose={props.handleCancelDelete}>
            <Modal.Header>Delete Catalog Item</Modal.Header>
            <Modal.Content>
                <p>
                    Are you sure you want to delete <strong>{props.itemName}</strong> from the catalog?
                </p>
                {
                    props.error && 
                    <Message 
                        error={props.error}
                        header="Delete failed" 
                        content="There was an error deleting the catalog item. Please try again later."
                        style={{ textAlign: 'left' }} />
                }
            </Modal.Content>
            <Modal.Actions>
                <Button 
                    content="Cancel"
                    onClick={props.handleCancelDelete}/>
                <Button
                    color="teal"
                    labelPosition="right"
                    icon="checkmark"
                    content="Yes, I'm sure"
                    loading={props.deleting}
                    disabled={props.deleting}
                    onClick={props.handleDeleteConfirmation}/>
            </Modal.Actions>
        </Modal>
    )
}
