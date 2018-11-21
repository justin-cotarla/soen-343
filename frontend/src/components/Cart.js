import React, { Component } from 'react';
import {
    Icon,
    List,
    Button,
    Card,
    Placeholder,
    Header,
} from 'semantic-ui-react';
import { withToastManager } from 'react-toast-notifications';
import { connect } from 'react-redux';

import {
    cartCheckoutAsync,
    cartDeleteAsync,
    cartGetAsync,
    cartUpdateAsync,
} from '../redux/actionCreators';

class Cart extends Component {
    componentWillMount() {
        this.initializeCart();
    }

    onCheckoutClick = () => {
        const { cartCheckoutAsync, itemList } = this.props;

        cartCheckoutAsync(itemList);
    }

    onDeleteClick = async (deletedId) => {
        const { cartUpdateAsync, itemList } = this.props;
        const newItemList = itemList
            .filter(({ id }) => id !== deletedId);

        cartUpdateAsync(newItemList);
    }

    onCancelClick = async () => {
        const { cartDeleteAsync } = this.props;

        cartDeleteAsync();
    }

    render() {
        const { loading, itemList } = this.props;
        return (
            <Card style={{
                width: '100%',
                top: '5px',
                right: '4px',
            }}>
                <Card.Content>
                {
                    loading 
                    ?
                    <Placeholder>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                    </Placeholder>
                    :
                    this.generateList()
                }
                </Card.Content>
                { itemList.length &&
                    <Card.Content>
                        <Button
                            primary
                            content="Checkout"
                            floated="left"
                            onClick={this.onCheckoutClick}
                        />
                        <Button
                            negative
                            content="Clear"
                            floated="right"
                            onClick={this.onCancelClick}
                        />
                    </Card.Content>
                }
            </Card>
        );
    }

    generateList() {
        const { itemList } = this.props;

        if (!itemList.length) {
            return (
                <Header as='h3' icon textAlign="center" style={{ marginTop: '1em' }}>
                    <Icon name='list'/>
                    Empty Cart
                </Header>
            )
        } else {
            return (
                <List relaxed="very">
                    {
                    itemList.map(({id, title}, index) => (
                        <List.Item key={id}>
                            <List.Content>
                                <List.Header>
                                    { title }
                                    <Icon
                                        name="x"
                                        link
                                        onClick={() => this.onDeleteClick(id)}
                                        color="red"
                                        style={{ float: "right" }}
                                    />
                                </List.Header>
                            </List.Content>
                        </List.Item>
                    ))
                    }
                </List>
            );
        }
    }

    async initializeCart() {
        const { cartGetAsync } = this.props;
        cartGetAsync();
    }
}

//[{"id": 1, "title": "Edge of Tomorrow"}, {"id": 2, "title": "Brave New World"}]

const mapStateToProps = ({ cart }) => {
    const { itemList, loading } = cart;
    return {
        itemList,
        loading,
    };
  };

export default connect(mapStateToProps, {
    cartCheckoutAsync,
    cartDeleteAsync,
    cartGetAsync,
    cartUpdateAsync,
})(withToastManager(Cart));
