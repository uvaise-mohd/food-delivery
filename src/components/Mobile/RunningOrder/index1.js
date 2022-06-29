import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Map from "./Map";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../services/user/actions";
import { ArrowLeft } from "react-iconly";
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Checkbox from '@material-ui/core/Checkbox';
import { Call } from "react-iconly";

class RunningOrder extends Component {
	state = {
		updatedUserInfo: false,
		show_delivery_details: false,
		sendBackToOrdersPage: false,
	};
	static contextTypes = {
		router: () => null,
	};

	__refreshOrderStatus = () => {
		const { user } = this.props;
		if (user.success) {
			// this.refs.refreshButton.setAttribute("disabled", "disabled");
			this.props.updateUserInfo(user.data.id, user.data.auth_token, this.props.match.params.unique_order_id);
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
			this.props.updateUserInfo(user.data.id, user.data.auth_token, this.props.match.params.unique_order_id);
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
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
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

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<div className="bg-white" style={{ minHeight: '100vh' }}>
					<div style={{ "position": "absolute", "top": "15px", "left": "15px" }} onClick={() => this.context.router.history.goBack()}>
						<ArrowLeft />
					</div>
					<div className="text-center pt-15" style={{ "ontSize": "15px", "fontWeight": "bolder" }}>
						Order Tracking
					</div>
					{user.running_order && (
						<React.Fragment>
							{/* {localStorage.getItem("showMap") === "true" && (
								<Map
									restaurant_latitude={user.running_order.restaurant.latitude}
									restaurant_longitude={user.running_order.restaurant.longitude}
									order_id={user.running_order.id}
									order_status_id={user.running_order.order_status_id}
									deliveryLocation={user.running_order.location}
								/>
							)} */}

							<div
								style={{
									position: "absolute",
									top: "4rem",
									width: "100%",
								}}
							>
								<div className="mt-15 mb-200 ml-20 mr-20">
									<React.Fragment>
										<div className="order-status-block">
											<div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
												<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>Order Placed</div>
												<div>
													<Checkbox
														icon={<CircleUnchecked />}
														checkedIcon={<CircleChecked />}
														checked={true}
													/>
												</div>
											</div>
											<div>Order Placed Successfully</div>
										</div>
									</React.Fragment>
									<React.Fragment>
										<div className="order-status-block" style={{ opacity: user.running_order.order_status_id >= 2 ? '100%' : '50%' }}>
											<div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
												<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>Food Preparing</div>
												<div>
													<Checkbox
														icon={<CircleUnchecked />}
														checkedIcon={<CircleChecked />}
														checked={user.running_order.order_status_id >= 2 ? true : false}
													/>
												</div>
											</div>
											<div>Order accepted and Food preparing</div>
										</div>
									</React.Fragment>
									<React.Fragment>
										<div className="order-status-block" style={{ opacity: (user.running_order.order_status_id >= 3) ? '100%' : '50%' }}>
											<div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
												<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>Delivery Partner Assigned</div>
												<div>
													<Checkbox
														icon={<CircleUnchecked />}
														checkedIcon={<CircleChecked />}
														checked={(user.running_order.order_status_id >= 3) ? true : false}
													/>
												</div>
											</div>
											<div>Delivery Partner Ready</div>
											{this.state.show_delivery_details && (
												<a className="p-10 mt-10"
													href={"tel:" + user.delivery_details.phone}
													style={{ width: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.5rem', boxShadow: "rgb(136 136 136) 0px 0px 10px -3px" }}

												>
													<Call className="mr-1" size="small" /> Call Now
												</a>
											)}
										</div>
									</React.Fragment>
									<React.Fragment>
										<div className="order-status-block" style={{ opacity: user.running_order.order_status_id == 4 ? '100%' : '50%' }}>
											<div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
												<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>Food Picked Up</div>
												<div>
													<Checkbox
														icon={<CircleUnchecked />}
														checkedIcon={<CircleChecked />}
														checked={user.running_order.order_status_id == 4 ? true : false}
													/>
												</div>
											</div>
											<div>Delivery Partner on the Way</div>
										</div>
									</React.Fragment>
									<React.Fragment>
										<div className="order-status-block" style={{ opacity: user.running_order.order_status_id == 5 ? '100%' : '50%' }}>
											<div className="d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
												<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>Enjoy Your Food</div>
												<div>
													<Checkbox
														icon={<CircleUnchecked />}
														checkedIcon={<CircleChecked />}
														checked={user.running_order.order_status_id == 5 ? true : false}
													/>
												</div>
											</div>
											<div>Your Order Delivered Successfully</div>
										</div>
									</React.Fragment>
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

export default connect(
	mapStateToProps,
	{ updateUserInfo }
)(RunningOrder);
