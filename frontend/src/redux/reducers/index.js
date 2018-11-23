import { combineReducers } from 'redux';

import cartReducer from './cart';
import toastsReducer from './toasts';

export default combineReducers({
    cart: cartReducer,
    toasts: toastsReducer,
});
