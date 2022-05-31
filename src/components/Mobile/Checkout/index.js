import React, { Component } from "react";
import Meta from "../../helpers/meta";
import PaymentList from "./PaymentList";
import { Redirect } from "react-router";
import { checkConfirmCart } from "../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { GoogleApiWrapper } from "google-maps-react";
import Loading from "../../helpers/loading";
import { ArrowLeft } from "react-iconly";
import { ChevronLeft, TimeCircle } from "react-iconly";
import Fade from "react-reveal/Fade";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import Moment from "react-moment";
import Ink from "react-ink";

class Checkout extends Component {
  state = {
    loading: false,
    process_distance_calc_loading: false,
    continueFetchPaymentGateway: true,
    gateways_received: false,
    toPay: "",
    schedule_modal: false,
    date: null,
    time: null,
  };

  static contextTypes = {
    router: () => null,
  };

  componentDidMount() {
    const { user } = this.props;

    // if (user) {
    // 	this.props
    // 		.getPaymentGateways(user.data.auth_token, localStorage.getItem("activeRestaurant"))
    // 		.then((response) => {
    // 			if (response && response.payload) {
    // 				this.setState({ gateways_received: true });
    // 			} else {
    // 				console.error("fetching payment gateways failed... trying again after 2.5s");
    // 				this.retryPaymentGatewaySetInterval = setInterval(() => {
    // 					this.fetchPaymentGateways(user.data.auth_token);
    // 				}, 2500);
    // 			}
    // 		});
    // }

    if (this.props.cartProducts.length) {
      document.getElementsByTagName("body")[0].classList.add("bg-grey-light");
    }
  }

  handleLoading = (value) => {
    this.setState({ loading: value });
  };
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

  handlePopupOpen = (content) => {
    this.setState({ schedule_modal: true });
  };

  handlePopupClose = () => {
    this.setState({ schedule_modal: false });
  };
  onChange = (date) => this.setState({ date });

  onTime = (time) => this.setState({ time });
  // fetchPaymentGateways = (token) => {
  // 	if (this.state.continueFetchPaymentGateway) {
  // 		console.log("fetching again...");
  // 		this.props.getPaymentGateways(token, localStorage.getItem("activeRestaurant")).then((response) => {
  // 			if (response && response.payload) {
  // 				this.setState({ continueFetchPaymentGateway: false, gateways_received: true });
  // 			}
  // 		});
  // 	} else {
  // 		clearInterval(this.retryPaymentGatewaySetInterval);
  // 	}
  // };
  componentDidMount() {
    localStorage.removeItem("schedule_date");
    localStorage.removeItem("schedule_time");
  }
  componentWillUnmount() {
    document.getElementsByTagName("body")[0].classList.remove("bg-grey-light");
    clearInterval(this.retryPaymentGatewaySetInterval);
  }

  handleProcessDistanceCalcLoading = (value) => {
    this.setState({ process_distance_calc_loading: value });
  };

  handleToPayText = (data) => {
    setTimeout(() => {
      this.setState({ toPay: data });
    }, 200);
  };

  render() {
    if (!this.props.cartProducts.length) {
      // no items in cart after checkout goto cart page
      // return <Redirect to={"/cart"} />;
    }

    if (window.innerWidth > 768) {
      return <Redirect to="/" />;
    }
    //TODO:
    //check if the referrer is cart page, if not then redirect to cart
    // if (!this.props.confirmCart) {
    // 	return <Redirect to={"/cart"} />;
    // }
    if (localStorage.getItem("storeColor") === null) {
      return <Redirect to={"/"} />;
    }

    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {this.state.process_distance_calc_loading && <Loading />}
        <Meta ogtype="website" ogurl={window.location.href} />
        <div className="bg-white" style={{ minHeight: "100vh" }}>
          <div className="d-flex flex-row align-items-center pl-15 pr-15 pt-15">
            <div
              className="d-flex align-items-center justify-content-center p-2"
              style={{
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
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginLeft: "26vw",
              }}
            >
              CHECKOUT
            </div>
          </div>

          {this.state.schedule_modal == true && (
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
          )}

          {this.props.restaurant_info &&
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
            )}

          {this.props.restaurant_info &&
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
                    <Moment format="DD/MM/YYYY">{this.state.date}</Moment>
                    &nbsp;
                  </span>
                )}
                {this.state.time && <span>{this.state.time}</span>}
              </div>
            )}
          <div className="pt-20">
            <div className="font-w600 my-10 ml-20">Choose a Payment Method</div>
            <PaymentList
              handleProcessDistanceCalcLoading={
                this.handleProcessDistanceCalcLoading
              }
              paymentgateways={this.props.paymentgateways}
              gatewayStatus={this.state.gateways_received}
              handleLoading={this.handleLoading}
              toPay={this.handleToPayText}
              google={this.props.google}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  total: state.total.total,
  user: state.user.user,
  cartProducts: state.cart.products,
  cartTotal: state.total.data,
  coupon: state.coupon.coupon,
  confirmCart: state.confirmCart.confirmCart,
  paymentgateways: state.paymentgateways.paymentgateways,
  restaurant_info: state.items.restaurant_info,
});
export default GoogleApiWrapper({
  apiKey: localStorage.getItem("googleApiKey"),
  LoadingContainer: Loading,
})(
  connect(mapStateToProps, {
    checkConfirmCart,
  })(Checkout)
);
