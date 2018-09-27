import React from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'

class LoginForm extends React.Component {

  state = { email: '', password: '', submitting: false}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { email, password } = this.state
    console.log(`Email: ${email}, Password: ${password}`)
    this.setState({ submitting: true })
  }

  render() {

    const { email, password, submitting } = this.state

    return(
      <div>
          <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 100%;
            }
          `}</style>
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='teal' textAlign='left'>
                Log-in to your account
              </Header>
              <Form size='large' onSubmit={this.handleSubmit}>
                <Segment stacked>
                  <Form.Input fluid icon='user' name='email' value={email} iconPosition='left' placeholder='E-mail address' required onChange={this.handleChange}/>
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
                  />

                  <Button color='teal' fluid size='large' loading={submitting}>
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

export default LoginForm
