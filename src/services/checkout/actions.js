import { PLACE_ORDER } from "./actionTypes";
import { PLACE_ORDER_URL } from "../../configs";
import { APPLY_COUPON } from "../coupon/actionTypes";

import Axios from "axios";
import { updateCart } from "../total/actions";

export const placeOrder = (
  user,
  order,
  coupon,
  location,
  order_comment,
  total,
  method,
  payment_token,
  delivery_type,
  partial_wallet,
  distance,
  pending_payment,
  tipAmount,
  is_scheduled,
  scheduled_date,
  scheduled_time,
  device
) => (dispatch, getState) => {
  return Axios.post(PLACE_ORDER_URL, {
    token: user.data.auth_token,
    user: user,
    order: order,
    coupon: coupon,
    location: location,
    order_comment: order_comment,
    total: total,
    method: method,
    payment_token: payment_token,
    delivery_type: delivery_type,
    partial_wallet: partial_wallet,
    dis: distance,
    pending_payment: pending_payment,
    tipAmount: tipAmount,
    is_scheduled: is_scheduled,
    scheduled_date: scheduled_date,
    scheduled_time: scheduled_time,
    device: device,
  })
    .then((response) => {
      const checkout = response.data;

      if (checkout.success) {
        dispatch({ type: PLACE_ORDER, payload: checkout });

        const state = getState();
        // console.log(state);
        const cartProducts = state.cart.products;
        // const user = state.user.user;
        localStorage.removeItem("orderComment");
        localStorage.removeItem("calc");

        for (let i = cartProducts.length - 1; i >= 0; i--) {
          // remove all items from cart
          cartProducts.splice(i, 1);
        }

        dispatch(updateCart(cartProducts));

        localStorage.removeItem("appliedCoupon");
        const coupon = [];
        dispatch({ type: APPLY_COUPON, payload: coupon });
      } else {
        return checkout;
      }
    })
    .catch(function(error) {
      return error.response;
    });
};
