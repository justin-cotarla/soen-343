import {
    CART_SET,
    CART_SET_LOADING,
} from '../actions';

const initialState = {
    itemList: [],
    loading: true,
}

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_SET: {
        return {
            ...state,
            itemList: [
                ...action.itemList,
            ],
        }
    }

    case CART_SET_LOADING: {
        return {
            ...state,
            loading: action.loading,
        };
    }

    default: {
      return state;
    }
  }
};

export default cartReducer;
