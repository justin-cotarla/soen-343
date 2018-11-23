import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import '../styles/User.css';

class User extends Component {
    render() {
        const {
            firstName,
            lastName,
            email,
            address,
            lastLogin,
        } = this.props;
        return (
            <Card>
                <Card.Content>
                    <Card.Header>{firstName + ' ' + lastName}</Card.Header>
                    <Card.Meta>{email}</Card.Meta>
                    <Card.Description>{address}</Card.Description>
                    <Card.Description>{`Last Login: ${lastLogin}`}</Card.Description>
                </Card.Content>
            </Card>
        );
    }
}

export default User;