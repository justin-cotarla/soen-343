import React from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'

const CatalogTypeFilter = (props) => {
    const { 
        selectedTypeFilter,
        handleTypeFilterClick,
        handleDropdownChange,
    } = props;

    const options = [
        { text: 'Oldest', value: 'Oldest' },
        { text: 'Newest', value: 'Newest' },
        { text: 'A-Z', value: 'A-Z' },
        { text: 'Z-A', value: 'Z-A' },
    ];

    return (
        <Menu text secondary style={{ marginTop: '1em' }}> 
            <Menu.Item
                color="teal"
                name="All"
                value=""
                active={selectedTypeFilter === ''}
                onClick={handleTypeFilterClick}
                style={{ cursor: 'pointer', fontSize: '16px' }}/>
            <Menu.Item color="teal"
                name="Books"
                value="book"
                active={selectedTypeFilter === 'book'}
                onClick={handleTypeFilterClick}
                style={{ cursor: 'pointer', fontSize: '16px' }}/>
            <Menu.Item color="teal"
                name="Magazines"
                value="magazine"
                active={selectedTypeFilter === 'magazine'}
                onClick={handleTypeFilterClick}
                style={{ cursor: 'pointer', fontSize: '16px' }}/>
            <Menu.Item color="teal"
                name="Movies"
                value="movie"
                active={selectedTypeFilter === 'movie'}
                onClick={handleTypeFilterClick}
                style={{ cursor: 'pointer', fontSize: '16px' }}/>
            <Menu.Item color="teal"
                name="Music"
                value="music"
                active={selectedTypeFilter === 'music'}
                onClick={handleTypeFilterClick}
                style={{ cursor: 'pointer', fontSize: '16px' }}/>
            <Menu.Menu position='right'>
                <Menu.Item >
                    <Dropdown compact
                        selection
                        name='direction'
                        options={options} 
                        placeholder='Order By'
                        onChange={handleDropdownChange}/>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default CatalogTypeFilter;
    