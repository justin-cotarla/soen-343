import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';

import UserList from './UserList'
;
import { getActiveUsers } from '../util/ApiUtil';

class ViewActiveUsers extends Component {
    state = { users: [] };

    componentDidMount = async () => {
        try {
            const { data } = await getActiveUsers();
            this.setState({ users: data });
        } catch (error) {

        }
    }

    render() {
        return (
            <div style={{ display: 'inline-block', margin: 'auto' }}>
                <Grid textAlign='center' style={{ margin: '3em 1em' }} >
                    <Grid.Column>
                        <Header as='h1' color='teal' textAlign='left' style={{ margin: '1em 0' }}>
                            Active Users
                        </Header>
                        <UserList users={this.state.users}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default ViewActiveUsers;
