import React from 'react'
import { Button, Form, Grid, Header, Segment, Checkbox, Message } from 'semantic-ui-react'
import axios from 'axios';
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            address: '',
            phone: '',
            email: '',
            password: '',
            admin: false,
            submitting: false,
            success: false,
        }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleCheckbox = () =>  this.setState((state) => ({ admin: !state.admin }));

    handleSubmit = async () => {
        this.setState({ submitting: true });
        // TODO: make request to endpoint for user creation
    };

    initializeForm = () => this.setState({
        fname: '',
            lname: '',
            address: '',
            phone: '',
            email: '',
            password: '',
            admin: false,
            submitting: false,
            success: false,
    });

    render() {
        const { fname, lname, address, email, phone, password, admin, submitting, success } = this.state;
        return (
            <div className='login-form' >
                <style>{`
                body > div,
                body > div > div,
                body > div > div > div.login-form {
                    height: 100%;
                }
                `}</style>
                <Grid textAlign='center' >
                    <Grid.Column style={{ width: '80%', maxWidth: '600px' }}>
                        <Header as='h2' color='teal' textAlign='left'>
                        Register a Client
                        </Header>
                        <Form size='big' success={success}>
                            <Segment stacked>
                                <Form.Input 
                                    name ="fname" 
                                    fluid icon='user outline' 
                                    iconPosition='left' 
                                    placeholder='First Name'
                                    value={fname}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                    name ="lname" 
                                    fluid icon='user outline' 
                                    iconPosition='left' 
                                    placeholder='Last Name' 
                                    value={lname}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                    name ="address" 
                                    fluid icon='home' 
                                    iconPosition='left' 
                                    placeholder='Address' 
                                    value={address}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                    name ="phone" 
                                    fluid icon='phone' 
                                    iconPosition='left' 
                                    placeholder='Phone Number' 
                                    value={phone}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                    name ="email" 
                                    fluid icon='mail' 
                                    iconPosition='left' 
                                    placeholder='E-mail address' 
                                    value={email}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                    name ="password"    
                                    fluid icon='lock' 
                                    iconPosition='left' 
                                    placeholder='Password' 
                                    type='password' 
                                    value={password}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Field
                                    name="admin" 
                                    control={Checkbox} 
                                    label={{ children: 'This is an administrator account' }} 
                                    checked={admin}
                                    onChange={this.handleCheckbox} />
                                <Button 
                                    loading={submitting} 
                                    color='teal' 
                                    size='large' 
                                    onClick={this.handleSubmit} 
                                    disabled={!fname || !lname || !address || !email || !phone || !password || submitting}
                                    fluid>
                                        Register
                                </Button>
                            </Segment>
                            <Message 
                                success
                                header='Registration complete!' 
                                content={`An ${admin ? 'administrative' : ''} account was created for ${fname} ${lname}`} />
                        </Form>
                        { 
                            success && 
                            <Header 
                                as='h3' 
                                className="enter-new-user"
                                onClick={this.initializeForm}>Enter another user</Header>}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}


export default LoginForm;
