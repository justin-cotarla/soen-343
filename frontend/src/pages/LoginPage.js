import React from 'react'
import LoginForm from '../components/LoginForm'
import { isAuthenticated } from "../util/AuthUtil"
import { Redirect } from 'react-router-dom'

export default class LoginPage extends React.Component {
    state = { authenticated: isAuthenticated() }
    render() {
        const { authenticated } = this.state
        if (authenticated === true){
            return <Redirect to="/" />
        }

        return(
            <LoginForm />
        );
    }
};
