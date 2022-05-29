import React, { Component } from "react";

// import DelayLink from "../../../helpers/delayLink";
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
import { formatPrice } from "../../../helpers/formatPrice";
import { couponApplied } from "../../../../services/coupon/actions";
import { Buy } from "react-iconly";

class CartCheckoutBlock extends Component {
  static contextTypes = {
    router: () => null,
  };
  // state = {
  //     loading: true,
  //     is_operational: true
  // };

  state = {
    process_cart_loading: false,
    delivery_charges: 0,
    distance: 0,
    tips: 0,
    couponAppliedAmount: 0,
    user_selected: "DELIVERY",
  };

  componentDidMount() {
    // this.props.checkForItemsAvailability();
  }

  componentWillReceiveProps(nextProps) {
    // const { checkout} = this.props;
    if (nextProps.checkout !== this.props.checkout) {
      //redirect to running order page
      this.context.router.history.push("/running-order");
    }

    if (
      this.props.user_selected === "DELIVERY" &&
      nextProps.restaurant_info.is_free_delivery == 0
    ) {
      if (
        this.props.restaurant_info.delivery_charges !==
        nextProps.restaurant_info.delivery_charges
      ) {
        this.setState({
          delivery_charges: nextProps.restaurant_info.delivery_charges,
        });
      }
    }

    if (nextProps.distance) {
      if (
        this.props.user_selected === "DELIVERY" &&
        nextProps.restaurant_info.is_free_delivery == 0
      ) {
        if (nextProps.restaurant_info.delivery_charge_type === "DYNAMIC") {
          this.setState({ distance: nextProps.distance }, () => {
            //check if restaurant has dynamic delivery charge..
            this.calculateDynamicDeliveryCharge();
          });
        }
      }
    }

    if (nextProps.user_selected === "SELFPICKUP") {
      this.setState({ delivery_charges: 0, user_selected: "SELFPICKUP" });
    }
    // console.log("NEXT PROPS - " + nextProps.is_operational);
    // if (nextProps.is_operational !== this.props.is_operational) {
    //     console.log("Came here -> FROM CHILD");
    //     this.setState({ is_operational: false, loading: false });
    // }
  }

  processCart = () => {
    const {
      handleProcessCartLoading,
      checkCartItemsAvailability,
      cartProducts,
      addProduct,
      updateCart,
      checkConfirmCart,
      handleItemsAvailability,
    } = this.props;

    handleProcessCartLoading(true);

    checkCartItemsAvailability(cartProducts).then((response) => {
      handleProcessCartLoading(false);
      this.setState({ process_cart_loading: false });

      if (response && response.length) {
        let isSomeInactive = false;
        response.map((arrItem) => {
          //find the item in the cart
          let item = cartProducts.find((item) => item.id === arrItem.id);
          //get new price and is_active status and set it.
          item.is_active = arrItem.is_active;
          item.price = arrItem.price;
          addProduct(item);

          if (!isSomeInactive) {
            if (!arrItem.is_active) {
              isSomeInactive = true;
            }
          }
          return item;
        });
        if (isSomeInactive) {
          updateCart(this.props.cartProducts);
          handleItemsAvailability(false);
        } else {
          updateCart(this.props.cartProducts);
          checkConfirmCart();
          this.context.router.history.push("/checkout");
        }
      }
    });
  };

  gotoNewAddressPage = () => {
    localStorage.setItem("fromCart", 1);
    this.context.router.history.push("/search-location");
  };

  gotoMyAddressPage = () => {
    localStorage.setItem("fromCart", 1);
    this.context.router.history.push("/search-location");
  };

  gotoLoginPage = () => {
    localStorage.setItem("fromCartToLogin", 1);
    this.context.router.history.push("/login");
  };

  calculateDynamicDeliveryCharge = () => {
    if (this.state.user_selected !== "SELFPICKUP") {
      const { restaurant_info } = this.props;

      const distanceFromUserToRestaurant = this.state.distance;
      console.log(
        "Distance from user to restaurant: " +
          distanceFromUserToRestaurant +
          " km"
      );

      if (
        distanceFromUserToRestaurant > restaurant_info.base_delivery_distance
      ) {
        const extraDistance =
          distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
        console.log("Extra Distance: " + extraDistance + " km");

        const extraCharge =
          (extraDistance / restaurant_info.extra_delivery_distance) *
          restaurant_info.extra_delivery_charge;
        console.log("Extra Charge: " + extraCharge);

        let dynamicDeliveryCharge =
          parseFloat(restaurant_info.base_delivery_charge) +
          parseFloat(extraCharge);
        console.log("Total Charge: " + dynamicDeliveryCharge);
        if (localStorage.getItem("enDelChrRnd") === "true") {
          dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
        }

        this.setState({ delivery_charges: dynamicDeliveryCharge });
      } else {
        this.setState({
          delivery_charges: restaurant_info.base_delivery_charge,
        });
      }
    }
  };

  // Calculating total with/without coupon/tax
  getTotalAfterCalculation = () => {
    const { total, restaurant_info, coupon, tips } = this.props;
    let calc = 0;
    if (coupon.code) {
      if (coupon.discount_type === "PERCENTAGE") {
        let percentage_discount = formatPrice(
          (coupon.coupon_discount / 100) * parseFloat(total)
        );
        if (coupon.max_discount) {
          if (parseFloat(percentage_discount) >= coupon.max_discount) {
            percentage_discount = coupon.max_discount;
          }
        }

        this.props.couponApplied(coupon, percentage_discount);
        const saveCouponAppliedAmount = new Promise((resolve) => {
          localStorage.setItem("couponAppliedAmount", percentage_discount);
          resolve("Saved");
        });
        saveCouponAppliedAmount.then(() => {
          this.checkAndSetAppliedAmount();
        });

        calc = formatPrice(
          formatPrice(
            parseFloat(total) -
              percentage_discount +
              parseFloat(restaurant_info.store_charges || 0.0)
          )
        );
      } else {
        calc = formatPrice(
          parseFloat(total) -
            (parseFloat(coupon.coupon_discount) || 0.0) +
            (parseFloat(restaurant_info.store_charges) || 0.0)
        );
      }
    } else {
      calc = formatPrice(
        parseFloat(total) + parseFloat(restaurant_info.store_charges || 0.0)
      );
    }

    if (restaurant_info.tax && restaurant_info.tax > 0) {
      calc = formatPrice(
        parseFloat(
          parseFloat(calc) +
            parseFloat(parseFloat(restaurant_info.tax) / 100) * calc
        )
      );
    }

    // if (
    //   restaurant_info.convenience_fee &&
    //   restaurant_info.convenience_fee > 0
    // ) {
    //   calc = formatPrice(
    //     parseFloat(calc) + parseFloat(restaurant_info.convenience_fee)
    //   );
    // }

    // if (
    //   localStorage.getItem("userSelected") === "DELIVERY" &&
    //   restaurant_info.city &&
    //   restaurant_info.city.is_surge == 1 &&
    //   restaurant_info.city.surge_fee &&
    //   restaurant_info.city.surge_fee > 0
    // ) {
    //   calc = formatPrice(
    //     parseFloat(calc) + parseFloat(restaurant_info.city.surge_fee)
    //   );
    // }

    if (this.state.delivery_charges && this.state.delivery_charges > 0) {
      calc = formatPrice(
        parseFloat(calc) + parseFloat(this.state.delivery_charges || 0.0)
      );
    }

    // if (tips.value > 0) {
    //   calc = parseFloat(calc) + parseFloat(tips.value);
    // }

    return formatPrice(calc);
  };
  __getTax = () => {
    const { total, restaurant_info, coupon, tips } = this.props;
    let calc = 0;

    calc = formatPrice(
      parseFloat(
        // parseFloat(total) +
        parseFloat(parseFloat(restaurant_info.tax) / 100) * total
      )
    );
    return calc;
  };
  checkAndSetAppliedAmount = () => {
    let elem = "";
    if (localStorage.getItem("currencySymbolAlign") === "left") {
      elem =
        "(" +
        localStorage.getItem("currencyFormat") +
        localStorage.getItem("couponAppliedAmount") +
        ")";
    } else {
      elem =
        "(" +
        localStorage.getItem("couponAppliedAmount") +
        localStorage.getItem("currencyFormat") +
        ")";
    }

    if (this.refs.appliedAmount) {
      this.refs.appliedAmount.innerHTML = elem;
    }
  };

  render() {
    // console.log("LOADING - " + this.state.loading);

    const {
      user,
      total,
      restaurant_info,
      coupon,
      tips,
      removeTip,
      cartProducts,
    } = this.props;
    return (
      <React.Fragment>
        <div
          className="bg-white cart-checkout-block"
          style={{
            height:
              user.success && this.props.user_selected === "SELFPICKUP"
                ? "auto"
                : "35vh",
          }}
        >
          {user.success ? (
            <React.Fragment>
              <React.Fragment>
                <div className="px-15">
                  <div className="bg-white mb-20">
                    <div
                      style={{
                        // boxShadow: "rgb(136 136 136) 0px 0px 10px -3px",
                        borderRadius: "10px",
						padding:'25px'
                      }}
                    >
                      {/* <h2 className="bill-detail-text m-0">Payment Details</h2> */}
                      <div className="display-flex mb-1">
                        <div
                          className="flex-auto"
                          style={{ fontSize: "14px", fontWeight: "500" }}
                        >
                          Sub Total
                        </div>
                        <div
                          className="flex-auto text-right"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          <span className="mr-2">AED</span>
                          {formatPrice(total)}
                        </div>
                      </div>

                      {/* {restaurant_info.store_charges === "0.00" ||
                      restaurant_info.store_charges === null ? null : (
                        <React.Fragment>
                          <div className="display-flex mb-1">
                            <div className="flex-auto" style={{fontSize:'14px',fontWeight:'500'}}>Store Charge</div>
                            <div className="flex-auto text-right"   style={{fontSize:'16px',fontWeight:'600'}}>
                              <span className="mr-2">AED </span>
                              {restaurant_info.store_charges}
                            </div>
                          </div>
                        </React.Fragment>
                      )} */}
                      {/* {restaurant_info.convenience_fee === "0.00" ||
                      restaurant_info.convenience_fee === null ? null : (
                        <React.Fragment>
                          <div className="display-flex mb-1">
                            <div className="flex-auto">Convenience Fee</div>
                            <div className="flex-auto text-right"   style={{fontSize:'16px',fontWeight:'600'}}>
                              <span className=""> AED </span>
                              {restaurant_info.convenience_fee}
                            </div>
                          </div>
                        </React.Fragment>
                      )} */}
                      {this.state.delivery_charges === 0 ? null : (
                        <React.Fragment>
                          <div className="display-flex">
                            <div
                              className="flex-auto"
                              style={{ fontSize: "14px", fontWeight: "500" }}
                            >
                              Delivery Charge
                            </div>
                            <div
                              className="flex-auto text-right"
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              <span className="mr-2">AED</span>
                              {formatPrice(this.state.delivery_charges)}
                            </div>
                          </div>
                          {/* <div
                            className="mb-1 text-muted"
                            style={{ fontSize: "10px" }}
                          >
                            100% of the delivery fee will go to your Delivery
                            Partner
                          </div> */}
                        </React.Fragment>
                      )}

                      {coupon.code && (
                        <React.Fragment>
                          <div
                            className="display-flex mt-1 mb-1"
                            style={{ color: "#2AC503" }}
                          >
                            <div
                              className="flex-auto"
                              style={{ fontSize: "14px", fontWeight: "500" }}
                            >
                              Total Discount
                            </div>
                            <div
                              className="flex-auto text-right"
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              {/* <span>-</span> */}
                              {coupon.discount_type === "PERCENTAGE" ? (
                                <React.Fragment>
                                  {coupon.coupon_discount}%{" "}
                                  <span
                                    className="coupon-appliedAmount"
                                    ref="appliedAmount"
                                  >
                                    {this.checkAndSetAppliedAmount()}
                                  </span>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <span className="mr-2">AED</span>
                                  {coupon.coupon_discount}
                                </React.Fragment>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {/* {localStorage.getItem("userSelected") === "DELIVERY" &&
                      restaurant_info.city &&
                      restaurant_info.city.is_surge == 1 &&
                      restaurant_info.city.surge_fee &&
                      restaurant_info.city.surge_fee > 0 ? (
                        <React.Fragment>
                          <div className="display-flex mb-1">
                            <div className="flex-auto text-danger">
                              Rain Surge
                            </div>
                            <div className="flex-auto text-right text-danger">
                              <span className="rupees-symbol">₹ </span>
                              {restaurant_info.city.surge_fee}
                            </div>
                          </div>
                        </React.Fragment>
                      ) : null} */}
                      {restaurant_info.tax && restaurant_info.tax > 0 && (
                        <React.Fragment>
                          <div className="display-flex mb-1">
                            <div
                              className="flex-auto"
                              style={{ fontSize: "14px", fontWeight: "500" }}
                            >
                              Sale Tax
                            </div>
                            <div
                              className="flex-auto text-right "
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              {/* <span>+</span> */}
                              AED {this.__getTax()}
                            </div>
                          </div>
                        </React.Fragment>
                      )}

                      {/* {tips.value !== 0 && (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto">Delivery Tip</div>
										<div className="flex-auto text-right">
											<span className="rupees-symbol">₹ </span>{formatPrice(tips.value)}
											<br />
											<span onClick={removeTip}>
												<b style={{ fontSize: '10px', color: 'red' }}>Remove Tip</b>
											</span>
										</div>
									</div>
								</React.Fragment>
							)} */}

                      <hr className="checkout-division-hr"/>

                      <div className="display-flex">
                        <div className="flex-auto"    style={{ fontSize: "14px", fontWeight: "600" }}>Grand Total</div>
                        <div className="flex-auto text-right"  style={{ fontSize: "16px", fontWeight: "700" }}>
                          {/* Calculating total after coupon_discount coupon or without coupon_discount coupon */}
                          <span className="mr-2"   >AED </span>
                          {this.getTotalAfterCalculation()}
                        </div>
                      </div>
                      {this.props.user_selected === "SELFPICKUP" && (
                        <p className="my-2 mt-3 text-danger font-weight-bold">
                          {localStorage.getItem("selectedSelfPickupMessage")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
              <React.Fragment>
                {this.props.is_operational ? (
                  <div className="float-cart--open" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width:'90vw',
						marginLeft:'20px',
						padding:'10px'
						
                      }}>
                    {/* <div
                      
                    > */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "start",
                          flexDirection: "column",
                          color: "#fff",
                        }}
                      >
                        <div style={{ fontWeight: "400", fontSize: "14px" }}>
                          <span className="">{cartProducts.length} Item</span>
                          <span className="ml-4" style={{ color: "#FE0B15" }}>
                            <span className="rupees-symbol">₹</span>{" "}
                            {formatPrice(total)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "18px",
                            marginTop: "5px",
                          }}
                        >
                          AED {this.getTotalAfterCalculation()}
                        </div>
                      </div>
                      <div
                      onClick={this.processCart}

                        className="d-flex align-items-center p-10"
                        style={{
                          fontWeight: "600",
                          color: "#000",
                          backgroundColor: "#fff",
                          borderRadius: "100px",
						  position: "relative",

                        }}
                      >
                        <div>
                          <Buy primaryColor="#FF0000" />
                        </div>
                        <div className="ml-2">Checkout</div>
                      {/* </div> */}
                      <Ink duration={400} />

                    </div>
                    {/* <div
                      onClick={this.processCart}
                      className="btn btn-lg btn-continue"
                      style={{
                        backgroundColor: localStorage.getItem("storeColor"),
                        color: "white",
                        position: "relative",
                      }}
                    >
                      Proceed To Checkout
                      <Ink duration={400} />
                    </div> */}
                  </div>
                ) : (
                  <div className="auth-error bg-danger">
                    <div className="error-shake">Not Operational Now</div>
                  </div>
                )}
              </React.Fragment>
            </React.Fragment>
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
      </React.Fragment>
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
  coupon: state.coupon.coupon,
  restaurant_info: state.items.restaurant_info,
});

export default connect(mapStateToProps, {
  placeOrder,
  checkConfirmCart,
  checkCartItemsAvailability,
  addProduct,
  updateCart,
})(CartCheckoutBlock);
