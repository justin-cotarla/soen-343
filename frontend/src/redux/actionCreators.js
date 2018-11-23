import uuidv4 from 'uuid/v4';

import {
    CART_SET,
    CART_SET_LOADING,
    TOASTS_SETUP,
    TOASTS_NOTIFY,
} from './actions';
import {
    deleteCart,
    checkout,
    updateCart,
    getCart,
    getCatalogItem,
} from '../util/ApiUtil';

export function cartSetCart(itemList) {
    return {
        type: CART_SET,
        itemList,
    };
}

export function toastsSetup(toastManager) {
    return {
        type: TOASTS_SETUP,
        toastManager,
    };
}

export function toastsNotify(message, appearance) {
    return {
        type: TOASTS_NOTIFY,
        message,
        appearance,
    };
}

export function cartSetLoading(loading) {
    return {
        type: CART_SET_LOADING,
        loading,
    };
}

export function cartDeleteAsync() {
    return async dispatch => {
        try {
            await deleteCart();
            localStorage.setItem('cart', JSON.stringify([]));
            dispatch(cartSetCart([]));
            dispatch(toastsNotify('Cart cleared', 'success'));
        } catch (err) {
            console.error(err);
            dispatch(toastsNotify('Could not clear cart', 'error'));
        }
    }
} 

export function cartCheckoutAsync() {
    return async dispatch => {
        try {
            await checkout();
            localStorage.setItem('cart', JSON.stringify([]));
            dispatch(cartSetCart([]));
            dispatch(toastsNotify('Checked out', 'success'));
            window.location.reload();
        } catch (err) {
            console.error(err);
            dispatch(toastsNotify('Could not clear cart', 'error'));
        }
    }
    
}
export function cartUpdateAsync(itemList) {
    return async dispatch => {
        try {
            await updateCart(itemList.map(({ catalogItemId }) => catalogItemId));
            localStorage.setItem('cart', JSON.stringify(itemList));
            dispatch(cartSetCart(itemList));
            dispatch(toastsNotify('Cart modified', 'success'));
        } catch (err) {
            console.error(err);
            dispatch(toastsNotify('Could not modify cart', 'error'));
        }
    }
} 

export function cartGetAsync() {
    return async dispatch => {
        let itemList;
        if (!(itemList = JSON.parse(localStorage.getItem('cart')))) {
            let cart;
            try {
                cart = (await getCart()).data;
            } catch (err) {
                cart = [];
            }
            itemList = await Promise.all(cart.map(async id => ({
                id: uuidv4(),
                catalogItemId: id,
                title: (await getCatalogItem(id)).data.title,
            })));
            localStorage.setItem('cart', JSON.stringify(itemList));
        }
        dispatch(cartSetCart(itemList));
        dispatch(cartSetLoading(false));
    }
}
