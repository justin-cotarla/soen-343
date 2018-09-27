import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import RegisterForm from '../components/RegisterForm';

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<RegisterForm/>);
const form = wrapper.find('Form');
const submitHandlerSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');

describe('RegisterForm', () => {
    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('does not submit if a required field is empty', () => {      
        form.simulate('submit');
        expect(submitHandlerSpy).not.toHaveBeenCalled();
    });
}); 

