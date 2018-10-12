import React from 'react'
import { Button, Form, Grid, Header, Segment, Checkbox, Message } from 'semantic-ui-react'
import { register } from '../util/ApiUtil';
class CatalogForm extends React.Component {
    state = {
        type: '',
        submitting: false,
        success: false,
        error: false,
        errorMessage: 'The catalog item could not be added',
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
        type: '',
        admin: false,
        submitting: false,
        success: false,
        errorMessage: 'The catalog item could not be added',
    });

    render() {
        const { 
            type, 
            isAdmin, 
            submitting, 
            success, 
            error, 
            errorMessage,
        } = this.state;
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
                        Add a catalog item
                        </Header>
                        <Form size='big' success={success} onSubmit={this.handleSubmit} error={error}>
                            <Segment stacked>
                                <Form.Input 
                                    name ="type" 
                                    fluid icon='user outline' 
                                    iconPosition='left' 
                                    placeholder='Type'
                                    value={type}
                                    onChange={this.handleChange} 
                                    required/>
                                <Message 
                                    error  
                                    header="Catalog add failed" 
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
                                header='Catalog addition complete!' 
                                content={`A ${type} was created`} />
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


export default CatalogForm;
