import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Icon } from "semantic-ui-react"

import { logout } from '../util/ApiUtil';
import { invalidate } from '../util/AuthUtil';

const handleLogout = async () => {
    try {
        await logout();
        invalidate();
    } catch (err) {

    }
}

const Navbar = (props) => {
    const { vertical, token } = props;
    let user, isAdmin;
    if (token) {
        user = token.user;
        isAdmin = token.isAdmin;
    }
    return (
        <Menu vertical={vertical} fixed="top" fluid inverted>
            <Menu.Item>
                <Header as="h1" style={{ color: 'white' }}>LibManager</Header>
            </Menu.Item>
            {
                user && 
                <Dropdown 
                item
                floating
                text="Catalog"
                className="icon">
                    <Dropdown.Menu>
                        <Dropdown.Item
                            as={NavLink}
                            to="/catalog"
                            icon="book"
                            content="View All"/>
                        {
                            isAdmin && 
                            <Dropdown.Item 
                                as={NavLink}
                                to="/catalog/add"
                                icon="plus"
                                content="Add to Catalog"/>
                        }
                    </Dropdown.Menu>
                </Dropdown>
            }
            {
                isAdmin && 
                <Dropdown 
                    item
                    floating
                    text="Users"
                    name="users"
                    className="icon">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={NavLink}
                                to="/users/register"
                                icon="user plus"
                                content="Register"/>
                            <Dropdown.Item 
                                as={NavLink}
                                to="/users/active"
                                icon="users"
                                content="View Active"/>
                        </Dropdown.Menu>
                </Dropdown>
            }
            <Menu.Menu position="right">
            {
                user &&
                <Dropdown 
                    item
                    floating
                    fluid
                    text={`${user.lastName}, ${user.firstName}`}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                icon="log out"
                                content="Log Out"
                                onClick={handleLogout}/>
                        </Dropdown.Menu>
                    </Dropdown>
            }
            {
                !user &&
                <Menu.Item
                    as={Link}
                    to="/login">
                    <Icon name="sign in"/>
                    Log In
                </Menu.Item>
            }      
            </Menu.Menu>
        </Menu>    
    )
}

export default Navbar;
