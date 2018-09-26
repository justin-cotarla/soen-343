import React from "react";
import { Grid } from "semantic-ui-react"

import AdminNavbar from "../components/AdminNavbar";
import RegisterForm from "../components/RegisterForm";

class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'register',
        }
    }

    handleTabClick =  (e, { name }) => this.setState({ activeTab: name });

    render() {
        const { activeTab } = this.state; 
        return (
            <div>
                <Grid style={{ height: "100%" }}>
                    <Grid.Column width={16}>
                        <AdminNavbar vertical={false} active={activeTab} handleItemClick={this.handleTabClick}/> 
                    </Grid.Column>
                    <Grid.Column only="tablet mobile" computer={16}>
                        { activeTab === 'register' && <RegisterForm/> }
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
};

export default AdminDashboard;
