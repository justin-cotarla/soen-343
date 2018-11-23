import {
    TOASTS_SETUP,
    TOASTS_NOTIFY,
} from '../actions';

const initialState = {
    toastManager: undefined,
}

const toastsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOASTS_SETUP: {
        return {
            ...state,
            toastManager: action.toastManager,
        }
    }

    case TOASTS_NOTIFY: {
        const { message, appearance } = action;
        // I'm sorry Dan Abromov
        state.toastManager.add(
            message,
            {
                appearance,
                autoDismiss: true, 
            }
        );
        return {
            ...state,
        }
    }

    default: {
      return state;
    }
  }
};

export default toastsReducer;
