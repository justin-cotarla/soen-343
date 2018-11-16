import React, { Component } from 'react';
import { 
    Card, 
    Grid,
    Divider,
    Button,
    Input,
    Dropdown, 
    Icon,
    Modal,
    Placeholder,
    Header
} from 'semantic-ui-react';
import { withToastManager } from 'react-toast-notifications';
import { 
    getCatalogItem,
    editCatalogItem,
    deleteCatalogItem,
    addInventoryItem,
    deleteInventoryItem
} from '../util/ApiUtil';
import { isAdmin, isAuthenticated } from '../util/AuthUtil';

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
            fetchError: false,
            fetchErrorMsg: '',
        };
    }

    async componentDidMount() {
        const { match: { params: { id, type } } } = this.props;
        await this.getCatalogItem(type, id);
    }

    componentDidUpdate = async (prevProps) => {
        const { match: { params: { id, type } } } = this.props;
        if (id !== prevProps.match.params.id) {
            this.getCatalogItem(type, id);
        }
    }

    getCatalogItem = async (type, id) => {
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
        this.setState(({ editing }) => ({ editing: !editing }));
    }

    handleItemEdit = (e, {name, value }) => {
        const { item } = this.state;
        item[name] = value;
        this.setState({ item }, () => {
            this.setState({ wasEdited: this.wasEdited() });
        });
    }

    wasEdited = () => {
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
            const { match: { params: { id, type } }, toastManager } = this.props;
            try {
                await editCatalogItem(type, id, item);
                this.setState({ 
                    updating: false,
                    editing: false,
                    wasEdited: false,
                }, () => {
                    toastManager.add(`'${item.title}' was successfully updated with the new information.`, { 
                        appearance: 'success',
                        autoDismiss: true,
                    });
                });
            } catch (error) {
                this.setState({ updating: false }, () => {
                    toastManager.add(`There was an error updating the information for '${item.title}'. Please try again later.`, { 
                        appearance: 'error',
                        autoDismiss: true,
                    });
                });
            }
        })
    }

    handleModalOpen = () => this.setState({ modalOpen: true });
    handleCancelDelete = () => this.setState({ modalOpen: false });
    handleDeleteConfirmation = () => this.handleDelete();
    
    handleDelete = () => {
        this.setState({ updating: true }, async () => {
            const { item: { id, title } } = this.state;
            const { match: { params: { type } }, toastManager } = this.props;
            try {
                await deleteCatalogItem(type, id);
                this.props.handlePostDelete(id);
                toastManager.add(`'${title}' was successfully deleted from the catalog.`, { 
                    appearance: 'success',
                    autoDismiss: true,
                });
            } catch (error) {
                this.setState({ 
                    updating: false,
                    modalOpen: false,
                }, () => {
                    toastManager.add('There was an error deleting the catalog item. Please try again later.', { 
                        appearance: 'error',
                        autoDismiss: true,
                    });
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
            const { item: { title } } = this.state;
            const { match: { params: { id, type } }, toastManager } = this.props;
            try {
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
                    inventory: {
                        items: inventory,
                        available: inventory.filter((item) => item.available === 1).length,
                        total: inventory.length,
                    },
                }, () => {
                    toastManager.add(`'${title}'s inventory was successfully updated.`, { 
                        appearance: 'success',
                        autoDismiss: true,
                    });
                });
            } catch (error) {
                this.setState({ updating: false }, () => {
                    toastManager.add(`There was an error updating the inventory for '${title}'. Please try again later.`, { 
                        appearance: 'error',
                        autoDismiss: true, 
                    });
                });
            }
        });
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
            modalOpen,
            fetchError,
            fetchErrorMsg,
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
                        <Grid.Column width={16} style={{ marginTop: '1em'}}>
                        {
                            isAuthenticated() && (
                                isAdmin() ? (                                           
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
                                            disabled={true}
                                            onClick={this.handleDeleteInventoryItem}>
                                            <Icon name="minus"/>
                                            Remove
                                        </Button>
                                    </Button.Group>
                                ) : (                                      
                                    <Button
                                        fluid
                                        icon
                                        labelPosition="left"
                                        color="teal"
                                        disabled={true}>
                                        <Icon name="cart"/>
                                        Add to cart
                                    </Button>      
                                )
                            )
                        }
                        </Grid.Column>
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
                                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                            </Grid.Column>
                                            <Grid.Column width={10}>
                                                {
                                                    editing ? 
                                                    <Input 
                                                        style={{ backgroundColor: '#f4f4f4', borderRadius: '3px' }}
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
                            editing && 
                            <Button 
                                fluid 
                                color="teal"
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
                                    isAuthenticated() && (
                                        isAdmin() ? (                                           
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
                                        ) : ( 
                                            (inventory.total !== 0 || inventory.available !== 0) &&                                       
                                            <Button
                                                fluid
                                                icon
                                                labelPosition="left"
                                                color="teal"
                                                disabled={inventory.total === 0 || inventory.available === 0 }>
                                                <Icon name="cart"/>
                                                Add to cart
                                            </Button>      
                                        )
                                    )
                                }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>         
                    </Card.Content>
                </Card>
            </React.Fragment>
        );
    }
}

export default withToastManager(CatalogItem);

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
