import { LOGIN_STORE_USER,UPDATE_STORE_USER_INFO,LOGOUT_STORE_USER } from "./actionTypes";

import { LOGIN_STORE_USER_URL, UPDATE_STORE_USER_INFO_URL } from "../../../configs";

import Axios from "axios";

export const loginStoreUser = (email, password) => dispatch => {
    Axios.post(LOGIN_STORE_USER_URL, {
        email: email,
        password: password
    })
        .then(response => {
            const store_user = response.data;
            return dispatch({ type: LOGIN_STORE_USER, payload: store_user });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const updateStoreUserInfo = (user_id, token) => dispatch => {
    Axios.post(UPDATE_STORE_USER_INFO_URL, {
        token: token,
        user_id: user_id
    })
        .then(response => {
            const data = { store_user: response.data, order_history: response.data.data.orders };
            return dispatch({ type: UPDATE_STORE_USER_INFO, payload: data });
        })
        .catch(function(error) {
            console.log(error);
        });
};

export const logoutUser = (store_user) => (dispatch) => {
	store_user = [];

	//remove geoLocation and userSetAddress
	dispatch({
		type: LOGOUT_STORE_USER,
		payload: store_user,
	});
	
};