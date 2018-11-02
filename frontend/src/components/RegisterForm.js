import React from 'react'
import { Button, Form, Grid, Header, Segment, Checkbox, Message } from 'semantic-ui-react'
import { register } from '../util/ApiUtil';
class LoginForm extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        isAdmin: false,
        submitting: false,
        success: false,
        error: false,
        errorMessage: 'The account could not be created',
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleCheckbox = () =>  this.setState((state) => ({ isAdmin: !state.isAdmin }));

    handleSubmit = async () => {
        this.setState({ submitting: true });

        const { firstName, lastName, email, address, phone, password, isAdmin } = this.state;
        try {
            await register(firstName, lastName, email, address, phone, password, isAdmin);
            this.setState({ 
                submitting: false, 
                success: true,
            });
        } catch (err) {
            this.setState({
                submitting: false,
                error: true,
            });
        }
    };

    initializeForm = () => this.setState({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        admin: false,
        submitting: false,
        success: false,
        errorMessage: 'The account could not be created',
    });

    render() {
        const { 
            firstName, 
            lastName, 
            address, 
            email, 
            phone, 
            password, 
            isAdmin, 
            submitting, 
            success, 
            error, 
            errorMessage,
        } = this.state;
        return (
            <div className='register-form' style={{ height: '100%' }}>
                <Grid 
                    textAlign='center' 
                    verticalAlign="middle"
                    style={{ height: '100%' }}>
                    <Grid.Column style={{ width: '80%', maxWidth: '600px' }}>
                        <Header as='h2' color='teal' textAlign='left'>
                        Register a Client
                        </Header>
                        <Form size='big' success={success} onSubmit={this.handleSubmit} error={error}>
                            <Segment stacked>
                                <Form.Input 
                                    name ="firstName" 
                                    fluid icon='user outline' 
                                    iconPosition='left' 
                                    placeholder='First Name'
                                    value={firstName}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                    name ="lastName" 
                                    fluid icon='user outline' 
                                    iconPosition='left' 
                                    placeholder='Last Name' 
                                    value={lastName}
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
                                    name="isAdmin" 
                                    control={Checkbox} 
                                    label={{ children: 'This is an administrator account' }} 
                                    checked={isAdmin}
                                    onChange={this.handleCheckbox} />
                                <Message 
                                    error  
                                    header="Registration failed" 
                                    content={errorMessage}
                                    style={{ textAlign: 'left' }} />
                                <Button 
                                    loading={submitting} 
                                    color='teal' 
                                    size='large' 
                                    type="submit"
                                    fluid>
                                        Register
                                </Button>
                            </Segment>
                            <Message 
                                success
                                header='Registration complete!' 
                                content={`An ${isAdmin ? 'administrative' : ''} account was created for ${firstName} ${lastName}`} />
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
