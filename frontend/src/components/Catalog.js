import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

class Catalog extends React.Component {
    
    render() {
        return (
            <Card>
                <Card.Content>
                <Card.Header>Header</Card.Header>
                <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>Description.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                <a>
                    <Icon name='user' />
                    extraLink
                </a>
                </Card.Content>
            </Card>
        );
    }
}

export default Catalog