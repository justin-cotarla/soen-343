import React, { Component } from 'react';
import axios from 'axios';
import UserList from './UserList';

class ViewActiveUsers extends Component {
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
        return (
            <UserList users={this.state.users}/>
        );
    }
}

export default ViewActiveUsers;
