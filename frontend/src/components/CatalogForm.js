import React from 'react'
import { Button, Form, Grid, Header, Segment, Checkbox, Message } from 'semantic-ui-react'
import { createCatalogItem } from '../util/ApiUtil';

const options = [
    { key: 'b', text: 'Book', value: 'Book'},
    { key: 'ma', text: 'Magazine', value: 'Magazine'},
    { key: 'mo', text: 'Movie', value: 'Movie'},
    { key: 'mu', text: 'Music', value: 'Music'},
];

class CatalogForm extends React.Component {
    state = {
        type: '',
        quantity: '',
        title: '',
        date: '',
        isbn10: '',
        isbn13: '',
        author: '',
        publisher: '',
        format: '',
        pages: '',
        director: '',
        producers: '',
        actors: '',
        language: '',
        subtitles: '',
        dubbed: '',
        runtime: '',
        artist: '',
        label: '',
        asin: '',
        submitting: false,
        success: false,
        error: false,
        errorMessage: 'The catalog item could not be added',
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleCheckbox = () =>  this.setState((state) => ({ isAdmin: !state.isAdmin }));

    handleSubmit = async () => {
        this.setState({ submitting: true });
        var spec = {}
        const { 
            type,
            quantity,
            title,
            date,
            isbn10,
            isbn13,
            author,
            language,
            publisher,
            format,
            pages,
            director,
            producers,
            actors,
            subtitles,
            dubbed,
            runtime,
            musicType, 
            artist,
            label,
            asin,
        } = this.state;

        switch (type) {
            case 'Book': {
                spec = {
                    title,
                    date,
                    isbn10,
                    isbn13,
                    author,
                    publisher,
                    format,
                    pages,
                }
            }
                break;
            case 'Magazine': {
                spec = {
                    title,
                    date,
                    isbn10,
                    isbn13,
                    publisher,
                    language,
                }
            }
                break;
            case 'Movie': {
                spec = {
                    title,
                    date,
                    director,
                    producers,
                    actors,
                    subtitles,
                    dubbed,
                    runtime,
                }
            }
                break;
            case 'Music': {
                spec = {
                    title,
                    date,
                    musicType,
                    artist,
                    label,
                    asin,
                }
            }
                break;
        }

        try {
            await createCatalogItem(type, spec, quantity);
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
        quantity: '',
        title: '',
        date: '',
        isbn10: '',
        isbn13: '',
        author: '',
        publisher: '',
        format: '',
        pages: '',
        director: '',
        producers: '',
        actors: '',
        language: '',
        subtitles: '',
        dubbed: '',
        runtime: '',
        artist: '',
        musicType: '',
        label: '',
        asin: '',
        admin: false,
        submitting: false,
        success: false,
        errorMessage: 'The catalog item could not be added',
    });

    render() {
        const { 
            type,
            quantity,
            title,
            date,
            isbn10,
            isbn13,
            author,
            language,
            publisher,
            format,
            pages,
            director,
            producers,
            actors,
            subtitles,
            dubbed,
            runtime, 
            musicType,
            artist,
            label,
            asin,
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
                                <Form.Select 
                                    name ="type" 
                                    placeholder='Type'
                                    options={options}
                                    value={type}
                                    onChange={this.handleChange} 
                                    required/>
                                <Form.Input 
                                        name='title' 
                                        value={title} 
                                        placeholder='Title' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />
                                <Form.Input 
                                    name='date' 
                                    value={date} 
                                    placeholder='Date' 
                                    required 
                                    onChange={this.handleChange}
                                    error={error} />
                                <Form.Input 
                                    name ="quantity" 
                                    placeholder='Quantity'
                                    options={options}
                                    value={quantity}
                                    onChange={this.handleChange} 
                                    required/>
                                {
                                    type == 'Book' &&
                                    <Form.Input 
                                        name='author' 
                                        value={author} 
                                        placeholder='Author' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />
                                }
                                {
                                    type == 'Book' &&
                                    <Form.Group widths='equal'>
                                        <Form.Input 
                                            name='format' 
                                            value={format} 
                                            placeholder='Format' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='pages' 
                                            value={pages} 
                                            placeholder='Pages' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                    </Form.Group>
                                }
                                {
                                    (type == 'Magazine' || type == 'Movie') &&
                                    <Form.Input 
                                            name='language' 
                                            value={language} 
                                            placeholder='Language' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                }
                                {
                                    (type == 'Book' || type == 'Magazine') &&
                                    <Form.Input 
                                        name='publisher' 
                                        value={publisher} 
                                        placeholder='Publisher' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />
                                }
                                {
                                    (type == 'Book' || type == 'Magazine') &&
                                    <Form.Group widths='equal'>
                                        <Form.Input 
                                            name='isbn10' 
                                            value={isbn10} 
                                            placeholder='Isbn10' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='isbn13' 
                                            value={isbn13} 
                                            placeholder='Isbn13' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                    </Form.Group>
                                }

                                {
                                    type == 'Movie' &&
                                    <Form.Input 
                                        name='director' 
                                        value={director} 
                                        placeholder='Director' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />
                                }
                                {
                                    type == 'Movie' &&
                                    <Form.Input 
                                        name='producers' 
                                        value={producers} 
                                        placeholder='Producers' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />
                                }
                                {
                                    type == 'Movie' && 
                                    <Form.Input 
                                        name='actors' 
                                        value={actors} 
                                        placeholder='Actors' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />
                                }
                                {
                                    type == 'Movie' &&
                                    <Form.Group widths="equal">
                                        <Form.Input 
                                            name='subtitles' 
                                            value={subtitles} 
                                            placeholder='Subtitles' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='dubbed' 
                                            value={dubbed} 
                                            placeholder='Dubbed' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='runtime' 
                                            value={runtime} 
                                            placeholder='Runtime' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                    </Form.Group>
                                }
                                {
                                    type == 'Music' &&
                                    <Form.Input 
                                            name='musicType' 
                                            value={musicType} 
                                            placeholder='Type' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                }
                                {
                                    type == 'Music' &&
                                    <Form.Input 
                                            name='artist' 
                                            value={artist} 
                                            placeholder='Artist' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                }
                                {
                                    type == 'Music' &&
                                    <Form.Input 
                                            name='label' 
                                            value={label} 
                                            placeholder='Label' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                }
                                {
                                    type == 'Music' &&
                                    <Form.Input 
                                            name='asin' 
                                            value={asin} 
                                            placeholder='asin' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                }
                
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
                                        Add Catalog Item
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
                                className="enter-new-catalog-item"
                                onClick={this.initializeForm}>Enter another item</Header>}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default CatalogForm;
