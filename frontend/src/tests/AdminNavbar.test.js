import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import AdminNavbar from '../components/AdminNavbar';

Enzyme.configure({ adapter: new Adapter() });

describe('AdminNavbar', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<AdminNavbar />);
        expect(wrapper).toMatchSnapshot();
    });

    describe('when user clicks tab', () => {
        it('calls the tab click handler', () => {
            const handleTabClickMock = jest.fn();
            const wrapper = shallow(
                <AdminNavbar handleTabClick={handleTabClickMock}/>
            );

            wrapper.find('[name="overview"]').simulate('click');
            expect(handleTabClickMock).toHaveBeenCalledTimes(1);
        });
    });
});