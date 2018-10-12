import React from "react";
import { Grid } from "semantic-ui-react"

import AdminNavbar from "../components/AdminNavbar";
import RegisterForm from "../components/RegisterForm";
import ViewActiveUsers from "../components/ViewActiveUsers";
import Catalog from '../components/Catalog';
import CatalogForm from '../components/CatalogForm';

class AdminDashboard extends React.Component {
    state = { activeTab: 'register' };

    handleTabClick =  (e, { name }) => this.setState({ activeTab: name });

    render() {
        const { activeTab } = this.state; 
        return (
            <div>
                <Grid style={{ height: "100%" }}>
                    <Grid.Column width={16}>
                        <AdminNavbar vertical={false} active={activeTab} handleTabClick={this.handleTabClick}/> 
                    </Grid.Column>
                    <Grid.Column  computer={16}>
                        { activeTab === 'register' && <RegisterForm/> }
                        { activeTab === 'users' && <ViewActiveUsers/> }
                        { activeTab === 'catalog' && <Catalog/> }
                        { activeTab === 'addCatalog' && <CatalogForm/> }
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
};

export default AdminDashboard;
