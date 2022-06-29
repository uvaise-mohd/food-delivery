import React, { Component } from "react";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../services/user/actions";
import { ChevronLeft, TickSquare, Location } from "react-iconly";

import { addProduct } from "../../../services/cart/actions";
import { getSingleItem } from "../../../services/items/actions";
import { cancelOrder } from "../../../services/orders/actions";
import FloatCart from "../FloatCart";
import Moment from "react-moment";
import { WEBSITE_URL } from "../../../configs/website";
import { updateCart } from "../../../services/total/actions";
import OrderCancelPopup from "../Account/Orders/OrderList/OrderCancelPopup";
import { Link } from "react-router-dom";

class ViewOrder extends Component {
  state = {
    updatedUserInfo: false,
    show_delivery_details: false,
    sendBackToOrdersPage: false,
    loading: false,
  };
  static contextTypes = {
    router: () => null,
  };

  retryOrder = (order) => {
    this.setState({ loading: true }); // console.log(order.orderitems);

    order.orderitems.forEach((item) => {
      this.props.getSingleItem(item.item_id).then((response) => {
        if (response) {
          let addons = [];
          addons["selectedaddons"] = [];

          response.payload.quantity = item.quantity;
          if (item.order_item_addons.length > 0) {
            item.order_item_addons.forEach((addon) => {
              addons["selectedaddons"].push({
                addon_category_name: addon.addon_category_name,
                addon_id: addon.id,
                addon_name: addon.addon_name,
                price: addon.addon_price,
              });
            });
            response.payload.selectedaddons = addons["selectedaddons"];
          }
          // console.log(response.payload);
          this.addProduct(response.payload);
        }
      });
    });

    // this.props.loadCart();

    setTimeout(() => {
      this.context.router.history.push("/cart");
    }, 1000);
  };

  addProduct = (product) => {
    const { cartProducts, updateCart } = this.props;

    //get restaurant id and save to localStorage as active restaurant
    localStorage.setItem("activeRestaurant", product.restaurant_id);

    let productAlreadyInCart = false;
    cartProducts.forEach((cp) => {
      // first check if the restaurent id matches with items in cart
      // if restaurant id doesn't match, then remove all products from cart
      // then continue to add the new product to cart
      if (cp.restaurant_id === product.restaurant_id) {
        // then add the item to cart or increment count
        if (cp.id === product.id) {
          //check if product has customizations, and if the customization matches with any
          if (
            JSON.stringify(cp.selectedaddons) ===
            JSON.stringify(product.selectedaddons)
          ) {
            // increment the item quantity by 1
            cp.quantity += 1;
            productAlreadyInCart = true;
          }
        }
      } else {
        // else if restaurant id doesn't match, then remove all products from cart

        cartProducts.splice(0, cartProducts.length);
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }
    // veCoupon();
    // console.log(cartProducts);
    updateCart(cartProducts);
    //   this.openFloatCart();
  };
  __refreshOrderStatus = () => {
    const { user } = this.props;
    if (user.success) {
      // this.refs.refreshButton.setAttribute("disabled", "disabled");
      this.props.updateUserInfo(
        user.data.id,
        user.data.auth_token,
        this.props.match.params.unique_order_id
      );
      this.setState({ updatedUserInfo: true });
      // this.refs.btnSpinner.classList.remove("hidden");
      // setTimeout(() => {
      // 	if (this.refs.refreshButton) {
      // 		this.refs.btnSpinner.classList.add("hidden");
      // 	}
      // }, 2 * 1000);
      // setTimeout(() => {
      // 	if (this.refs.refreshButton) {
      // 		if (this.refs.refreshButton.hasAttribute("disabled")) {
      // 			this.refs.refreshButton.removeAttribute("disabled");
      // 		}
      // 	}
      // }, 2 * 1000);
    }
  };

  componentDidMount() {
    const { user } = this.props;

    if (user.success) {
      this.props.updateUserInfo(
        user.data.id,
        user.data.auth_token,
        this.props.match.params.unique_order_id
      );
    }

    this.refreshSetInterval = setInterval(() => {
      this.__refreshOrderStatus();
    }, 15 * 1000);
  }

  // getTime = (to) => {
  // 	var startDate = new Date();
  // 	// Do your operations
  // 	var endDate = moment(to);
  // 	var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

  // 	console.log(seconds)
  // 	return seconds;
  // }

  //   addProducts = (order) => {
  //     // console.log(order.orderitems)
  //     this.setState({ loading: true });

  //     const { addProduct } = this.props;

  //     Object.values(order.orderitems).forEach((item) => {
  //       this.props.getSingleItem(item.item_id).then((response) => {
  //         if (response) {
  //           response.payload.quantity = item.quantity;
  //           response.payload.addon_categories = item.order_item_addons;
  //           if (!response.payload.addon_categories.length) {
  //             // console.log(response.payload)
  //             addProduct(response.payload);
  //           }
  //         }
  //       });
  //     });

  //     setTimeout(() => {
  //       this.context.router.history.push("/cart");
  //     }, 2000);
  //   };

  componentWillReceiveProps(nextProps) {
    // if (nextProps.user.running_order === null) {
    // 	this.context.router.history.push("/my-orders");
    // }
    if (nextProps.user.delivery_details !== null) {
      this.setState({ show_delivery_details: true });
    }
  }

  __getDirectionToRestaurant = (restaurant_latitude, restaurant_longitude) => {
    // http://maps.google.com/maps?q=24.197611,120.780512
    const directionUrl =
      "http://maps.google.com/maps?q=" +
      restaurant_latitude +
      "," +
      restaurant_longitude;
    window.open(directionUrl, "_blank");
  };

  componentWillUnmount() {
    clearInterval(this.refreshSetInterval);
  }

  render() {
    if (window.innerWidth > 768) {
      return <Redirect to='/' />;
    }
    if (localStorage.getItem("storeColor") === null) {
      return <Redirect to={"/"} />;
    }
    const { user } = this.props;
    if (!user.success) {
      return <Redirect to={"/"} />;
    }

    const { cancelOrder } = this.props;

    return (
      <React.Fragment>
        <Meta ogtype="website" ogurl={window.location.href} />

        {this.state.loading && (
          <div className="height-100 overlay-loading ongoing-payment-spin">
            <div className="spin-load" />
          </div>
        )}

        <div className="bg-white" style={{ minHeight: "100vh" }}>
          <div
            className="d-flex align-items-center justify-content-center p-2"
            style={{
              border: "1px solid #BBBDC1",
              borderRadius: "8px",
              minHeight: "40px",
              minWidth: "40px",
              position: "absolute",
              top: "15px",
              left: "15px",
            }}
            onClick={() => this.context.router.history.push("/my-orders")}
          >
            <ChevronLeft primaryColor="#BBBDC1" />
          </div>
          <div
            className="text-center pt-15"
            style={{
              fontStyle: "normal",
              fontWeight: "700",
              fontSize: "16px",
              lineHeight: "40px",
              textAlign: "center",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#111A2C",
            }}
          >
            Order Details
          </div>
          {user.running_order && (
            <React.Fragment>
              <div className="p-4">
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    color: "#171725",
                  }}
                >
                  Order Status
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: "600",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      {user.running_order.orderstatus.name}
                    </div>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "14px",
                        lineHeight: "19px",
                        color: "#92929D",
                        marginTop: "10px",
                      }}
                    >
                      {" "}
                      <Moment format="MMM DD, hh:mm A">
                        {user.running_order.updated_at}
                      </Moment>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        padding: "13px",
                        background: user.running_order.orderstatus.color_code,
                        color: "white",
                        borderRadius: "10px",
                      }}
                    >
                      <TickSquare style={{ marginBottom: "-5px" }} />
                    </div>
                  </div>
                </div>
                <Link to={'/running-order/' + user.running_order.unique_order_id}>

                <div
                className=""
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "21px",
                    alignItems:'center',
                    backgroundColor:'#ff0000',
                    height:'60px',
                    borderRadius:'10px',
                    color:'#fff',
                    fontWeight:'600',
                    fontSize:'16px',
                    marginTop:'20px'
                  }}
                >
                  Track My Order
                </div>
                </Link>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    marginTop: "15px",
                    color: "#171725",
                  }}
                >
                  Overview
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "16px",
                        lineHeight: "22px",
                      }}
                    >
                      Order ID
                    </div>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "22px",
                        color: "#171725",
                        width: "65%",
                      }}
                    >
                      : {"   "} #{user.running_order.unique_order_id}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "16px",
                        lineHeight: "22px",
                      }}
                    >
                      Shop Name
                    </div>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "22px",
                        color: "#171725",
                        width: "65%",
                      }}
                    >
                      : {"   "}
                      {user.running_order.stores.name}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "16px",
                        lineHeight: "22px",
                      }}
                    >
                      Date
                    </div>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "22px",
                        color: "#171725",
                        width: "65%",
                      }}
                    >
                      : {"   "}
                      <Moment format="DD MMM YYYY">
                        {user.running_order.created_at}
                      </Moment>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "16px",
                        lineHeight: "22px",
                      }}
                    >
                      Notes
                    </div>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "22px",
                        color: "#171725",
                        width: "65%",
                      }}
                    >
                      : {"   "}
                      {user.running_order.order_comment
                        ? user.running_order.order_comment
                        : "No Notes"}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    marginTop: "15px",
                    color: "#171725",
                  }}
                >
                  Order Summary
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                    // display: "flex",
                    // justifyContent: "space-between",
                  }}
                >
                  {" "}
                  {user.running_order.orderitems.map((item) => (
                    <React.Fragment>
                      <div className="d-flex justify-content-between pl-10 pr-10 pt-10">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            {item.is_veg || item.is_egg ? (
                              <React.Fragment>
                                {item.is_veg ? (
                                  <img
                                    style={{ height: "1rem" }}
                                    src={WEBSITE_URL + "/assets/veg-icon.png"}
                                  />
                                ) : (
                                  <img
                                    style={{ height: "1rem" }}
                                    src={WEBSITE_URL + "/assets/egg-icon.png"}
                                  />
                                )}
                              </React.Fragment>
                            ) : (
                              <img
                                style={{ height: "1rem" }}
                                src={WEBSITE_URL + "/assets/non-veg-icon-2.png"}
                              />
                            )}
                          </div>
                          <div
                            className="ml-2"
                            style={{
                              fontWeight: "500",
                              fontSize: "14px",
                            }}
                          >
                            {item.name}
                          </div>
                        </div>
                        <div style={{ fontWeight: "600" }}>
                          <span>x{item.quantity}</span>
                        </div>
                        <div style={{ fontWeight: "600" }}>
                          AED {item.price}
                        </div>
                      </div>
                      <div
                        className="pr-10 ml-10"
                        style={{
                          color: "#979797",
                          fontSize: "10px",
                        }}
                      >
                        {item &&
                          item.order_item_addons.map((addonArray, index) => (
                            <React.Fragment
                              key={item.id + addonArray.id + index}
                            >
                              <div className="d-flex justify-content-between">
                                <div>{addonArray.addon_name}</div>
                                <div>AED {addonArray.addon_price}</div>
                              </div>
                            </React.Fragment>
                          ))}
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    marginTop: "15px",
                    color: "#171725",
                  }}
                >
                  Delivery
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                    display: "flex",
                    // justifyContent: "space-between",
                  }}
                >
                  <Location /> {"  "}
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "19px",
                      color: "#92929D",
                      marginLeft: "10px",
                    }}
                  >
                    {user.running_order.address}
                  </span>
                </div>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    marginTop: "15px",
                    color: "#171725",
                  }}
                >
                  Coupon
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="none"
                    viewBox="0 0 44 44"
                  >
                    <rect width="44" height="44" fill="red" rx="10" />
                    <path
                      fill="#fff"
                      d="M19 20a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Z"
                    />
                    <path
                      fill="#fff"
                      fill-rule="evenodd"
                      d="M14 29a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H14Zm6-12h10v1.535A3.998 3.998 0 0 0 28 22c0 1.48.804 2.773 2 3.465V27H20v-1a1 1 0 1 0-2 0v1h-4v-1.535A3.998 3.998 0 0 0 16 22c0-1.48-.804-2.773-2-3.465V17h4v1a1 1 0 1 0 2 0v-1Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {"  "}
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#171725",
                      marginLeft: "10px",
                    }}
                  >
                    {user.running_order.coupon_name
                      ? user.running_order.coupon_name
                      : "No coupon applied"}
                  </span>
                </div>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    marginTop: "15px",
                    color: "#171725",
                  }}
                >
                  Payment Method
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="none"
                    viewBox="0 0 44 44"
                  >
                    <rect width="44" height="44" fill="red" rx="10" />
                    <path
                      fill="#fff"
                      d="M17 23a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Z"
                    />
                    <path
                      fill="#fff"
                      fill-rule="evenodd"
                      d="M12 27a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H15a3 3 0 0 0-3 3v9Zm3-10a1 1 0 0 0-1 1v1h16v-1a1 1 0 0 0-1-1H15Zm14 11a1 1 0 0 0 1-1v-6H14v6a1 1 0 0 0 1 1h14Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {"  "}
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#171725",
                      marginLeft: "10px",
                    }}
                  >
                    {user.running_order.payment_mode == "COD"
                      ? "Cash On Delivery"
                      : "Online Payment"}
                  </span>
                </div>

                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "18px",
                    lineHeight: "25px",
                    letterSpacing: "0.1px",
                    marginTop: "15px",
                    color: "#171725",
                  }}
                >
                  Bill Summary
                </div>
                <div
                  style={{
                    border: "1px solid #EAEAEA",
                    padding: "17px",
                    borderRadius: "11px",
                    marginTop: "13px",
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  <div className="d-flex justify-content-between mb-4">
                    <div className="billtitle">Subtotal</div>
                    <div className="billsubtitle">
                      AED {user.running_order.sub_total}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-4">
                    <div className="billtitle">Delivery Charge</div>
                    <div className="billsubtitle">
                      AED {user.running_order.delivery_charge}
                    </div>
                  </div>

                  {user.running_order.coupon_name ? (
                    <div className="d-flex justify-content-between mb-4">
                      <div className="billtitle">Coupon Discounts</div>
                      <div className="billsubtitle">
                        - AED {user.running_order.coupon_amount}
                      </div>
                    </div>
                  ) : null}

                  <div className="d-flex justify-content-between mb-4">
                    <div className="billtitle">Taxes</div>
                    <div className="billsubtitle">
                      AED {user.running_order.tax}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-4">
                    <div
                      className="billtitle"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      Total
                    </div>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "bold",
                        fontSize: "16px",
                        lineHeight: "22px",
                        color: "black",
                      }}
                    >
                      AED {user.running_order.total}
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => this.retryOrder(user.running_order)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "21px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="374"
                  height="52"
                  fill="none"
                  viewBox="0 0 374 52"
                >
                  <path
                    fill="red"
                    d="M0 26C0 11.64 11.64 0 26 0h322c14.359 0 26 11.64 26 26s-11.641 26-26 26H26C11.64 52 0 40.36 0 26Z"
                  />
                  <path
                    fill="#fff"
                    d="M148.288 31.16c-1.088 0-2.043-.24-2.864-.72a4.92 4.92 0 0 1-1.888-2.016c-.448-.875-.672-1.899-.672-3.072 0-1.184.224-2.208.672-3.072a4.814 4.814 0 0 1 1.888-2c.811-.48 1.765-.72 2.864-.72s2.053.24 2.864.72a4.814 4.814 0 0 1 1.888 2c.448.864.672 1.883.672 3.056 0 1.184-.224 2.213-.672 3.088a4.92 4.92 0 0 1-1.888 2.016c-.811.48-1.765.72-2.864.72Zm0-1.76c1.035 0 1.84-.357 2.416-1.072.576-.715.864-1.707.864-2.976 0-1.28-.288-2.272-.864-2.976-.565-.704-1.371-1.056-2.416-1.056-1.035 0-1.84.352-2.416 1.056-.576.704-.864 1.696-.864 2.976 0 1.27.288 2.261.864 2.976.576.715 1.381 1.072 2.416 1.072Zm8.439 1.728c-.683 0-1.024-.341-1.024-1.024v-6.048c0-.672.325-1.008.976-1.008.65 0 .976.336.976 1.008v.496c.384-.917 1.205-1.43 2.464-1.536.458-.053.714.208.768.784.053.565-.224.88-.832.944l-.352.032c-1.312.128-1.968.8-1.968 2.016v3.312c0 .683-.336 1.024-1.008 1.024Zm8.224.032c-.683 0-1.285-.165-1.808-.496-.512-.33-.912-.8-1.2-1.408-.288-.619-.432-1.344-.432-2.176 0-.843.144-1.563.432-2.16.288-.608.688-1.077 1.2-1.408.523-.33 1.125-.496 1.808-.496.555 0 1.056.123 1.504.368.448.245.784.57 1.008.976V20.6c0-.672.331-1.008.992-1.008.672 0 1.008.336 1.008 1.008v9.504c0 .683-.331 1.024-.992 1.024s-.992-.341-.992-1.024v-.336c-.224.427-.56.768-1.008 1.024a3.113 3.113 0 0 1-1.52.368Zm.56-1.52c.597 0 1.077-.213 1.44-.64.363-.437.544-1.077.544-1.92 0-.853-.181-1.488-.544-1.904-.363-.427-.843-.64-1.44-.64s-1.077.213-1.44.64c-.363.416-.544 1.05-.544 1.904 0 .843.181 1.483.544 1.92.363.427.843.64 1.44.64Zm9.982 1.52c-.885 0-1.648-.165-2.288-.496-.64-.33-1.136-.8-1.488-1.408-.341-.608-.512-1.328-.512-2.16 0-.81.165-1.52.496-2.128a3.716 3.716 0 0 1 1.392-1.424c.597-.352 1.275-.528 2.032-.528 1.109 0 1.984.352 2.624 1.056.651.704.976 1.664.976 2.88 0 .395-.256.592-.768.592h-4.832c.149 1.397.949 2.096 2.4 2.096.277 0 .587-.032.928-.096.352-.075.683-.197.992-.368.277-.16.512-.208.704-.144a.582.582 0 0 1 .4.336.76.76 0 0 1 .032.576c-.053.203-.203.379-.448.528-.373.235-.805.41-1.296.528-.48.107-.928.16-1.344.16Zm-.288-6.784c-.587 0-1.061.181-1.424.544-.363.363-.581.853-.656 1.472h3.936c-.043-.65-.224-1.147-.544-1.488-.309-.352-.747-.528-1.312-.528Zm6.228 6.752c-.683 0-1.024-.341-1.024-1.024v-6.048c0-.672.325-1.008.976-1.008.65 0 .976.336.976 1.008v.496c.384-.917 1.205-1.43 2.464-1.536.458-.053.714.208.768.784.053.565-.224.88-.832.944l-.352.032c-1.312.128-1.968.8-1.968 2.016v3.312c0 .683-.336 1.024-1.008 1.024Zm12.361.032a3.494 3.494 0 0 1-1.52-.32 2.758 2.758 0 0 1-1.04-.896 2.253 2.253 0 0 1-.368-1.264c0-.576.149-1.03.448-1.36.299-.341.784-.587 1.456-.736.672-.15 1.573-.224 2.704-.224h.56v-.336c0-.533-.117-.917-.352-1.152-.235-.235-.629-.352-1.184-.352-.309 0-.645.037-1.008.112a5.382 5.382 0 0 0-1.12.384c-.256.117-.469.133-.64.048a.748.748 0 0 1-.352-.432.99.99 0 0 1 .032-.608c.085-.203.251-.352.496-.448.491-.203.96-.347 1.408-.432a6.888 6.888 0 0 1 1.248-.128c1.141 0 1.989.267 2.544.8.555.523.832 1.339.832 2.448v3.84c0 .683-.309 1.024-.928 1.024-.629 0-.944-.341-.944-1.024v-.352a2.225 2.225 0 0 1-.864 1.04c-.395.245-.864.368-1.408.368Zm.416-1.376c.523 0 .955-.181 1.296-.544.352-.363.528-.821.528-1.376v-.352h-.544c-1.003 0-1.701.08-2.096.24-.384.15-.576.427-.576.832 0 .352.123.64.368.864.245.224.587.336 1.024.336Zm9.506 4.256a8.709 8.709 0 0 1-1.68-.16 5.577 5.577 0 0 1-1.456-.496c-.256-.128-.411-.293-.464-.496a.849.849 0 0 1 .064-.56.821.821 0 0 1 .384-.4.686.686 0 0 1 .576.032c.469.235.912.384 1.328.448a6.44 6.44 0 0 0 1.088.112c1.429 0 2.144-.688 2.144-2.064v-1.072a2.447 2.447 0 0 1-1.04 1.04 3.1 3.1 0 0 1-1.536.384c-.704 0-1.317-.16-1.84-.48a3.316 3.316 0 0 1-1.216-1.376c-.288-.587-.432-1.27-.432-2.048 0-.779.144-1.456.432-2.032a3.209 3.209 0 0 1 1.216-1.36c.523-.33 1.136-.496 1.84-.496a3.21 3.21 0 0 1 1.536.368c.459.245.795.581 1.008 1.008v-.336c0-.33.085-.581.256-.752.181-.17.427-.256.736-.256.661 0 .992.336.992 1.008v6.16c0 1.27-.336 2.224-1.008 2.864-.672.64-1.648.96-2.928.96Zm-.048-4.752c.619 0 1.109-.213 1.472-.64.363-.427.544-1.008.544-1.744s-.181-1.312-.544-1.728c-.363-.427-.853-.64-1.472-.64s-1.109.213-1.472.64c-.363.416-.544.992-.544 1.728s.181 1.317.544 1.744c.363.427.853.64 1.472.64Zm8.732 1.872a3.494 3.494 0 0 1-1.52-.32 2.758 2.758 0 0 1-1.04-.896 2.253 2.253 0 0 1-.368-1.264c0-.576.15-1.03.448-1.36.299-.341.784-.587 1.456-.736.672-.15 1.574-.224 2.704-.224h.56v-.336c0-.533-.117-.917-.352-1.152-.234-.235-.629-.352-1.184-.352-.309 0-.645.037-1.008.112a5.382 5.382 0 0 0-1.12.384c-.256.117-.469.133-.64.048a.751.751 0 0 1-.352-.432.998.998 0 0 1 .032-.608c.086-.203.251-.352.496-.448.491-.203.96-.347 1.408-.432a6.888 6.888 0 0 1 1.248-.128c1.142 0 1.99.267 2.544.8.555.523.832 1.339.832 2.448v3.84c0 .683-.309 1.024-.928 1.024-.629 0-.944-.341-.944-1.024v-.352a2.225 2.225 0 0 1-.864 1.04c-.394.245-.864.368-1.408.368Zm.416-1.376c.523 0 .955-.181 1.296-.544.352-.363.528-.821.528-1.376v-.352h-.544c-1.002 0-1.701.08-2.096.24-.384.15-.576.427-.576.832 0 .352.123.64.368.864.246.224.587.336 1.024.336Zm6.85-8.208c-.373 0-.666-.09-.88-.272-.202-.192-.304-.453-.304-.784 0-.341.102-.603.304-.784.214-.181.507-.272.88-.272.79 0 1.184.352 1.184 1.056 0 .704-.394 1.056-1.184 1.056Zm0 9.536c-.32 0-.565-.096-.736-.288-.17-.192-.256-.459-.256-.8v-5.872c0-.725.331-1.088.992-1.088.672 0 1.008.363 1.008 1.088v5.872c0 .341-.085.608-.256.8-.17.192-.421.288-.752.288Zm4.179.016c-.662 0-.992-.341-.992-1.024v-6.048c0-.672.325-1.008.976-1.008.65 0 .976.336.976 1.008v.336a2.67 2.67 0 0 1 1.072-1.024c.458-.235.97-.352 1.536-.352 1.845 0 2.768 1.072 2.768 3.216v3.872c0 .683-.331 1.024-.992 1.024-.672 0-1.008-.341-1.008-1.024v-3.776c0-.608-.118-1.05-.352-1.328-.224-.277-.576-.416-1.056-.416-.587 0-1.056.187-1.408.56-.342.363-.512.848-.512 1.456v3.504c0 .683-.336 1.024-1.008 1.024Z"
                  />
                </svg>
              </div>
              {user.running_order.order_status_id == 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "21px",
                  }}
                >
                  <OrderCancelPopup
                    order={user.running_order}
                    user={user}
                    cancelOrder={cancelOrder}
                  />
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  cancel: state.orders.cancel,
  cartProducts: state.cart.products,
});

export default connect(mapStateToProps, {
  updateUserInfo,
  addProduct,
  getSingleItem,
  cancelOrder,
  updateCart,
})(ViewOrder);
