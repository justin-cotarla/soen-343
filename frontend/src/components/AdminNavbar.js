import React from 'react';
import { Icon, Menu, Container } from "semantic-ui-react"

class AdminNavbar extends React.Component {
    render() {
        return (
            <Container>
                <Menu vertical={this.props.vertical} fixed="top" fluid inverted>
                    <Menu.Item 
                        name="overview" 
                        active={this.props.active === 'overview'} 
                        onClick={this.props.handleItemClick} 
                        style={{ padding: "0 1em", height: "50px"}}>
                            <Icon name="home" />
                        Overview
                    </Menu.Item>
                    <Menu.Item 
                        name="register" 
                        active={this.props.active === 'register'} 
                        onClick={this.props.handleItemClick}
                        style={{ padding: "0 1em", height: "50px"}}>
                            <Icon name="user plus"/>
                        Register a client
                    </Menu.Item>
                    <Menu.Item 
                        name="users" 
                        active={this.props.active === 'users'} 
                        onClick={this.props.handleItemClick}
                        style={{ padding: "0 1em", height: "50px"}}>
                            <Icon name="users" />
                        Active clients
                    </Menu.Item>
                </Menu>    
            </Container>
        )
    }
}

export default AdminNavbar;
