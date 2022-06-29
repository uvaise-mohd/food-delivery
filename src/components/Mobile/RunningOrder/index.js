import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Map from "./Map";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../services/user/actions";
import { ArrowLeft, Calling, ChevronLeft, TimeCircle } from "react-iconly";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import Checkbox from "@material-ui/core/Checkbox";
import { Call } from "react-iconly";
import ProgressiveImage from "react-progressive-image";
import moment from "moment";
import { TiTick } from "react-icons/ti";

class RunningOrder extends Component {
  state = {
    updatedUserInfo: false,
    show_delivery_details: false,
    sendBackToOrdersPage: false,
  };
  static contextTypes = {
    router: () => null,
  };
  checkEtaMet = (eta) => {
    var date1 = new Date();
    var date2 = new Date(eta);
    if (date1 > date2) {
      return true;
    } else {
      return false;
    }
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.running_order === null) {
      this.context.router.history.push("/my-orders");
    }
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
      return <Redirect to="/" />;
    }
    if (localStorage.getItem("storeColor") === null) {
      return <Redirect to={"/"} />;
    }
    const { user } = this.props;
    if (!user.success) {
      return <Redirect to={"/"} />;
    }
    const WEBSITE_CDN_URL = "https://app.snakyz.com/";
    return (
      <React.Fragment>
        <Meta ogtype="website" ogurl={window.location.href} />
        <div className="bg-white" style={{ minHeight: "100vh" }}>
          <div
            className="d-flex align-items-center justify-content-center p-2"
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              border: "1px solid #000",
              borderRadius: "14px",
            }}
            onClick={() => this.context.router.history.goBack()}
          >
            <ChevronLeft
              primaryColor="#000"
              set="light"
              secondaryColor="#000"
            />
          </div>
          <div
            className="text-center"
            style={{
              fontSize: "15px",
              fontWeight: "bolder",
              paddingTop: "25px",
            }}
          >
            DELIVERY STATUS
          </div>
          {user.running_order && (
            <React.Fragment>
              <div
                className="p-10 d-flex flex-column align-items-center justify-content-center"
                style={{ marginTop: "30px" }}
              >
                <div style={{ color: "#898B9A", fontSize: "14px" }}>
                  Estimated Delivery
                </div>
                <div
                  style={{ color: "#000", fontSize: "18px", fontWeight: "700" }}
                >
                  {moment(user.running_order.estimated_delivery_time).format(
                    "LL"
                  )}{" "}
                  /{" "}
                  {moment(user.running_order.estimated_delivery_time).format(
                    "LT"
                  )}
                </div>
              </div>
              <div
                className="mb-4 p-10"
                style={{
                  marginRight: "20px",
                  marginLeft: "20px",
                  marginTop: "20px",
                  backgroundColor: "#FBFBFB",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-between p-10"
                  style={{ borderBottom: "1px solid #F5F5F8" }}
                >
                  <div>Track Order</div>
                  <div style={{color:'#898B9A'}}>{user.running_order.unique_order_id}</div>
                </div>
                <div className="ml-10 mr-10">
                  <div className="d-flex align-items-center mt-10">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        border: "7px solid #FF0000",
                        color: "rgb(255, 255, 255)",
                        backgroundColor: "#ff0000",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    >
                      <TiTick color="#fff" size={30} />
                    </div>
                    <div className="ml-3">
                      <div style={{ fontSize: "15px", fontWeight: "600" }}>
                        Order Confirmed
                      </div>
                      <div style={{ fontWeight: "400", color: "#898B9A" }}>
                        Your order has been recived
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      borderLeft: "3px solid #ff0000",
                      borderRight: "",
                      height: "50px",
                      marginLeft: "18px",
                      marginRight: "",
                    }}
                  ></div>

                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        border:
                          user.running_order.order_status_id > 2
                            ? "7px solid #ff0000"
                            : "7px solid #DDDDDD",
                        color: "rgb(255, 255, 255)",
                        backgroundColor:
                          user.running_order.order_status_id > 2
                            ? "#ff0000"
                            : "#ddd",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    >
                      <TiTick color="#fff" size={30} />
                    </div>
                    <div className="ml-3">
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color:
                            user.running_order.order_status_id > 2
                              ? "#C5C5C5"
                              : "#000",
                        }}
                      >
                        Order Prepared
                      </div>
                      <div
                        style={{
                          fontWeight: "400",
                          color:
                            user.running_order.order_status_id > 2
                              ? "#898B9A"
                              : "#898B9A",
                        }}
                      >
                        Your order has been prepared
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      borderLeft:
                        user.running_order.order_status_id > 2
                          ? "3px solid #ff0000"
                          : "3px solid #ddd",
                      borderRight: "",
                      height: "50px",
                      marginLeft: "18px",
                      marginRight: "",
                    }}
                  ></div>

                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        border:
                          user.running_order.order_status_id >= 3
                            ? "7px solid #ff0000"
                            : "7px solid #DDDDDD",
                        color: "rgb(255, 255, 255)",
                        backgroundColor:
                          user.running_order.order_status_id >= 3
                            ? "#ff0000"
                            : "#ddd",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    >
                      <TiTick color="#fff" size={30} />
                    </div>
                    <div className="ml-3">
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color:
                            user.running_order.order_status_id >= 3
                              ? "#C5C5C5"
                              : "#000",
                        }}
                      >
                        Delivevry in Progress
                      </div>
                      <div
                        style={{
                          fontWeight: "400",
                          color:
                            user.running_order.order_status_id >= 23
                              ? "#898B9A"
                              : "#898B9A",
                        }}
                      >
                        Hang on! Your food is on the way
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      borderLeft:
                        user.running_order.order_status_id >= 3
                          ? "3px solid #ff0000"
                          : "3px solid #ddd",
                      borderRight: "",
                      height: "50px",
                      marginLeft: "18px",
                      marginRight: "",
                    }}
                  ></div>

                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        border:
                          user.running_order.order_status_id == 5
                            ? "7px solid #ff0000"
                            : "7px solid #DDDDDD",
                        color: "rgb(255, 255, 255)",
                        backgroundColor:
                          user.running_order.order_status_id == 5
                            ? "#ff0000"
                            : "#ddd",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    >
                      <TiTick color="#fff" size={30} />
                    </div>
                    <div className="ml-3">
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color:
                            user.running_order.order_status_id == 5
                              ? "#C5C5C5"
                              : "#000",
                        }}
                      >
                        Delivered
                      </div>
                      <div
                        style={{
                          fontWeight: "400",
                          color:
                            user.running_order.order_status_id == 5
                              ? "#898B9A"
                              : "#898B9A",
                        }}
                      >
                        Wish you have interesting experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginRight: "20px",
                  marginLeft: "20px",
                  marginTop: "20px",
                }}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <TimeCircle primaryColor="#ff0000" />
                  </div>
                  <div className="d-flex flex-column align-items-start justify-content-between ml-10">
                    <div style={{ color: "#898B9A", fontWeight: 500 }}>
                      Estimate Time
                    </div>
                    <div
                      style={{
                        color: "#000",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {parseFloat(user.running_order.travel_eta) + 10} Minutes
                    </div>
                  </div>
                </div>

                <div className="p-10 d-flex align-items-center justify-content-between">
                  <div>
                    <img src="https://app.snakyz.com/assets/snaky/Distance.png" />
                  </div>
                  <div className="d-flex flex-column align-items-start justify-content-between ml-10">
                    <div style={{ color: "#898B9A", fontWeight: 500 }}>
                      Distance
                    </div>
                    <div
                      style={{
                        color: "#000",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {user.running_order.distance} Km
                    </div>
                  </div>
                </div>
              </div>

              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginRight: "20px",
                  marginLeft: "20px",
                  marginTop: "100px",
                  alignItems: "center",
                  backgroundColor: "#ff0000",
                  height: "60px",
                  borderRadius: "10px",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
              <div><Calling/></div>
              <div className="ml-10">

                Contact Us
              </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, { updateUserInfo })(RunningOrder);
