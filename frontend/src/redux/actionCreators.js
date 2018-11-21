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
} from '../util/__mocks__/ApiUtil';

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
        await deleteCart();
        dispatch(cartSetCart([]));
    }
} 

export function cartCheckoutAsync(itemList) {
    return async dispatch => {
        await checkout(itemList.map(({ catalogItemId }) => catalogItemId));
        dispatch(cartSetCart([]));
    }
    
}
export function cartUpdateAsync(itemList) {
    return async dispatch => {
        await updateCart(itemList.map(({ id }) => id));
        localStorage.setItem('cart', JSON.stringify(itemList));
        dispatch(cartSetCart(itemList));
    }
} 

export function cartGetAsync() {
    return async dispatch => {
        let itemList;
        if (!(itemList = JSON.parse(localStorage.getItem('cart')))) {
            itemList = await Promise.all(((await getCart()).data).map(async id => ({
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
