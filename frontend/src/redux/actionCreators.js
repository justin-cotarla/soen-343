import uuidv4 from 'uuid/v4';

import {
    CART_SET,
    CART_SET_LOADING,
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
        } catch (err) {
            console.err(err);
        }
    }
} 

export function cartCheckoutAsync() {
    return async dispatch => {
        try {
            await checkout();
            localStorage.setItem('cart', JSON.stringify([]));
            dispatch(cartSetCart([]));
        } catch (err) {
            console.error(err);
        }
    }
    
}
export function cartUpdateAsync(itemList) {
    return async dispatch => {
        await updateCart(itemList.map(({ catalogItemId }) => catalogItemId));
        localStorage.setItem('cart', JSON.stringify(itemList));
        dispatch(cartSetCart(itemList));
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
