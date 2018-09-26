import React, { Component } from 'react';
import UserList from './UserList';
import '../styles/ViewUsers.css';

class ViewUsers extends Component {
    render() {
        const userList = [{'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'},
        {'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'},
        {'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'},
        {'lastName':'Bys', 'firstName':'Zach', 'address':'4 Coronation', 'email':'zbys@gmail.com'}]
        
        return (
            <div className="view-users-container">
                <h1 className="view-users-title">Logged in Users</h1>
                <div className="view-users-list-container">
                    <UserList users={userList}/>
                </div>
            </div>
        );
    }
}

export default ViewUsers;