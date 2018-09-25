import React, { Component } from 'react';
import User from './User';
import '../styles/UserList.css';

class UserList extends Component {
    render() {
        const userList = this.props.users.map((user) => 
            <li>
                <User 
                    firstName={user.firstName} 
                    lastName={user.lastName}
                    email={user.email}
                    address={user.address}
                />
            </li>
        );
        return (
            <ul className="userlist-list">
                {userList}
            </ul>
        );
    }
}

export default UserList;