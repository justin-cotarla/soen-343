import React, { Component } from 'react';
import User from './User';
import '../styles/UserList.css';
import { Card } from 'semantic-ui-react';

class UserList extends Component {
    render() {
        const users = [{'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'},
        {'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'},
        {'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'},
        {'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'}]

        const userList = users.map((user) => 
            <User 
                firstName={user.firstName} 
                lastName={user.lastName}
                email={user.email}
                address={user.address}
            />
        );
        return (
            <Card.Group className="userlist-list centered">
                {userList}
            </Card.Group>
        );
    }
}

export default UserList;
