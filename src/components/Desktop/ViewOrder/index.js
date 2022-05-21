import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Map from "./Map";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../services/user/actions";
import { ArrowLeft } from "react-iconly";
import { Location } from "react-iconly";
import { TickSquare, ShieldDone, ShieldFail, TimeSquare, Bag2 } from "react-iconly";
import { WEBSITE_URL } from "../../../configs/website";
import { formatPrice } from "../../helpers/formatPrice";
import DelayLink from "../../helpers/delayLink";
import Ink from "react-ink";
import OrderCancelPopup from "./OrderCancelPopup";
import { addProduct } from "../../../services/cart/actions";
import { getSingleItem } from "../../../services/items/actions";
import { moment } from "react-moment";
import { cancelOrder } from "../../../services/orders/actions";
import Hero from "../Hero";
import Footer from "../Footer";
import FloatCart from "../FloatCart";

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

	// getTime = (to) => {
	// 	var startDate = new Date();
	// 	// Do your operations
	// 	var endDate = moment(to);
	// 	var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

	// 	console.log(seconds)
	// 	return seconds;
	// }

	addProducts = (order) => {
		// console.log(order.orderitems)
		this.setState({ loading: true});
		
		const { addProduct } = this.props;

		Object.values(order.orderitems).forEach(item => {
			this.props.getSingleItem(item.item_id).then((response) => {
				if (response) {
					response.payload.quantity = item.quantity;
					response.payload.addon_categories = item.order_item_addons;
					if (!response.payload.addon_categories.length) {
						// console.log(response.payload)
						addProduct(response.payload);
					}
				}
			});
		});

		setTimeout(() => {
			this.context.router.history.push("/desktop/cart");
		}, 2000);
	}

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
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
		window.open(directionUrl, "_blank");
	};

	componentWillUnmount() {
		clearInterval(this.refreshSetInterval);
	}

	render() {
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
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<Hero />

				{this.state.loading &&
					<div className="height-100 overlay-loading ongoing-payment-spin">
						<div className="spin-load" />
					</div>
				}

				<div className="bg-white" style={{ minHeight: '100vh' }}>
					<div className="container">
						{user.running_order && (
							<React.Fragment>
								<div
									style={{
										position: "absolute",
										top: "4rem",
										width: "70vw"
									}}
									className="mt-50"
								>
									<div className="mt-15 mb-200 ml-20 mr-20">
										<React.Fragment>
											<div className="order-status-block">
												<div className="mb-2" style={{ fontWeight: 'bolder', fontSize: '15px', color: localStorage.getItem("storeColor") }}>#{user.running_order.unique_order_id}</div>
												<div className="mb-4" style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
													<div className="font-w600" style={{ fontSize: '13px' }}>Delivery Pin:</div>
													<div className="font-w600 ml-2">{user.running_order.delivery_pin}</div>
												</div>

												<div className="d-flex">
													<div><Location /></div>
													<div className="ml-4">
														<div className="font-w600">{user.running_order.stores.name}</div>
														<div className="text-muted">{user.running_order.stores.address}</div>
													</div>
												</div>

												<div className="d-flex mt-2">
													<div><Location /></div>
													<div className="ml-4">
														<div className="font-w600">Delivery Address</div>
														<div className="text-muted">{user.running_order.address}</div>
													</div>
												</div>
												<hr style={{ borderTop: '1px dashed grey' }} />

												<div className="d-flex">
													{user.running_order.order_status_id === 1 &&
														<div style={{ color: '#0960BD', display: 'flex' }}><div><TickSquare className="mr-1" size={16} /></div><div className="ml-4">Order Placed</div></div>
													}
													{user.running_order.order_status_id === 5 &&
														<div style={{ color: '#1ABE30', display: 'flex' }}><div><ShieldDone className="mr-1" size={16} /></div><div className="ml-4">Delivered</div></div>
													}
													{user.running_order.order_status_id === 6 &&
														<div style={{ color: '#FF0000', display: 'flex' }}><div><ShieldFail className="mr-1" size={16} /></div><div className="ml-4">Cancelled</div></div>
													}
													{user.running_order.order_status_id === 9 &&
														<div style={{ color: '#FF0000', display: 'flex' }}><div><ShieldFail className="mr-1" size={16} /></div><div className="ml-4">Transaction Failed</div></div>
													}
													{user.running_order.order_status_id === 10 &&
														<div style={{ color: '#8B8B8B', display: 'flex' }}><div><TickSquare className="mr-1" size={16} /></div><div className="ml-4">Transaction Pending</div></div>
													}
													{user.running_order.order_status_id === 11 &&
														<div style={{ color: '#FE0B15', display: 'flex' }}><div><Bag2 className="mr-1" size={16} /></div><div className="ml-4">Self Pick Up</div></div>
													}
													{user.running_order.order_status_id != 1 && user.running_order.order_status_id != 5 && user.running_order.order_status_id != 6 && user.running_order.order_status_id != 9 && user.running_order.order_status_id != 10 && user.running_order.order_status_id != 11 &&
														<div style={{ color: '#0960BD', display: 'flex' }}><div><TimeSquare className="mr-1" size={16} /></div><div className="ml-4">On Going</div></div>
													}
												</div>
											</div>

											<div className="order-status-block mt-20">
												{user.running_order.orderitems.map((item) => (
													<React.Fragment>
														<div className="d-flex justify-content-between pl-10 pr-10 pt-10">
															<div style={{ display: 'flex', alignItems: 'center' }}>
																<div>
																	{item.is_veg || item.is_egg ? (
																		<React.Fragment>
																			{item.is_veg ? (
																				<img style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
																			) : (
																				<img style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
																			)}
																		</React.Fragment>
																	) : (
																		<img style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
																	)}
																</div>
																<div className="ml-2" style={{ fontWeight: 'bolder', fontSize: '14px' }}>
																	{item.name}
																</div>
															</div>
															<div style={{ fontWeight: 'bold' }}>
																<span>
																	x{item.quantity}
																</span>
															</div>
															<div style={{ fontWeight: 'bold' }}>
																₹ {item.price}
															</div>
														</div>
														<div className="pr-10 ml-10" style={{
															color: '#979797',
															fontSize: '10px'
														}}>
															{item &&
																item.order_item_addons.map((addonArray, index) => (
																	<React.Fragment key={item.id + addonArray.id + index}>
																		<div className="d-flex justify-content-between">
																			<div>
																				{addonArray.addon_name}
																			</div>
																			<div>
																				₹ {addonArray.addon_price}
																			</div>
																		</div>
																	</React.Fragment>
																))}
														</div>
													</React.Fragment>
												))}
												<hr style={{ borderTop: '1px dashed grey' }} />
												<div className="display-flex mb-1">
													<div className="flex-auto">Sub Total</div>
													<div className="flex-auto text-right">
														<span className="rupees-symbol">₹ </span>{formatPrice(user.running_order.sub_total)}
													</div>
												</div>
												{user.running_order.store_charge === "0.00" ||
													user.running_order.store_charge === null ? null : (
													<React.Fragment>
														<div className="display-flex mb-1">
															<div className="flex-auto">Store Charge</div>
															<div className="flex-auto text-right">
																<span className="rupees-symbol">₹ </span>{user.running_order.store_charge}
															</div>
														</div>
													</React.Fragment>
												)}
												{user.running_order.delivery_charge === 0 ? (
													<React.Fragment>
													</React.Fragment>
												) : (
													<React.Fragment>
														<div className="display-flex mb-1">
															<div className="flex-auto">Delivery Charge</div>
															<div className="flex-auto text-right">
																<span className="rupees-symbol">₹ </span>{formatPrice(user.running_order.delivery_charge)}
															</div>
														</div>
													</React.Fragment>
												)}

												{user.running_order.tax && user.running_order.tax > 0 && (
													<React.Fragment>
														<div className="display-flex mb-1">
															<div className="flex-auto">Tax</div>
															<div className="flex-auto text-right">
																<span className="rupees-symbol">₹ </span>{formatPrice(user.running_order.tax)}
															</div>
														</div>
													</React.Fragment>
												)}

												{user.running_order.tip_amount && user.running_order.tip_amount > 0 && (
													<React.Fragment>
														<div className="display-flex mb-1">
															<div className="flex-auto">Delivery Tip</div>
															<div className="flex-auto text-right">
																<span className="rupees-symbol">₹ </span>{formatPrice(user.running_order.tip_amount)}
															</div>
														</div>
													</React.Fragment>
												)}

												<hr style={{ borderTop: '1px dashed #C9C9C9' }} />

												<div className="display-flex">
													<div className="flex-auto font-w700">Total</div>
													<div className="flex-auto text-right font-w700">
														{/* Calculating total after discount coupon or without discount coupon */}
														<span className="rupees-symbol">₹ </span>{formatPrice(user.running_order.total)}
													</div>
												</div>

												<div className="mt-20" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
													{user.running_order.order_status_id != 5 && user.running_order.order_status_id != 6 && user.running_order.order_status_id != 9 && user.running_order.order_status_id != 10 && user.running_order.order_status_id != 11 &&
														<DelayLink
															to={`/desktop/running-order/${user.running_order.unique_order_id}`}
															className="btn btn-square btn-outline-secondary mb-10 pl-2 pr-2 order-track-button"
															delay={250}
															style={{ position: "relative" }}
														>
															Track Order
															<Ink duration="500" />
														</DelayLink>
													}

													{(user.running_order.order_status_id == 5 || user.running_order.order_status_id == 6 || user.running_order.order_status_id == 9) &&
														<div
															className="btn btn-square btn-outline-secondary mb-10 pl-2 pr-2 order-track2-button"
															style={{ position: "relative" }}
															onClick={() => this.addProducts(user.running_order)}
														>
															Reorder
														</div>
													}

													{user.running_order.can_cancel && user.running_order.order_status_id == 1 &&
														<OrderCancelPopup order={user.running_order} user={user} cancelOrder={cancelOrder} />
													}
												</div>
											</div>
										</React.Fragment>
									</div>
								</div>
							</React.Fragment>
						)}
					</div>
				</div>
				<FloatCart />
				<Footer active_account={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	cancel: state.orders.cancel,
});

export default connect(
	mapStateToProps,
	{ updateUserInfo, addProduct, getSingleItem, cancelOrder }
)(ViewOrder);
