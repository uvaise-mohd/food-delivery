import React, { Component } from "react";

import {
  checkUserRunningOrder,
  updateUserInfo,
  checkBan,
} from "../../../services/user/actions";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import BillDetails from "./BillDetails";
import CartCheckoutBlock from "./CartCheckoutBlock";
import CartItems from "./CartItems";
import Coupon from "./Coupon";
import DelayLink from "../../helpers/delayLink";
import Footer from "../Footer";
import Ink from "react-ink";
import Meta from "../../helpers/meta";
import OrderComment from "./OrderComment";
import { Redirect } from "react-router";
import RestaurantInfoCart from "./RestaurantInfoCart";
import { calculateDistance } from "../../helpers/calculateDistance";
import calculateDistanceGoogle from "../../helpers/calculateDistanceGoogle.js";
import { connect } from "react-redux";
import {
  getRestaurantInfoById,
  getRestaurantInfoAndOperationalStatus,
} from "../../../services/items/actions";
import { updateCart } from "../../../services/total/actions";
import { formatPrice } from "../../helpers/formatPrice";
import { addProduct } from "../../../services/cart/actions";
import { ChevronLeft, TimeCircle } from "react-iconly";
import { checkCartItemsAvailability } from "../../../services/confirmCart/actions";
import { GoogleApiWrapper } from "google-maps-react";
import Loading from "../../helpers/loading";
import UserBan from "../UserBan";
import { removeCoupon } from "../../../services/coupon/actions";
import Swing from "react-reveal/Swing";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import { ChevronRight } from "react-iconly";
import Fade from "react-reveal/Fade";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import Moment from "react-moment";
import FeatherIcon from "feather-icons-react";
import DeliveryLocation from "./DeliveryLocation";

class Cart extends Component {
  static contextTypes = {
    router: () => null,
  };

  state = {
    loading: true,
    alreadyRunningOrders: false,
    is_operational_loading: true,
    is_operational: true,
    distance: 0,
    is_active: false,
    min_order_satisfied: false,
    process_cart_loading: false,
    is_all_items_available: false,
    process_distance_calc_loading: false,
    userBan: false,
    tips: [],
    tips_percentage: [],
    tipsPercentageSetting: false,
    tipsAmountSetting: false,
    others: false,
    percentage: false,
    selectedTips: {
      type: "amount",
      value: 0,
    },
    is_tips_show: true,
    self_confirm: false,
    schedule_modal: false,
    date: null,
    time: null,
    message: null,
    min_qnt_message: false,
    max_qnt_message: false,
    item: null,
  };

  componentDidMount() {
    //remove tip on reload/first-load
    localStorage.removeItem("cart_tips");
    localStorage.removeItem("fromCart");
    localStorage.removeItem("schedule_date");
    localStorage.removeItem("schedule_time");

    localStorage.setItem("userSelected", "DELIVERY");

    const { user, cartProducts } = this.props;
    if (user.success) {
      this.props.checkBan(user.data.auth_token).then((response) => {
        if (response) {
          if (!response.success) {
            this.setState({ userBan: true, loading: false });
          } else {
            this.cartOperationalSteps();
          }
        } else {
          setTimeout(() => {
            this.fetchCheckBanAgain(user.data.auth_token);
          }, 2500);
        }
      });

      this.setState({
        tips:
          localStorage.getItem("tips") !== null &&
          localStorage.getItem("tips").split(","),
        tips_percentage:
          localStorage.getItem("tips_percentage") !== null &&
          localStorage.getItem("tips_percentage").split(","),
        tipsAmountSetting:
          localStorage.getItem("showTipsAmount") !== null &&
          JSON.parse(localStorage.getItem("showTipsAmount").toLowerCase()),
        tipsPercentageSetting:
          localStorage.getItem("showTipsPercentage") !== null &&
          JSON.parse(localStorage.getItem("showTipsPercentage").toLowerCase()),
      });

      console.log(localStorage.getItem("userSelected"));
      if (localStorage.getItem("userSelected") === "SELFPICKUP") {
        this.setState({ is_tips_show: true });
      } else {
        this.setState({ is_tips_show: false });
      }
    } else {
      this.cartOperationalSteps();
    }

    if (!cartProducts.length) {
      this.setState({ min_order_satisfied: true });
    }
  }

  openConfirmSelf = () => {
    this.setState({ self_confirm: true });
  };

  handleClose = () => {
    this.setState({ self_confirm: false });
  };

  fetchCheckBanAgain = (token) => {
    this.props.checkBan(token).then((response) => {
      if (response) {
        if (!response.success) {
          this.setState({ userBan: true, loading: false });
        } else {
          this.cartOperationalSteps();
        }
      }
    });
  };

  cartOperationalSteps = () => {
    const { user } = this.props;

    this.setState({ loading: false });
    if (this.props.cartProducts.length) {
      document.getElementsByTagName("body")[0].classList.add("bg-white");
      this.checkForItemsAvailability();
    }

    if (
      localStorage.getItem("activeRestaurant") !== null &&
      this.props.cartProducts.length > 0
    ) {
      this.props
        .getRestaurantInfoById(localStorage.getItem("activeRestaurant"))
        .then((response) => {
          if (response) {
            if (response.payload.id) {
              if (!user.success) {
                this.__doesRestaurantOperatesAtThisLocation(response.payload);
              }
            }
          }
        });
    }

    if (user.success) {
      this.props.checkUserRunningOrder(user.data.id, user.data.auth_token);
      if (this.props.cartProducts.length > 0) {
        this.props
          .updateUserInfo(user.data.id, user.data.auth_token)
          .then((updatedUser) => {
            // console.log("THIS SHOULD BE CALLED: UPDATED USER", updatedUser);
            if (typeof updatedUser !== "undefined") {
              if (updatedUser.payload.data.default_address !== null) {
                const userSetAddress = {
                  lat: updatedUser.payload.data.default_address.latitude,
                  lng: updatedUser.payload.data.default_address.longitude,
                  address: updatedUser.payload.data.default_address.address,
                  house: updatedUser.payload.data.default_address.house,
                  tag: updatedUser.payload.data.default_address.tag,
                };

                const saveUserSetAddress = new Promise((resolve) => {
                  localStorage.setItem(
                    "userSetAddress",
                    JSON.stringify(userSetAddress)
                  );
                  resolve("Address Saved");
                });
                saveUserSetAddress.then(() => {
                  this.__doesRestaurantOperatesAtThisLocation(
                    this.props.restaurant_info
                  );
                });
                // localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
              } else {
                this.__doesRestaurantOperatesAtThisLocation(
                  this.props.restaurant_info
                );
              }
            } else {
              console.warn(
                "Failed to fetch update user info... Solution: Reload Page"
              );
            }
          });
      }
    } else {
      this.setState({ alreadyRunningOrders: false });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.restaurant_info.id) {
      this.__isRestaurantActive(nextProps.restaurant_info);

      this.__checkMinOrderSatisfied(
        nextProps.restaurant_info,
        nextProps.cartTotal
      );
      this.__checkMinMaxQuantity();
    }

    if (nextProps.running_order) {
      this.setState({ alreadyRunningOrders: true });
    }
    if (nextProps.force_reload) {
      this.setState({ loading: true });
      window.location.reload();
    }
  }

  addProductQuantity = (product) => {
    const { cartProducts, updateCart } = this.props;
    let productAlreadyInCart = false;

    cartProducts.forEach((cp) => {
      if (cp.id === product.id) {
        if (
          JSON.stringify(cp.selectedaddons) ===
          JSON.stringify(product.selectedaddons)
        ) {
          cp.quantity += 1;
          productAlreadyInCart = true;
        }
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }

    updateCart(cartProducts);
  };

  removeProductQuantity = (product) => {
    const { cartProducts, updateCart } = this.props;

    const index = cartProducts.findIndex(
      (p) =>
        p.id === product.id && JSON.stringify(p) === JSON.stringify(product)
    );
    //if product is in the cart then index will be greater than 0
    if (index >= 0) {
      cartProducts.forEach((cp) => {
        if (cp.id === product.id) {
          if (JSON.stringify(cp) === JSON.stringify(product)) {
            if (cp.quantity === 1) {
              //if quantity is 1 then remove product from cart
              cartProducts.splice(index, 1);
            } else {
              //else decrement the quantity by 1
              cp.quantity -= 1;
            }
          }
        }
      });

      updateCart(cartProducts);
      this.props.removeCoupon();
    }
  };

  removeProduct = (product) => {
    // console.log(product);
    // console.log(product.id);

    const { cartProducts, updateCart } = this.props;
    const index = cartProducts.findIndex((cp) => cp.id === product.id);

    // console.log(index);
    cartProducts.splice(index, 1);
    // console.log(cartProducts);
    updateCart(cartProducts);
    this.props.removeCoupon();
    this.checkForItemsAvailability();
  };

  __doesRestaurantOperatesAtThisLocation = (restaurant_info) => {
    //send user lat long to helper, check with the current restaurant lat long and setstate accordingly
    const { user } = this.props;

    if (user.success && user.data.default_address !== null) {
      let self = this;
      let distance = 0;
      if (localStorage.getItem("enGDMA") === "true") {
        this.setState({ process_distance_calc_loading: true });
        distance = calculateDistanceGoogle(
          restaurant_info.longitude,
          restaurant_info.latitude,
          user.data.default_address.longitude,
          user.data.default_address.latitude,
          this.props.google,
          function(distance) {
            console.log("Distance:", distance);
            self.setState(
              { distance: distance, process_distance_calc_loading: false },
              // self.__processRestaurantOperationalState(distance, restaurant_info)
              self.__processRestaurantOperationalState(
                restaurant_info.id,
                user.data.default_address.latitude,
                user.data.default_address.longitude,
                distance
              )
            );
          }
        );
      } else {
        distance = calculateDistance(
          restaurant_info.longitude,
          restaurant_info.latitude,
          user.data.default_address.longitude,
          user.data.default_address.latitude
        );
        this.setState(
          { distance: distance },
          this.__processRestaurantOperationalState(
            restaurant_info.id,
            user.data.default_address.latitude,
            user.data.default_address.longitude,
            distance
          )
        );
      }
    } else {
      //if Google Distance Matrix API is enabled
      let self = this;
      let distance = 0;
      if (localStorage.getItem("userSetAddress") !== null) {
        if (localStorage.getItem("enGDMA") === "true") {
          distance = calculateDistanceGoogle(
            restaurant_info.longitude,
            restaurant_info.latitude,
            JSON.parse(localStorage.getItem("userSetAddress")).lng,
            JSON.parse(localStorage.getItem("userSetAddress")).lat,
            this.props.google,
            function(distance) {
              console.log(distance);
              self.setState(
                { distance: distance },
                self.__processRestaurantOperationalState(
                  restaurant_info.id,
                  JSON.parse(localStorage.getItem("userSetAddress")).lat,
                  JSON.parse(localStorage.getItem("userSetAddress")).lng,
                  distance
                )
              );
            }
          );
        } else {
          distance = calculateDistance(
            restaurant_info.longitude,
            restaurant_info.latitude,
            JSON.parse(localStorage.getItem("userSetAddress")).lng,
            JSON.parse(localStorage.getItem("userSetAddress")).lat
          );
          this.setState(
            { distance: distance },
            this.__processRestaurantOperationalState(
              restaurant_info.id,
              JSON.parse(localStorage.getItem("userSetAddress")).lat,
              JSON.parse(localStorage.getItem("userSetAddress")).lng,
              distance
            )
          );
        }
      } else {
        this.setState({
          is_operational: true,
          is_operational_loading: false,
        });
      }

      console.log("Distance -> ", this.state.distance);
    }
  };

  __processRestaurantOperationalState = (id, lat, lng, dis) => {
    const { restaurant_info } = this.props;

    if (restaurant_info) {
      if (parseFloat(dis) > parseFloat(restaurant_info.delivery_radius)) {
        this.setState({
          is_operational: false,
          is_operational_loading: false,
        });
      } else {
        this.setState({
          is_operational: true,
          is_operational_loading: false,
        });
      }
    }

    // this.props.getRestaurantInfoAndOperationalStatus(id, lat, lng).then((response) => {
    // 	if (response) {
    // 		if (response.payload.is_operational) {
    // 			this.setState({
    // 				is_operational: true,
    // 				is_operational_loading: false,
    // 			});
    // 		} else {
    // 			this.setState({
    // 				is_operational: false,
    // 				is_operational_loading: false,
    // 			});
    // 		}
    // 	}
    // });
  };

  __isRestaurantActive = (restaurant_info) => {
    if (restaurant_info.is_active) {
      this.setState({
        is_active: true,
      });
    }
  };

  __checkMinOrderSatisfied = (restaurant_info, cartTotal) => {
    if (restaurant_info.min_order_price > 0) {
      //if not null, then check the min order price with the order total
      const totalPrice = parseFloat(formatPrice(cartTotal.totalPrice));
      const minOrderPrice = parseFloat(
        formatPrice(restaurant_info.min_order_price)
      );
      if (totalPrice >= minOrderPrice) {
        // console.log("Order Can Be Placed", totalPrice + " -- " + minOrderPrice);
        this.setState({ min_order_satisfied: true });
      } else {
        // console.log("Order CANNOT Be Placed", totalPrice + " -- " + minOrderPrice);
        this.setState({ min_order_satisfied: false });
      }
    } else {
      // if null, then set to satisfied to true...
      // console.log("Min order price is not set");
      this.setState({ min_order_satisfied: true });
    }
  };

  __checkMinMaxQuantity = () => {
    const { cartProducts } = this.props;
    if (cartProducts) {
      cartProducts.forEach((item) => {
        if (item.max_quantity) {
          if (item.quantity > item.max_quantity) {
            this.setState({ item: item });
            setTimeout(() => {
              this.setState({ max_qnt_message: true });
            }, 100);
          } else {
            this.setState({ max_qnt_message: false });
          }
        }

        if (item.min_quantity) {
          if (item.quantity < item.min_quantity) {
            this.setState({ item: item });
            setTimeout(() => {
              this.setState({ min_qnt_message: true });
            }, 100);
          } else {
            this.setState({ min_qnt_message: false });
          }
        }
      });
    } else {
      this.setState({ min_qnt_message: false, max_qnt_message: false });
    }
  };

  checkForItemsAvailability = () => {
    const {
      checkCartItemsAvailability,
      cartProducts,
      addProduct,
      updateCart,
    } = this.props;
    this.handleProcessCartLoading(true);
    checkCartItemsAvailability(cartProducts).then((response) => {
      this.handleProcessCartLoading(false);
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
            if (!arrItem.is_active && arrItem.is_deleted) {
              isSomeInactive = true;
            }
          }
          return item;
        });
        if (isSomeInactive) {
          this.handleItemsAvailability(false);
        } else {
          this.handleItemsAvailability(true);
        }
      }
      updateCart(this.props.cartProducts);
    });
  };

  handleProcessCartLoading = (value) => {
    this.setState({ process_cart_loading: value });
  };

  handleItemsAvailability = (value) => {
    this.setState({ is_all_items_available: value });
  };

  onChange = (date) => this.setState({ date });

  onTime = (time) => this.setState({ time });

  setSchedule = () => {
    if (this.state.date && this.state.time) {
      // Check correct time format and split into components
      this.state.time = this.state.time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [this.state.time];

      if (this.state.time.length > 1) {
        // If time format correct
        this.state.time = this.state.time.slice(1); // Remove full string match value
        this.state.time[5] = +this.state.time[0] < 12 ? " AM" : " PM"; // Set AM/PM
        this.state.time[0] = +this.state.time[0] % 12 || 12; // Adjust hours
      }
      let t = this.state.time.join("");

      localStorage.setItem("schedule_date", this.state.date);
      localStorage.setItem("schedule_time", t);

      this.setState({ schedule_modal: false, time: t });
    }
  };

  showOtherText = (type) => {
    localStorage.setItem("cart_tips", JSON.stringify({ type: type, value: 0 }));
    this.setState({
      others: type === "total",
      percentage: type === "percentage",
      selectedTips: { type: type, value: 0 },
    });
  };

  addTip = (type, value) => {
    localStorage.setItem(
      "cart_tips",
      JSON.stringify({ type: type, value: value })
    );
    //localStorage.setItem("cart_tips", JSON.stringify({ type : value});
    this.setState({
      others: false,
      percentage: false,
      selectedTips: { type: type, value: value },
    });
  };

  addTipInPercentage = (type, value) => {
    let calculatedValue = (this.props.cartTotal.totalPrice * value) / 100;
    localStorage.setItem(
      "cart_tips",
      JSON.stringify({ type: type, value: calculatedValue })
    );
    //localStorage.setItem("cart_tips", JSON.stringify({ type : value});
    this.setState({
      others: false,
      percentage: false,
      selectedTips: { type: type, value: calculatedValue },
    });
  };
  // onInputchange = (event) => {
  // 	this.setState({
  // 		[event.target.name]: event.target.value,
  // 		selectedTips: { type: event.target.name, value: event.target.value },
  // 	});
  // 	// localStorage.setItem("orderComment", event.target.value);
  // };
  restrictAlphabates = (e) => {
    const re = /^[0-9\b]+$/;
    // let value = e.target.value;
    let { value, min, max } = e.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));

    if (e.target.value === "" || re.test(e.target.value)) {
      if (e.target.name === "percentageValue" && value !== "") {
        let calculatedValue = (this.props.cartTotal.totalPrice * value) / 100;
        localStorage.setItem(
          "cart_tips",
          JSON.stringify({ type: "percentage", value: calculatedValue })
        );
        this.setState({
          [e.target.name]: value,
          selectedTips: { type: e.target.name, value: calculatedValue },
        });
      }
      if (e.target.name === "flatAmount" && value !== "") {
        localStorage.setItem(
          "cart_tips",
          JSON.stringify({ type: "total", value: value })
        );
        this.setState({
          [e.target.name]: value,
          selectedTips: { type: e.target.name, value: value },
        });
      }
    }

    this.setState({ value });
  };

  removeTip = () => {
    this.setState({
      others: false,
      percentage: false,
      selectedTips: { type: "amount", value: 0 },
    });
    localStorage.removeItem("cart_tips");

    this.setState(
      { tipsAmountSetting: false, tipsPercentageSetting: false },
      () => {
        this.setState({
          tipsAmountSetting: JSON.parse(
            localStorage.getItem("showTipsAmount").toLowerCase()
          ),
          tipsPercentageSetting: JSON.parse(
            localStorage.getItem("showTipsPercentage").toLowerCase()
          ),
        });
      }
    );
  };

  handlePopupOpen = (content) => {
    this.setState({ schedule_modal: true });
  };

  handlePopupClose = () => {
    this.setState({ schedule_modal: false });
  };

  componentWillUnmount() {
    document.getElementsByTagName("body")[0].classList.remove("bg-grey");
    //if cart not confirmed, then remove tip
    if (!this.props.confirmCart) {
      localStorage.removeItem("cart_tips");
    }
  }

  render() {
    const handleDelivery = (event) => {
      window.location.reload();
    };

    const handleSelfpickup = (event) => {
      this.setState({ self_confirm: false });
      localStorage.setItem("userSelected", "SELFPICKUP");
      this.setState({ is_tips_show: true });
      this.removeTip();
      this.forceUpdate();
    };

    if (this.state.userBan) {
      return <UserBan />;
    }
    if (window.innerWidth > 768) {
      return <Redirect to="/" />;
    }
    if (!this.props.cartProducts.length) {
      document.getElementsByTagName("body")[0].classList.remove("bg-grey");
    }
    const { cartTotal, cartProducts, restaurant_info, user } = this.props;
    // console.log(this.state.time)

    return (
      <React.Fragment>
        <Meta ogtype="website" ogurl={window.location.href} />

        {/* <Dialog
          fullWidth={true}
          fullScreen={false}
          open={this.state.self_confirm}
          onClose={this.handleClose}
          style={{ width: "90vw", margin: "auto" }}
          PaperProps={{
            style: {
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "20px",
            },
          }}
        >
          <div className="text-center">
            <p>
              You will have to pick-Up the Order yourself from The Restaurant.
              The Order won't be Delivered to your Location
            </p>
            <div
              className="p-10"
              style={{
                borderRadius: "10px",
                fontWeight: "bolder",
                color: "white",
                letterSpacing: "1px",
                backgroundColor: localStorage.getItem("storeColor"),
              }}
              onClick={handleSelfpickup}
            >
              OK
            </div>
          </div>
        </Dialog> */}
        {cartProducts && cartProducts.length !== 0 && (
          <>
            {!this.state.min_order_satisfied && (
              <div className="auth-error no-click">
                <div className="error-shake">
                  Min cart value should be atleast{" "}
                  <span className="rupees-symbol">₹ </span>
                  {this.props.restaurant_info.min_order_price}
                </div>
              </div>
            )}

            {this.state.min_qnt_message && (
              <div className="auth-error no-click">
                <div className="error-shake">
                  Min cart quantity for {this.state.item.name} is{" "}
                  {this.state.item.min_quantity}
                </div>
              </div>
            )}

            {this.state.max_qnt_message && (
              <div className="auth-error no-click">
                <div className="error-shake">
                  Max cart quantity for {this.state.item.name} is{" "}
                  {this.state.item.max_quantity}
                </div>
              </div>
            )}
          </>
        )}

        {/* {this.state.schedule_modal == true && (
          <React.Fragment>
            <div
              style={{
                paddingLeft: "5%",
                paddingRight: "5%",
                height: "100%",
                width: "100%",
                bottom: "0px",
                zIndex: "9998",
                position: "fixed",
                backgroundColor: "#000000a6",
              }}
            >
              <Fade bottom>
                <div
                  className="bg-white"
                  style={{
                    height: "auto",
                    left: "0",
                    width: "100%",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "20px",
                    paddingBottom: "100px",
                    bottom: "0px",
                    position: "fixed",
                    zIndex: "9999",
                    borderTopLeftRadius: "2rem",
                    borderTopRightRadius: "2rem",
                  }}
                >
                  <div
                    className="d-flex justify-content-end"
                    onClick={this.handlePopupClose}
                  >
                    Close
                  </div>
                  <div className="font-w600">Date</div>
                  <div className="mt-10 ml-10 mr-20">
                    <DatePicker
                      onChange={this.onChange}
                      value={this.state.date}
                      clearIcon={null}
                      minDate={new Date()}
                    />
                  </div>
                  <div className="font-w600 mt-20">Time</div>
                  <div className="mt-10 ml-10 mr-20">
                    <TimePicker
                      onChange={this.onTime}
                      value={this.state.time}
                      clearIcon={null}
                    />
                  </div>

                  <div
                    onClick={this.setSchedule}
                    className="btn btn-lg btn-continue"
                    style={{
                      backgroundColor: localStorage.getItem("storeColor"),
                      color: "white",
                      position: "relative",
                    }}
                  >
                    Schedule
                    <Ink duration={400} />
                  </div>
                </div>
              </Fade>
            </div>
          </React.Fragment>
        )} */}

        {(this.state.loading ||
          this.state.process_distance_calc_loading ||
          this.state.process_cart_loading) && (
          <div className="height-100 overlay-loading ongoing-payment-spin">
            <div className="spin-load" />
          </div>
        )}

        {!this.state.loading && (
          <React.Fragment>
            <div
              className={` ${
                localStorage.getItem("userSelected") === "DELIVERY"
                  ? "bg-white"
                  : "bg-white"
              }`}
            >
              <div className="d-flex flex-row align-items-center justify-content-between pl-15 pr-15 pt-15">
                <div
                  className="d-flex align-items-center justify-content-center p-2"
                  style={{
                    // position: "absolute",
                    // top: "15px",
                    // left: "15px",
                    border: "1px solid #BBBDC1",
                    borderRadius: "8px",
                    minHeight: "40px",
                    minWidth: "40px",
                  }}
                  onClick={() => this.context.router.history.goBack()}
                >
                  <ChevronLeft primaryColor="#BBBDC1" />
                </div>
                <div
                  //   className="text-center pt-15"
                  style={{ fontSize: "16px", fontWeight: "600" }}
                >
                  MY CART
                </div>
                <div
                  className="d-flex align-items-center justify-content-center p-2"
                  style={{
                    // position: "absolute",
                    // top: "15px",
                    // left: "15px",
                    border: "1px solid #BBBDC1",
                    borderRadius: "8px",
                    minHeight: "40px",
                    minWidth: "40px",
                    backgroundColor: "rgb(255, 108, 68,0.2)",
                    // opacity: "20%",
                  }}
                  // onClick={() => this.context.router.history.goBack()}
                >
                  <div>
                    <div style={{ position: "relative" }}>
                      <FeatherIcon icon="shopping-bag" size={18} />
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          position: "absolute",
                          top: "-5px",
                          height: "14px",
                          width: "14px",
                          borderRadius: "100px",
                          backgroundColor: "red",
                          fontSize: "8px",
                          color: "#fff",
                          right: "-5px",
                        }}
                      >
                        {cartProducts.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white" style={{ height: "100vh" }}>
              <DeliveryLocation />
              {cartProducts.length ? (
                <React.Fragment>
                  <div className=" pl-15 pr-15 pt-15">
                    {cartProducts.map((item, index) => (
                      <CartItems
                        item={item}
                        addProductQuantity={this.addProductQuantity}
                        removeProductQuantity={this.removeProductQuantity}
                        removeProduct={this.removeProduct}
                        key={item.name + item.id + index}
                      />
                    ))}
                    {/* <RestaurantInfoCart restaurant={restaurant_info} /> */}
                    {/* <div className="p-15 mt-20">
                    <div
                      className="block-content block-content-full bg-white"
                      style={{
                        boxShadow: "rgb(136 136 136) 0px 0px 10px -3px",
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bolder",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="mb-10"
                      >
                        <div>{restaurant_info.name}</div>
                        <div
                          style={{
                            fontWeight: "500",
                            color: "#006FFF",
                            fontSize: "12px",
                          }}
                        >
                          <DelayLink to={"/stores/" + restaurant_info.slug}>
                            + Add More
                          </DelayLink>
                        </div>
                      </div>
                 
                      <hr style={{ borderTop: "1px dashed #C9C9C9" }} />
                      <OrderComment />
                    </div>
                  </div> */}

                    <div>
                      {user && user.success && (
                        <Coupon subtotal={this.props.cartTotal.totalPrice} />
                      )}
                    </div>
                    {/* <div>
                      <BillDetails
                        total={cartTotal.totalPrice}
                        distance={this.state.distance}
                        alreadyRunningOrders={this.state.alreadyRunningOrders}
                        tips={this.state.selectedTips}
                        removeTip={this.removeTip}
                        user_selected={localStorage.getItem("userSelected")}
                      />
                    </div> */}

                    {/* {this.state.alreadyRunningOrders && (
											<div className="px-15">
												<div className="auth-error ongoing-order-notify">
													<DelayLink to="/my-orders" delay={250} className="ml-2">
														{localStorage.getItem("ongoingOrderMsg")}{" "}
														<i
															className="si si-arrow-right ml-1"
															style={{
																fontSize: "0.7rem",
															}}
														/>
														<Ink duration="500" />
													</DelayLink>
												</div>
											</div>
										)} */}
                  </div>

                  {/* {(this.state.tipsAmountSetting ||
                    this.state.tipsPercentageSetting) && (
                    <div
                      className="mx-15 mb-15"
                      style={{
                        boxShadow: "rgb(136 136 136) 0px 0px 10px -3px",
                        borderRadius: "10px",
                      }}
                    >
                      {this.state.tips && this.state.is_tips_show === false && (
                        <div
                          className="block-content block-content-full bg-white pt-10 pb-5"
                          style={{ borderRadius: "10px" }}
                        >
                          <div
                            className={
                              !this.state.tipsAmountSetting &&
                              !this.state.tipsPercentageSetting
                                ? "d-none"
                                : "d-show"
                            }
                          >
                            <p
                              style={{
                                marginBottom: "2px",
                                paddingBottom: "2px",
                              }}
                              className="item-text"
                            >
                              <strong>Make Your Delivery Boy Happy</strong>
                            </p>
                            <p className="mb-0">
                              Thank your delivery partner for helping you stay
                              safe indoors. Support them through these tough
                              times with a tip.
                            </p>
                            <div
                              className="mb-2 text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              100% of the tip will go to your Delivery Partner
                            </div>
                          </div>
                          {this.state.tipsAmountSetting && (
                            <div className="tip-switch-field">
                              {this.state.tips.map((tipAmount, index) => (
                                <div key={index} className="tips">
                                  <input
                                    type="radio"
                                    value={tipAmount}
                                    id={index}
                                    name="switch-two"
                                    onClick={() =>
                                      this.addTip("amount", tipAmount)
                                    }
                                  />
                                  <label
                                    htmlFor={index}
                                    className={` ${index > 0 && "ml-5"}`}
                                  >
                                    <span className="rupees-symbol">₹ </span>
                                    {tipAmount}
                                  </label>
                                </div>
                              ))}
                              <div className="tips">
                                <input
                                  type="radio"
                                  value="other"
                                  id="others"
                                  name="switch-two"
                                  onClick={(event) =>
                                    this.showOtherText("total")
                                  }
                                />
                                <label htmlFor="others" className="ml-5">
                                  Other
                                </label>
                              </div>
                            </div>
                          )}
                          {this.state.others && (
                            <input
                              className="form-control custom-tip-input mb-15"
                              name="flatAmount"
                              type="text"
                              placeholder="Tip Amount"
                              value={this.state.flatAmount || ""}
                              onChange={this.restrictAlphabates}
                              onKeyPress={this.restrictAlphabates}
                              min="0"
                              max="10000"
                            />
                          )}
                          {this.state.tipsPercentageSetting && (
                            <div className="tip-switch-field">
                              {this.state.tips_percentage.map(
                                (tipPercentage, index) => (
                                  <div key={index} className="tips_percentage">
                                    <input
                                      type="radio"
                                      value={tipPercentage}
                                      id={`${index}_tips_percentage`}
                                      name="switch-two"
                                      onClick={() =>
                                        this.addTipInPercentage(
                                          "amount",
                                          tipPercentage
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`${index}_tips_percentage`}
                                      className={` ${index > 0 && "ml-5"}`}
                                    >
                                      {" "}
                                      {tipPercentage}%
                                    </label>
                                  </div>
                                )
                              )}
                              <div className="tips">
                                <input
                                  type="radio"
                                  value="percentage"
                                  id="percentage"
                                  name="switch-two"
                                  onClick={() =>
                                    this.showOtherText("percentage")
                                  }
                                />
                                <label htmlFor="percentage" className="ml-5">
                                  {localStorage.getItem("tipsOtherText")}
                                </label>
                              </div>
                            </div>
                          )}
                          {this.state.percentage && (
                            <input
                              className="form-control custom-tip-input mb-15"
                              name="percentageValue"
                              type="text"
                              placeholder={localStorage.getItem(
                                "cartTipPercentagePlaceholderText"
                              )}
                              value={this.state.percentageValue || ""}
                              onChange={this.restrictAlphabates}
                              onKeyPress={this.restrictAlphabates}
                              min="0"
                              max="100"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )} */}

                  {/* {this.props.restaurant_info &&
                    this.props.restaurant_info.order_schedule == 1 && (
                      <div
                        className="mx-15 p-15"
                        style={{
                          boxShadow: "rgb(136 136 136) 0px 0px 10px -3px",
                          borderRadius: "10px",
                        }}
                      >
                        <div
                          onClick={() => this.handlePopupOpen()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="font-w600">Schedule Order</div>
                          <div>
                            <TimeCircle />
                          </div>
                        </div>
                      </div>
                    )} */}

                  {/* {this.props.restaurant_info &&
                    this.props.restaurant_info.order_schedule == 1 &&
                    (localStorage.getItem("schedule_date") ||
                      localStorage.getItem("schedule_time")) && (
                      <div
                        className="mt-2"
                        style={{
                          color: localStorage.getItem("storeColor"),
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <span>Scheduled For:&nbsp;</span>
                        {this.state.date && (
                          <span>
                            <Moment format="DD/MM/YYYY">
                              {this.state.date}
                            </Moment>
                            &nbsp;
                          </span>
                        )}
                        {this.state.time && <span>{this.state.time}</span>}
                      </div>
                    )} */}

                  {/* <React.Fragment>
                    {(this.props.restaurant_info.delivery_type == 2 ||
                      this.props.restaurant_info.delivery_type == 3) && (
                      <div
                        className="mx-15 my-15 p-15"
                        style={{
                          boxShadow: "rgb(136 136 136) 0px 0px 10px -3px",
                          borderRadius: "10px",
                        }}
                      >
                        <strong>Delivery Option</strong>
                        <div
                          className="mt-4"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <button
                            className="col mx-5"
                            disabled
                            style={{
                              border: "1px solid",
                              color:
                                localStorage.getItem("userSelected") ===
                                "DELIVERY"
                                  ? "#f50057"
                                  : "#535353",
                              borderRadius: "2rem",
                              backgroundColor: "white",
                            }}
                          >
                            <span>
                              <Checkbox
                                icon={<CircleUnchecked />}
                                checkedIcon={<CircleChecked />}
                                checked={
                                  localStorage.getItem("userSelected") ===
                                  "DELIVERY"
                                    ? true
                                    : false
                                }
                                onChange={handleDelivery}
                              />
                            </span>
                            Delivery
                          </button>
                          <button
                            className="col mx-5"
                            style={{
                              border: "1px solid",
                              color:
                                localStorage.getItem("userSelected") ===
                                "SELFPICKUP"
                                  ? "#f50057"
                                  : "#535353",
                              borderRadius: "2rem",
                              backgroundColor: "white",
                            }}
                          >
                            <span>
                              <Checkbox
                                icon={<CircleUnchecked />}
                                checkedIcon={<CircleChecked />}
                                checked={
                                  localStorage.getItem("userSelected") ===
                                  "SELFPICKUP"
                                    ? true
                                    : false
                                }
                                onClick={this.openConfirmSelf}
                              />
                            </span>
                            Self Pickup
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment> */}

                  {this.state.is_operational_loading ? (
                    <Loading />
                  ) : (
                    <React.Fragment>
                      {this.state.is_active ? (
                        <React.Fragment>
                        <div style={{height:'200px',backgroundColor:'#fff'}}></div>
                          {this.state.min_order_satisfied &&
                            !this.state.min_qnt_message &&
                            !this.state.max_qnt_message && (
                              <React.Fragment>
                                {this.state.is_all_items_available && (
                                  <CartCheckoutBlock
                                    restaurant_id={
                                      this.props.restaurant_info.id
                                    }
                                    cart_page={
                                      this.context.router.route.location
                                        .pathname
                                    }
                                    is_operational_loading={
                                      this.state.is_operational_loading
                                    }
                                    is_operational={this.state.is_operational}
                                    handleProcessCartLoading={
                                      this.handleProcessCartLoading
                                    }
                                    checkForItemsAvailability={
                                      this.checkForItemsAvailability
                                    }
                                    handleItemsAvailability={
                                      this.handleItemsAvailability
                                    }
                                    user_selected={localStorage.getItem(
                                      "userSelected"
                                    )}
                                    total={cartTotal.totalPrice}
                                    distance={this.state.distance}
                                    alreadyRunningOrders={
                                      this.state.alreadyRunningOrders
                                    }
                                    tips={this.state.selectedTips}
                                    removeTip={this.removeTip}
                                  />
                                )}
                              </React.Fragment>
                            )}
                        </React.Fragment>
                      ) : (
                        <div className="auth-error no-click">
                          <div className="error-shake">
                            {this.props.restaurant_info &&
                              this.props.restaurant_info.name}{" "}
                            : Currently Not Accepting Any Orders
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : (
                <div
                  className="bg-white cart-empty-block"
                  style={{ height: "70vh" }}
                >
                  <Swing>
                    <div className="d-flex justify-content-center">
                      <img
                        className="cart-empty-img"
                        src="/assets/img/various/empty-cart.png"
                        alt="Your Cart is Empty"
                      />
                    </div>
                  </Swing>
                  <h2 className="cart-empty-text mt-50 pt-20 ml-20 text-center">
                    Your Cart is Empty
                  </h2>
                  {this.state.alreadyRunningOrders && (
                    <div
                      className="auth-error ongoing-order-notify"
                      style={{
                        position: "fixed",
                        bottom: "4.5rem",
                      }}
                    >
                      <DelayLink to="/my-orders" delay={250}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Running Orders <ChevronRight />
                        </div>
                        <Ink duration="500" />
                      </DelayLink>
                    </div>
                  )}
                  <Footer active_cart={true} />
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  restaurant_info: state.items.restaurant_info,
  cartProducts: state.cart.products,
  cartTotal: state.total.data,
  user: state.user.user,
  running_order: state.user.running_order,
  restaurant: state.restaurant,
  coupon: state.coupon.coupon,
  force_reload: state.helper.force_reload,
  tips: state.tips,
  tips_percentage: state.tips_percentage,
  confirmCart: state.confirmCart.confirmCart,
});

export default GoogleApiWrapper({
  apiKey: "AIzaSyAGYL-CoRexODv8-xNDUA4Zf9w9SMHZs04",
  LoadingContainer: Loading,
})(
  connect(mapStateToProps, {
    checkUserRunningOrder,
    updateCart,
    getRestaurantInfoById,
    updateUserInfo,
    addProduct,
    checkCartItemsAvailability,
    checkBan,
    getRestaurantInfoAndOperationalStatus,
    removeCoupon,
  })(Cart)
);
