import { LOGIN_STORE_USER, LOGOUT_STORE_USER, UPDATE_STORE_USER_INFO, UPDATE_STORE_ORDER_HISTORY } from "./actionTypes";

const initialState = {
    store_user: [],
    order_history: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_STORE_USER:
            return { ...state, store_user: action.payload };
        case LOGOUT_STORE_USER:
            return { ...state, store_user: action.payload };
        case UPDATE_STORE_USER_INFO:
            return { ...state, store_user: action.payload.store_user, order_history: action.payload.order_history };
        case UPDATE_STORE_ORDER_HISTORY:
            return { ...state, order_history: action.payload };
        default:
            return state;
    }
}
