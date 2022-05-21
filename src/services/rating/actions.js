import { GET_REVIEWS_OF_STORE, ADD_RATING_FOR_ORDER, GET_RATABLE_ORDER_DETAILS } from "./actionTypes";

import { GET_REVIEWS_OF_STORE_URL, ADD_RATING_URL, GET_RATABLE_ORDER_DETAILS_URL } from "../../configs";
import Axios from "axios";

export const getReviewsForStore = (slug) => (dispatch) => {
	return Axios.get(GET_REVIEWS_OF_STORE_URL + "/" + slug)
		.then((response) => {
			const reviews = response.data.reviews;

			return [
				dispatch({ type: GET_REVIEWS_OF_STORE, payload: reviews }),
			];
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const addRating = (token, store_id, rating_store, review_store) => (dispatch) => {
	return Axios.post(ADD_RATING_URL, {
		token: token,
		store_id: store_id,
		rating_store: rating_store,
		review_store: review_store,
	})
		.then((response) => {
			const rating = response.data;
			return dispatch({
				type: ADD_RATING_FOR_ORDER,
				payload: rating,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};

export const getOrderDetails = (order_id, token) => (dispatch) => {
	Axios.post(GET_RATABLE_ORDER_DETAILS_URL, {
		order_id: order_id,
		token: token,
	})
		.then((response) => {
			const rating = response.data;
			return dispatch({
				type: GET_RATABLE_ORDER_DETAILS,
				payload: rating,
			});
		})
		.catch(function(error) {
			console.log(error);
		});
};
