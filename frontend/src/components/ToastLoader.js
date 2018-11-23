import React from 'react';
import { connect } from 'react-redux';
import { withToastManager } from 'react-toast-notifications';

import { toastsSetup } from '../redux/actionCreators'; 

class ToastLoader extends React.Component {
    componentDidMount() {
        const { toastsSetup, toastManager } = this.props;
        toastsSetup(toastManager);
    }
    render() {
        return null;
    }
};

export default connect(null, { toastsSetup })(withToastManager(ToastLoader));

