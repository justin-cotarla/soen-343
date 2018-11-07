import React, { Component } from 'react';
import { 
    Card, 
    Grid,
    Divider,
    Button,
    Input,
    Dropdown, 
    Message,
    Icon,
    Modal,
    Placeholder,
    Header
} from 'semantic-ui-react';
import { 
    getCatalogItem,
    editCatalogItem,
    deleteCatalogItem,
    addInventoryItem,
    deleteInventoryItem
} from '../util/ApiUtil';
import { isAdmin } from '../util/AuthUtil';

class CatalogItem extends Component {
    constructor(props){
        super(props);
        this.state = { 
            modalOpen: false,
            originalItem: null,
            item: null,
            inventory: null,
            loading: true,
            editing: false,
            wasEdited: false,
            updating: false,
            updatingInventory: false,
            editSuccess: false,
            inventorySucess: false,
            fetchError: false,
            fetchErrorMsg: '',
            updateError: false,
            deleteError: false,
            inventoryError: false,
        };
    }

    async componentDidMount() {
        const { match: { params: { id, type } } } = this.props;
        try {
            const { data: { catalogItem, inventory } } = await getCatalogItem(type, id);
            this.setState({
                originalItem: { 
                    ...catalogItem, 
                    date: new Date(catalogItem.date).toLocaleDateString() 
                },
                item: { 
                    ...catalogItem, 
                    date: new Date(catalogItem.date).toLocaleDateString() 
                },
                inventory: {
                    items: inventory,
                    available: inventory.filter((item) => item.available === 1).length,
                    total: inventory.length,
                },
                loading: false,
            });
        } catch (error) {
            if (error.response.status === 404) {
                this.setState({
                    loading: false,
                    fetchError: true,
                    fetchErrorMsg: 'The requested item does not exist!'
                });
            } else {
                this.setState({ 
                    loading: false,
                    fetchError: true,
                    fetchErrorMsg: 'There was an error fetching the item\'s information! Please try again.'
                });
            }
        }
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

    wasEdited = () => {;
        const { item, originalItem } = this.state;
        let wasEdited = false;
        for (let key in item) {
            if (originalItem[key] !== item[key]) {
                wasEdited = true;
                break;
            }
        }

        return wasEdited;
    }

    handleSave = () => {
        this.setState({ updating: true }, async () => {
            const { item } = this.state;
            const { match: { params: { id, type } } } = this.props;
            try {
                await editCatalogItem(type, id, item);
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

    handleAddInventoryItem = () => {
        this.handleInventoryAction('add');
    }

    handleDeleteInventoryItem = () => {
        this.handleInventoryAction('delete');
    }

    handleInventoryAction = (action) => {
        this.setState({ updating: true }, async () => {
            try {
                const { match: { params: { id, type } } } = this.props;

                switch (action) {
                case 'add': 
                    await addInventoryItem(type, id);    
                    break;
                case 'delete':
                    await deleteInventoryItem(type, id);
                    break;
                default:
                }

                const { data: { inventory } } = await getCatalogItem(type, id);
                this.setState({
                    updating: false,
                    inventorySucess: true,
                    inventory: {
                        items: inventory,
                        available: inventory.filter((item) => item.available === 1).length,
                        total: inventory.length,
                    },
                })
            } catch (error) {
                this.setState({
                    updating: false,
                    inventoryError: true,
                })
            }
        });
    }

    handleMessageDismiss = () => {
        this.setState({ inventorySucess: false });
    }

    render() {
        const {
            item,
            inventory,
            loading,
            editing, 
            wasEdited,
            updating,
            updatingInventory,
            editSuccess,
            inventorySucess,
            modalOpen,
            updateError,
            deleteError,
            fetchError,
            fetchErrorMsg,
            inventoryError,
        } = this.state;

        if (loading) {
            return  (
                <Card fluid>
                    <Card.Content>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line length="medium"/>
                            </Placeholder.Header>
                        </Placeholder>
                        <Icon 
                            name="ellipsis horizontal" 
                            size="large"
                            style={{ position: 'absolute', right: '10px', top: '8px' }}/>
                        <Divider/>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line length="full"/>
                                <Placeholder.Line length="full"/>
                                <Placeholder.Line length="full"/>
                                <Placeholder.Line length="full"/>
                                <Placeholder.Line length="full"/>
                                <Placeholder.Line length="full"/>
                                <Placeholder.Line length="full"/>
                            </Placeholder.Header>
                        </Placeholder>
                        <Divider/>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line length="long"/>
                            </Placeholder.Header>
                        </Placeholder>
                        {
                            isAdmin() && 
                                <Button.Group fluid size="small" floated="right" style={{ marginTop: '1rem' }}>
                                    <Button 
                                        icon 
                                        labelPosition="left"
                                        color="teal"
                                        disabled={true}>
                                        <Icon name="plus"/>
                                        Add
                                    </Button>
                                    <Button 
                                        icon 
                                        labelPosition="left"
                                        disabled={true}>
                                        <Icon name="minus"/>
                                        Remove
                                    </Button>
                                </Button.Group>
                        }
                    </Card.Content>
                </Card>
            )
        }

        if (fetchError) {
            return <Header style={{ marginTop: '1em' }}>{fetchErrorMsg}</Header>
        }

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
                            editing && editSuccess &&
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
                                { inventory.available } Available { isAdmin() && `(out of ${inventory.total})` }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Grid columns="1">
                            <Grid.Row style={{ paddingTop: 0 }}>
                                <Grid.Column width={16}>
                                {
                                    inventorySucess &&
                                    <Message 
                                        success
                                        header="Inventory update successful" 
                                        content={`'${title}'s inventory was successfully updated.`}
                                        style={{ textAlign: 'left' }}
                                        onDismiss={this.handleMessageDismiss} />
                                }
                                {
                                    inventoryError &&
                                    <Message 
                                        error={inventoryError}
                                        header="Inventory update failed" 
                                        content="There was an error updating the item's inventory. Please try again later."
                                        style={{ textAlign: 'left' }} />
                                }
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ paddingTop: 0 }}>
                            {
                                isAdmin() && 
                                <Grid.Column width={16}>
                                    <Button.Group fluid size="small" floated="right">
                                        <Button 
                                            icon 
                                            labelPosition="left"
                                            color="teal"
                                            disabled={updatingInventory}
                                            onClick={this.handleAddInventoryItem}>
                                            <Icon name="plus"/>
                                            Add
                                        </Button>
                                        <Button 
                                            icon 
                                            labelPosition="left"
                                            disabled={inventory.total === 0 || inventory.available === 0 || updatingInventory}
                                            onClick={this.handleDeleteInventoryItem}>
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
