import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import '../styles/User.css';

class User extends Component {
    render() {
        return (
            <Card>
                <Card.Content>
                    <Card.Header>{this.props.firstName + ' ' + this.props.lastName}</Card.Header>
                    <Card.Meta>{this.props.email}</Card.Meta>
                    <Card.Description>{this.props.address}</Card.Description>
                </Card.Content>
            </Card>
        );
    }
}

export default User;