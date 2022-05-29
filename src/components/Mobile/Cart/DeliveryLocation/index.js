import React, { Component } from "react";
import { BiCurrentLocation } from "react-icons/bi";
import Ink from "react-ink";
// import { Link } from "react-router-dom";
import {
  checkConfirmCart,
  checkCartItemsAvailability,
} from "../../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { placeOrder } from "../../../../services/checkout/actions";
import { addProduct } from "../../../../services/cart/actions";
import { updateCart } from "../../../../services/total/actions";
import { FaRegEdit } from "react-icons/fa";

class DeliveryLocation extends Component {
    static contextTypes = {
		router: () => null,
	};
  gotoMyAddressPage = () => {
    localStorage.setItem("fromCart", 1);
    this.context.router.history.push("/search-location");
  };
  render() {
    const { user } = this.props;

    return (
      <div>
        {user.success ? (
          user.data.default_address == null ? (
            <div className="p-15">
              <h2 className="almost-there-text m-0 pb-5">Set Your Address</h2>
              <button
                onClick={this.gotoNewAddressPage}
                className="btn btn-lg btn-continue"
                style={{
                  position: "relative",
                  backgroundColor: localStorage.getItem("storeColor"),
                }}
              >
                New Address
                <Ink duration={500} />
              </button>
            </div>
          ) : (
            <div
              className="d-flex align-items-center justify-content-between pl-15 pr-15 pt-15"
              style={{ width: "100vw" }}
            >
              <div className="d-flex align-items-center">
                <div>
                  <BiCurrentLocation size={20} color={"#111A2C"} />
                </div>

                <div
                  className="ml-10"
                  style={{ fontWeight: "14px", fontWeight: 500 }}
                >
                  {user.data.default_address.address}
                </div>
              </div>
              <div onClick={this.gotoMyAddressPage} className="mr-10">
                <FaRegEdit size={20} color={"#FF0000"} />
              </div>
            </div>
          )
        ) : (
          <div className="p-15">
            <h2 className="almost-there-text m-0 pb-5">Almost There</h2>
            <span className="almost-there-sub text-muted">
              Login to place your order
            </span>
            <button
              onClick={this.gotoLoginPage}
              className="btn btn-lg btn-continue"
              style={{
                backgroundColor: localStorage.getItem("storeColor"),
                position: "relative",
              }}
            >
              Continue
              <Ink duration={500} />
            </button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  addresses: state.addresses.addresses,
  cartProducts: state.cart.products,
  cartTotal: state.total.data,
  coupon: state.coupon.coupon,
  checkout: state.checkout.checkout,
  restaurant: state.restaurant,
});

export default connect(mapStateToProps, {
  placeOrder,
  checkConfirmCart,
  checkCartItemsAvailability,
  addProduct,
  updateCart,
})(DeliveryLocation);
