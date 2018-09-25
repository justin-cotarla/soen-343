import React, { Component } from 'react';
import '../styles/User.css';

class User extends Component {
    render() {
        return (
            <table className="user-table">
                <tr>
                    <td>{this.props.firstName + ' ' + this.props.lastName}</td>
                    <td>{this.props.email}</td>
                    <td>{this.props.address}</td>
                </tr>
            </table>
        );
    }
}

export default User;