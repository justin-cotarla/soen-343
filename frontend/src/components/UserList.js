import React, { Component } from 'react';
import axios from 'axios';
import User from './User';
import '../styles/UserList.css';
import { Card } from 'semantic-ui-react';

class UserList extends Component {
    constructor() {
        super();
        this.state = { 
            users: [] 
        };
      }

    componentDidMount() {
        axios.get(`http://localhost/api/accounts/users?active=true`, {
            headers: {"Access-Control-Allow-Origin": "*"},
            responseType:'json',
            crossorigin:true
        })
          .then(response => {
            this.setState({ users: response.data });
          })
    }

    render() {
        const users = this.state.users;
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
