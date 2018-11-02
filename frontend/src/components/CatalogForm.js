import React from 'react'
import { Button, Form, Grid, Header, Segment, Message, Dropdown } from 'semantic-ui-react'
import { createBook, createMagazine, createMovie, createMusic } from '../util/ApiUtil';

import { invalidate } from '../util/AuthUtil';

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

    handleSubmit = async () => {
        this.setState({ submitting: true });
        let spec = {}
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

        try {
            switch (type) {
                case 'Book': 
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

                    await createBook(spec, quantity);
                    break;
                case 'Magazine': 
                    spec = {
                        title,
                        date,
                        isbn10,
                        isbn13,
                        publisher,
                        language,
                    }

                    await createMagazine(spec, quantity);
                    break;
                case 'Movie': 
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

                    await createMovie(spec, quantity);
                    break;
                case 'Music':
                    spec = {
                        title,
                        date,
                        musicType,
                        artist,
                        label,
                        asin,
                    }

                    await createMusic(spec, quantity);
                    break;
                default: 
            }
            this.setState({ 
                submitting: false, 
                success: true,
            });
        } catch (error) {
            if(error.response.status === 403) {
                invalidate();
            }
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
            <div className='login-form' style={{ height: '100%' }}>
                <Grid 
                    textAlign='center' 
                    verticalAlign="middle"
                    style={{ height: '100%' }}>
                    <Grid.Column style={{ width: '80%', maxWidth: '650px' }}>
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
                                    type === 'Book' && [
                                    <Form.Dropdown
                                        key="book-format"
                                        control={Dropdown}
                                        name="format"
                                        placeholder='Select book format'
                                        value={format}
                                        options={[
                                            { value: 'HardCover', text: 'Hardcover' },
                                            { value: 'PaperBack', text: 'Paperback '},
                                        ]}
                                        onChange={this.handleChange}
                                        selection
                                        search
                                        required
                                        error={error}/>,
                                    <Form.Input 
                                        key="book-pages"
                                        name='pages' 
                                        value={pages} 
                                        placeholder='Pages' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    <Form.Group widths="equal" key="book-author-publisher">
                                        <Form.Input 
                                            name='author' 
                                            value={author} 
                                            placeholder='Author' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='publisher' 
                                            value={publisher} 
                                            placeholder='Publisher' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                    </Form.Group>,
                                    <Form.Group widths="equal" key="book-isbn">
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
                                    ]
                                }
                                {
                                    type === 'Magazine' && [
                                    <Form.Input 
                                        key="mag-publisher"
                                        name='publisher' 
                                        value={publisher} 
                                        placeholder='Publisher' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    <Form.Input 
                                        key="mag-lang"
                                        name='language' 
                                        value={language} 
                                        placeholder='Language' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    <Form.Group widths="equal" key="mag-isbn">
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
                                    ]
                                }
                                {
                                    type === 'Movie' && [
                                    <Form.Input 
                                        key="movie-lang"
                                        name='language' 
                                        value={language} 
                                        placeholder='Language' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    <Form.Group widths="equal" key="movie-people">
                                        <Form.Input 
                                            name='director' 
                                            value={director} 
                                            placeholder='Director' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='producers' 
                                            value={producers} 
                                            placeholder='Producers' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                        <Form.Input 
                                            name='actors' 
                                            value={actors} 
                                            placeholder='Actors' 
                                            required 
                                            onChange={this.handleChange}
                                            error={error} />
                                    </Form.Group>,
                                    <Form.Group widths="equal" key="movie-info">
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
                                    ]
                                }
                                {
                                    type === 'Music' && [
                                    <Form.Dropdown
                                        key="music-type"
                                        control={Dropdown}
                                        name="musicType"
                                        placeholder='Select music type'
                                        value={musicType}
                                        options={[
                                            { value: 'CD', text: 'CD' },
                                            { value: 'VINYL', text: 'Vinyl' },
                                            { value: 'DIGITAL', text: 'Digital' },
                                        ]}
                                        onChange={this.handleChange}
                                        selection
                                        search
                                        required
                                        error={error}/>,
                                    <Form.Input 
                                        key="music-artist"
                                        name='artist' 
                                        value={artist} 
                                        placeholder='Artist' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    <Form.Input 
                                        key="music-label"
                                        name='label' 
                                        value={label} 
                                        placeholder='Label' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    <Form.Input 
                                        key="music-asin"
                                        name='asin' 
                                        value={asin} 
                                        placeholder='asin' 
                                        required 
                                        onChange={this.handleChange}
                                        error={error} />,
                                    ]
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
                                onClick={this.initializeForm}>
                                Enter another item
                            </Header>
                        }
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default CatalogForm;
