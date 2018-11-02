import React from 'react'
import { Button, Form, Grid, Header, Segment, Message } from 'semantic-ui-react'
import { login } from '../util/ApiUtil'

class LoginForm extends React.Component {
    state = { 
        email: '', 
        password: '', 
        submitting: false, 
        error: false, 
        errorMessage: 'Username and password do not match',
    }
    
    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    
    handleSubmit = async () => {
        const { email, password } = this.state
        this.setState({ submitting: true })
        
        try {
            const { data: { token } } = await login(email, password);
            localStorage.setItem('Authorization', token);
            window.location.reload();
        } catch(error){
            if(error.response.status === 444) {
                this.setState({
                    error: true, 
                    errorMessage: 'User already logged in',
                    submitting: false, 
                });
            } else {
                this.setState({ 
                    error: true, 
                    submitting: false, 
                });
            }
        }
    }
    
    render() {
        const { email, password, submitting, redirect, error, errorMessage } = this.state

        return(
            <div style={{ height: '100%' }}>
                <Grid 
                    textAlign='center' 
                    verticalAlign="middle"
                    style={{ height: '100%' }}>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='left'>
                            Log-in to your account
                        </Header>
                        <Form size='large' onSubmit={this.handleSubmit} error={error}>
                            <Segment stacked>
                                <Form.Input 
                                    fluid 
                                    icon='user' 
                                    name='email' 
                                    value={email} 
                                    iconPosition='left' 
                                    placeholder='E-mail address' 
                                    required 
                                    onChange={this.handleChange}
                                    error={error} />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    name='password'
                                    value={password}
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    required
                                    onChange={this.handleChange}
                                    error={error} />
                                <Message 
                                    error  
                                    header="Login failed" 
                                    content={errorMessage}
                                    style={{ textAlign: 'left' }} />
                                <Button 
                                    color='teal' 
                                    fluid 
                                    size='large' 
                                    loading={submitting}>
                                        Login
                                </Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
    
export default LoginForm;
    