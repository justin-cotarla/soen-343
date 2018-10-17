import React from 'react';
import { Icon, Menu, Container } from "semantic-ui-react"

const AdminNavbar = (props) => {
    const { vertical, active, handleTabClick } = props;
    return (
        <Container>
            <Menu vertical={vertical} fixed="top" fluid inverted>
                <Menu.Item 
                    name="overview" 
                    active={active === 'overview'} 
                    onClick={handleTabClick} 
                    style={{ padding: "0 1em", height: "50px"}}>
                        <Icon name="home" />
                    Overview
                </Menu.Item>
                <Menu.Item 
                    name="catalog" 
                    active={active === 'catalog'} 
                    onClick={handleTabClick} 
                    style={{ padding: "0 1em", height: "50px"}}>
                        <Icon name="book" />
                    Catalog
                </Menu.Item>
                <Menu.Item 
                    name="addCatalog" 
                    active={active === 'addCatalog'} 
                    onClick={handleTabClick} 
                    style={{ padding: "0 1em", height: "50px"}}>
                        <Icon name="plus" />
                    Add to catalog
                </Menu.Item>
                <Menu.Item 
                    name="register" 
                    active={active === 'register'} 
                    onClick={handleTabClick}
                    style={{ padding: "0 1em", height: "50px"}}>
                        <Icon name="user plus"/>
                    Register a client
                </Menu.Item>
                <Menu.Item 
                    name="users" 
                    active={active === 'users'} 
                    onClick={handleTabClick}
                    style={{ padding: "0 1em", height: "50px"}}>
                        <Icon name="users" />
                    Active clients
                </Menu.Item>
            </Menu>    
        </Container>
    )
}

export default AdminNavbar;
