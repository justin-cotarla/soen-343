import React, { Component } from 'react';
import User from './User';
import '../styles/UserList.css';
import { Card } from 'semantic-ui-react';

class UserList extends Component {
    render() {
        const userList = this.props.users.map((user) => 
            <User 
                key={user.email}
                firstName={user.firstName} 
                lastName={user.lastName}
                email={user.email}
                address={user.address}
                lastLogin={user.lastLogin}
            />
        );
        return (
            <Card.Group className="userlist-list">
                {userList}
            </Card.Group>
        );
    }
}

export default UserList;
