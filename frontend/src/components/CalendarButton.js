import React from 'react';
import { Button } from 'semantic-ui-react';

class CalendarButton extends React.Component {
   render() {
       const { value, onClick } = this.props;
       return (
        <Button
            content={value}
            onClick={onClick}
        />
    );
   } 
}

export default CalendarButton;
