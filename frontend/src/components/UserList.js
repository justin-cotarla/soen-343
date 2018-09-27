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
        axios.get(`http://localhost/api/accounts/getloggedinusers`, {
            headers: {"Access-Control-Allow-Origin": "*"},
            responseType:'json',
            crossorigin:true
        })
          .then(response => {
            this.setState({ users: response.data.rows });
          })
    }

    render() {
        const users = this.state.users;
        const userList = users.map((user) => 
            <User 
                firstName={user.FIRST_NAME} 
                lastName={user.LAST_NAME}
                email={user.EMAIL}
                address={user.ADDRESS}
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
