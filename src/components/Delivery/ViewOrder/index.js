import React, { Component } from "react";
import { acceptToDeliverOrder, deliverOrder, pickupOrder } from "../../../services/Delivery/deliveryprogress/actions";
import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSingleDeliveryOrder } from "../../../services/Delivery/singleorder/actions";
import ShareLiveLocation from "../ShareLiveLocation";
import { formatPrice } from "../../helpers/formatPrice";
import { Location, Send, Call } from 'react-iconly';

class ViewOrder extends Component {

	static contextTypes = {
		router: () => null,
	};

	state = {
		initLoading: true,
		loading: false,
		already_accepted: false,
		accepted_order: false,
		picked_up: false,
		delivered: false,
		delivery_pin: "",
		delivery_pin_error: false,
		reset: false,
		max_order: false,
		completed_order: false,
	};

	componentDidMount() {
		if (this.props.delivery_user.success) {
			this.props
				.getSingleDeliveryOrder(
					this.props.delivery_user.data.auth_token,
					this.props.match.params.unique_order_id
				)
				.then((response) => {
					if (response && response.payload) {
						if (response.payload.id) {
							this.setState({ initLoading: false });
						}
					}
				});
		}
	}

	// componentWillMount() {
	// 	if(localStorage.getItem("deliveryDark") == "true") {
	// 	   	require('../../../assets/delivery-dark.css');
	// 		document.getElementsByTagName("body")[0].classList.add("delivery-bg");
	// 	} else {
	// 		require('../../../assets/delivery-light.css');
	// 		document.getElementsByTagName("body")[0].classList.add("delivery-bg");
	// 	}
	// }

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps.single_delivery_order);
		if (nextProps.single_delivery_order.order_status_id == 2) {
			if (nextProps.single_delivery_order.max_order) {
				this.setState({ max_order: true, reset: true });
			}
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.order_status_id == 3) {
			if (nextProps.single_delivery_order.already_accepted) {
				this.setState({ already_accepted: true, reset: true });
			}
			this.setState({ accepted_order: true });
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.order_status_id == 4) {
			this.setState({ accepted_order: true, picked_up: true });
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.delivery_pin_error) {
			this.setState({ delivery_pin_error: true, reset: true });
		}

		if (nextProps.single_delivery_order.order_status_id == 5) {
			this.setState({ loading: false, completed_order: true, delivered: true });
			setTimeout(() => {
				this.forceUpdate();
			}, 1000);
			// this.context.router.history.push("/delivery");
		}
	}

	__acceptToDeliver = () => {
		this.props.acceptToDeliverOrder(
			this.props.delivery_user.data.auth_token,
			this.props.delivery_user.data.id,
			this.props.single_delivery_order.id
		);
		this.setState({ loading: true });
	};

	__pickedUp = () => {
		this.props.pickupOrder(this.props.delivery_user.data.auth_token, this.props.single_delivery_order.id);
		this.setState({ loading: true });
	};

	__delivered = () => {
		this.props.deliverOrder(
			this.props.delivery_user.data.auth_token,
			this.props.single_delivery_order.id,
			this.state.delivery_pin
		);
		this.setState({ loading: true });
	};

	__getDirectionToRestaurant = (restaurant_latitude, restaurant_longitude) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
		window.open(directionUrl, "_blank");
	};

	__getDirectionToUser = (user_order_loaction) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		try {
			JSON.parse(user_order_loaction);
			const directionUrl =
				"http://maps.google.com/maps?q=" +
				JSON.parse(user_order_loaction).lat +
				"," +
				JSON.parse(user_order_loaction).lng;
			window.open(directionUrl, "_blank");
		} catch {
			JSON.parse(user_order_loaction);
			const directionUrl = "http://maps.google.com/maps?q=" + user_order_loaction;
			window.open(directionUrl, "_blank");
		}
	};

	__handleDeliveryPinInput = (e) => {
		this.setState({ delivery_pin: e.target.value });
	};

	getDeliveryGuyTotalEarning = (order) => {
		let total = 0.0;
		if (order.commission) {
			total += parseFloat(order.commission);
		}
		if (order.tip_amount) {
			total += parseFloat(order.tip_amount);
		}
		return formatPrice(total);
	};

	render() {

		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const order = this.props.single_delivery_order;

		return (
			<React.Fragment>
				<Meta
					seotitle="Delivery Orders"
					ogtype="website"
					ogurl={window.location.href}
				/>
				<BackWithSearch
					boxshadow={true}
					disable_search={true}
				/>

				{this.state.initLoading ? (
					<div className="pt-50">
						<ContentLoader
							height={150}
							width={400}
							speed={1.2}
							primaryColor={"#E0E0E0"}
							secondaryColor={"#fefefe"}
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					</div>
				) : (
					<React.Fragment>
						{this.state.loading && (
							<div className="height-100 overlay-loading ongoing-payment-spin">
								<div className="spin-load" />
							</div>
						)}
						{/* {!this.state.delivered && ( */}
						<React.Fragment>
							{this.state.max_order && (
								<div className="delivery-error delivery-max-order-reached">
									<div className="error-shake">
										Max Order Limit Reached
									</div>
								</div>
							)}
							{this.state.delivery_pin_error && (
								<div className="delivery-error delivery-max-order-reached">
									<div className="error-shake">
										Invalid Delivery Pin
									</div>
								</div>
							)}
							{this.state.already_accepted ? (
								<div className="delivery-error delivery-already-accepted-error">
									<div className="error-shake">
										This delivery has been accepted by someone else.
									</div>
								</div>
							) : (
								<React.Fragment>
									<div
										className="view-delivery-order"
										style={{ paddingTop: "4rem" }}
									>
										<div className="delivery-message ml-15 mr-15 mt-20 p-15" style={{ borderRadius: '8px' }}>
											<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>
												Restaurant Details
											</div>
											<hr className="mt-5" />
											<div style={{ fontSize: '14px', fontWeight: 'bolder' }}>
												{order.stores && order.stores.name}
											</div>
											<div style={{ fontSize: '14px' }}>
												{order.stores && order.stores.restphone}
											</div>
											<div style={{ display: 'flex', color: '#D02D3C' }} className="mt-10">
												<Location />
												<span className="delivery-text">{order.stores && order.stores.address}</span>
											</div>
											<div style={{ display: 'flex' }}>
												<div className="p-5 mt-20"
													onClick={() =>
														this.__getDirectionToRestaurant(
															order.stores.latitude,
															order.stores.longitude
														)
													}
													style={{ display: 'flex', border: '1px solid #FF5B44', borderRadius: '5px', color: '#FF5B44', width: '125px' }}
												>
													<Send />
													<span className="mt-1 ml-1">Get Direction</span>
												</div>
												{order.stores &&
													<a
														className="p-5 mt-20 ml-20"
														href={"tel:" + order.stores.restphone}
														style={{ display: 'flex', border: '1px solid #00C127', borderRadius: '5px', color: '#00C127', width: '70px' }}
													>
														<Call />
														<span className="mt-1 ml-1">Call</span>
													</a>
												}
											</div>
											{this.state.accepted_order &&
												<React.Fragment>
													<hr style={{ borderTop: 'dashed' }} className="mt-20 mb-20" />
													<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>
														Customer Details
													</div>
													<hr className="mt-5" />
													<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>
														{order.user.name}
													</div>
													<div style={{ fontSize: '14px' }}>
														{order.user.phone}
													</div>
													<div style={{ display: 'flex', color: '#D02D3C' }} className="mt-10">
														<Location />
														<span className="delivery-text">{order.address}</span>
													</div>
													<div style={{ display: 'flex' }}>
														<div className="p-5 mt-20"
															onClick={() =>
																this.__getDirectionToUser(order.location)
															}
															style={{ display: 'flex', border: '1px solid #FF5B44', borderRadius: '5px', color: '#FF5B44', width: '125px' }}
														>
															<Send />
															<span className="mt-1 ml-1">Get Direction</span>
														</div>

														<a
															className="p-5 mt-20 ml-20"
															href={"tel:" + order.user.phone}
															style={{ display: 'flex', border: '1px solid #00C127', borderRadius: '5px', color: '#00C127', width: '70px' }}
														>
															<Call />
															<span className="mt-1 ml-1">Call</span>
														</a>
													</div>
												</React.Fragment>
											}
											<hr className="mb-20 mt-20" />
											<div>
												{order.orderitems.map((item) => (
													<React.Fragment>
														<div className="d-flex justify-content-between pl-10 pr-10 pt-10">
															<div>
																{item.name}
															</div>
															<div style={{ fontWeight: 'bold' }}>
																<span>
																	x{item.quantity}
																</span>
															</div>
															<div style={{ fontWeight: 'bold' }}>
																₹ {item.quantity * item.price}
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
											</div>
											<div className="ml-15 mt-20 mr-10 pl-15 pb-15 delivery-message" style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
												{/* {order.order_comment &&
													<div className="row" style={{color: 'red'}}>
														<div className="col-9">Comment </div>
														<div className="col-3 text-right">{order.order_comment}</div>
													</div> } */}
												<div className="row" style={{ fontSize: '10px' }}>
													<div className="col-8 text-right">Subtotal</div>
													<div className="col-4 text-right">₹ {order.restaurant_total}</div>
												</div>
												{order.tax &&
													<div className="row" style={{ fontSize: '10px' }}>
														<div className="col-8 text-right">Tax</div>
														<div className="col-4 text-right">₹ {parseFloat(order.tax).toFixed(2)}</div>
													</div>
												}
												{order.delivery_charge &&
													<div className="row" style={{ fontSize: '10px' }}>
														<div className="col-8 text-right">Delivery charge</div>
														<div className="col-4 text-right">₹ {parseFloat(order.delivery_charge).toFixed(2)}</div>
													</div>
												}
												{order.tip_amount &&
													<div className="row" style={{ fontSize: '10px' }}>
														<div className="col-8 text-right">Tip amount</div>
														<div className="col-4 text-right">₹ {parseFloat(order.tip_amount).toFixed(2)}</div>
													</div>
												}
												{order.surge_fee &&
													<div className="row" style={{ fontSize: '10px' }}>
														<div className="col-8 text-right">Surge fee</div>
														<div className="col-4 text-right">₹ {parseFloat(order.surge_fee).toFixed(2)}</div>
													</div>
												}
												<div className="row" style={{ fontWeight: '600' }}>
													<div className="col-8 text-right">Total </div>
													<div className="col-4 text-right">
														<div className="d-flex align-items-center justify-content-end">
															<div>₹&nbsp;</div>
															<div>{(formatPrice(order.total))}</div>
														</div>
													</div>
												</div>
												{order.order_comment &&
													<div style={{ fontWeight: 'bold' }} className="text-danger text-center mt-2">
														Comment: &nbsp;&nbsp;<span>{order.order_comment}</span>
													</div>
												}
											</div>
											{!this.state.completed_order &&
												<hr className="mb-20 mt-20" />
											}
											{!this.state.accepted_order &&
												!this.state.completed_order &&
												!this.state.picked_up &&
												!this.state.delivered && (
													<React.Fragment>
														<button onClick={this.__acceptToDeliver} className="pt-15 pb-15"
															style={{ border: 'none', width: '100%', backgroundColor: '#00C127', borderRadius: '5px', fontWeight: 'bold', letterSpacing: '1px', color: 'white' }}
														>ACCEPT ORDER</button>
													</React.Fragment>
												)}
											{this.state.accepted_order &&
												!this.state.picked_up &&
												!this.state.delivered && (
													<React.Fragment>
														<button onClick={this.__pickedUp} className="pt-15 pb-15"
															style={{ border: 'none', width: '100%', backgroundColor: '#FF5B44', borderRadius: '5px', fontWeight: 'bold', letterSpacing: '1px', color: 'white' }}
														>ORDER PICKEDUP</button>
													</React.Fragment>
												)}
											{this.state.picked_up && (
												<React.Fragment>
													<div className="pt-15 pb-15">
														{order.payment_mode == "COD" ? (
															<button className="btn" style={{ width: '100%', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #D02D3C', color: '#D02D3C', fontWeight: 'bold' }}>
																Cash On Delivery ₹ {order.payable}
															</button>
														) : (
															<button className="btn" style={{ width: '100%', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #00C127', color: '#00C127', fontWeight: 'bold' }}>
																Online Payment
															</button>
														)}
													</div>
													{/* <label className="mt-10">Delivery Pin</label>
													<div>
														<div className="form-group">
															<div className="row">
																<div className="col-12">
																	<input style={{ border: '1px solid #C9C9C9', borderRadius: '5px' }}
																		type="text"
																		className="form-control"
																		onChange={this.__handleDeliveryPinInput}
																	/>
																</div>
															</div>
														</div>
													</div> */}
												</React.Fragment>
											)}
											{this.state.accepted_order &&
												this.state.picked_up &&
												!this.state.delivered && (
													<React.Fragment>
														<button onClick={this.__delivered} className="pt-15 pb-15"
															style={{ border: 'none', width: '100%', backgroundColor: '#FF5B44', borderRadius: '5px', fontWeight: 'bold', letterSpacing: '1px', color: 'white' }}
														>COMPLETE ORDER</button>
													</React.Fragment>
												)}
										</div>
										{/* {(localStorage.getItem("enableDeliveryGuyEarning") == "true" ||
												order.tip_amount > 0) && (
												<div className="pt-20 px-15 pb-15">
													<div className="p-15 single-order-earnings-block">
														{localStorage.getItem("enableDeliveryGuyEarning") ==
															"true" && (
															<div className="d-flex justify-content-between">
																<div>
																	{localStorage.getItem(
																		"deliveryEarningCommissionText"
																	)}
																</div>
																<div>
																	{localStorage.getItem("currencySymbolAlign") ==
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{order.commission}
																	{localStorage.getItem("currencySymbolAlign") ==
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</div>
															</div>
														)}

														{order.tip_amount > 0 && (
															<div className="d-flex justify-content-between">
																<div>
																	{localStorage.getItem("deliveryEarningTipText")}
																</div>
																<div>
																	{localStorage.getItem("currencySymbolAlign") ==
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{order.tip_amount}
																	{localStorage.getItem("currencySymbolAlign") ==
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</div>
															</div>
														)}
														<hr className="single-item-division-hr" />
														<div className="d-flex justify-content-between align-items-center single-order-total-earnings">
															<div>
																{localStorage.getItem(
																	"deliveryEarningTotalEarningText"
																)}
															</div>
															<div>
																{localStorage.getItem("currencySymbolAlign") ==
																	"left" && localStorage.getItem("currencyFormat")}
																{this.getDeliveryGuyTotalEarning(order)}
																{localStorage.getItem("currencySymbolAlign") ==
																	"right" && localStorage.getItem("currencyFormat")}
															</div>
														</div>
													</div>
												</div>
											)}

											<div className="p-15">
												<div className="single-order-metas d-flex justify-content-between">
													<div>
														<i className="si si-clock mr-5" />{" "}
														{localStorage.getItem("deliveryOrderPlacedText")}:{" "}
														<Moment fromNow interval={5000}>
															{order.created_at}
														</Moment>
													</div>
												</div>

												<ul className="list list-timeline list-timeline-modern delivery-address-timeline pull-t pb-20">
													<li>
														<i className="list-timeline-icon si si-basket-loaded bg-del-timeline-icon" />
														<Flip bottom duration={500}>
															<div className="list-timeline-content">
																<p className="m-0 font-w700">{order.restaurant.name}</p>
																<p className="m-0 single-order-restaurant-description">
																	{order.restaurant.description}
																</p>
																<p className="m-0">{order.restaurant.address}</p>
																<p className="mb-2">{order.restaurant.pincode}</p>
																<div
																	onClick={() =>
																		this.__getDirectionToRestaurant(
																			order.restaurant.latitude,
																			order.restaurant.longitude
																		)
																	}
																>
																	<button className="btn btn-get-direction">
																		<i className="si si-action-redo mr-5" />
																		{localStorage.getItem(
																			"deliveryGetDirectionButton"
																		)}
																	</button>
																</div>
															</div>
														</Flip>
													</li>

													<li className="mt-20">
														<i className="list-timeline-icon si si-pointer bg-del-timeline-icon" />
														<Flip bottom duration={1000}>
															<div className="list-timeline-content">
																<p className="font-w700">{order.user.name}</p>
																<p className="mb-0">{order.user.phone}</p>
																<p className="mb-2">{order.address}</p>
																<div>
																	<button
																		className="btn btn-get-direction mr-2"
																		onClick={() =>
																			this.__getDirectionToUser(order.location)
																		}
																	>
																		<i className="si si-action-redo mr-5" />
																		{localStorage.getItem(
																			"deliveryGetDirectionButton"
																		)}
																	</button>
																	<a
																		className="btn btn-get-direction"
																		href={"tel:" + order.user.phone}
																	>
																		<i className="si si-call-out mr-5" />
																		{localStorage.getItem("callNowButton")}{" "}
																	</a>
																</div>
															</div>
														</Flip>
													</li>
												</ul>
											</div>
											<div className="pt-15 px-15">
												<div className="single-order-items-title">
													<i className="si si-list mr-2" />
													{localStorage.getItem("deliveryOrderItems")}
												</div>
												<div className="p-15 single-order-items-list">
													{order.orderitems.map((item) => (
														<OrderItems item={item} key={item.id} />
													))}
													{localStorage.getItem("showPriceAndOrderCommentsDelivery") ==
														"true" && (
														<React.Fragment>
															<p>{order.order_comment}</p>
															<p
																className={`pull-right font-w700 h4 ${
																	localStorage.getItem("deliveryAppLightMode") ==
																	"true"
																		? "text-dark"
																		: "text-white"
																}`}
															>
																Total:{" "}
																{localStorage.getItem("currencySymbolAlign") ==
																	"left" && localStorage.getItem("currencyFormat")}
																{order.total}
																{localStorage.getItem("currencySymbolAlign") ==
																	"right" && localStorage.getItem("currencyFormat")}
															</p>
															<div className="clearfix" />
														</React.Fragment>
													)}
												</div>
											</div>
											{this.state.picked_up && (
												<React.Fragment>
													<div className="pt-15 px-15">
														{order.payment_mode == "COD" ? (
															<button className="btn btn-cod">
																{localStorage.getItem("deliveryCashOnDelivery")}:{" "}
																{localStorage.getItem("currencySymbolAlign") ==
																	"left" && localStorage.getItem("currencyFormat")}
																{order.payable}
																{localStorage.getItem("currencySymbolAlign") ==
																	"right" && localStorage.getItem("currencyFormat")}
															</button>
														) : (
															<button className="btn btn-payed-online">
																<i className="si si-check mr-5" />{" "}
																{localStorage.getItem("deliveryOnlinePayment")}
															</button>
														)}
													</div>
													{localStorage.getItem("enableDeliveryPin") == "true" && (
														<div className="pt-10 px-15 delivery-pin-block">
															<div className="form-group">
																<div className="row">
																	<div className="col-12">
																		<input
																			type="text"
																			className="form-control"
																			placeholder={localStorage.getItem(
																				"deliveryDeliveryPinPlaceholder"
																			)}
																			onChange={this.__handleDeliveryPinInput}
																		/>
																		{this.state.delivery_pin_error && (
																			<div
																				className="delivery-pin-error"
																				style={{
																					zIndex: "9",
																					marginBottom: "4rem",
																				}}
																			>
																				<div className="error-shake">
																					{localStorage.getItem(
																						"deliveryInvalidDeliveryPin"
																					)}
																				</div>
																			</div>
																		)}
																	</div>
																</div>
															</div>
														</div>
													)}
												</React.Fragment>
											)}
											<div className="delivery-action">
												{!this.state.accepted_order &&
													!this.state.picked_up &&
													!this.state.delivered && (
														<React.Fragment>
															<ReactSwipeButton
																text={localStorage.getItem("deliveryAcceptOrderButton")}
																color={localStorage.getItem("storeColor")}
																onSuccess={this.__acceptToDeliver}
																reset={this.state.reset}
															/>
														</React.Fragment>
													)}
												{this.state.accepted_order &&
													!this.state.picked_up &&
													!this.state.delivered && (
														<ReactSwipeButton
															text={localStorage.getItem("deliveryPickedUpButton")}
															color={localStorage.getItem("storeColor")}
															onSuccess={this.__pickedUp}
															reset={this.state.reset}
														/>
													)}
												{this.state.accepted_order &&
													this.state.picked_up &&
													!this.state.delivered && (
														<ReactSwipeButton
															text={localStorage.getItem("deliveryDeliveredButton")}
															color={localStorage.getItem("storeColor")}
															onSuccess={this.__delivered}
															reset={this.state.reset}
														/>
													)}
												{this.state.accepted_order &&
													this.state.picked_up &&
													this.state.delivered && (
														<button
															type="button"
															className="btn btn-accept"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<i className="si si-check mr-5" />
															{localStorage.getItem("deliveryOrderCompletedButton")}
														</button>
													)}
											</div> */}
									</div>
								</React.Fragment>
							)}
						</React.Fragment>
						{/* // )} */}
					</React.Fragment>
				)}
				<ShareLiveLocation />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	single_delivery_order: state.single_delivery_order.single_delivery_order,
	accepted_order: state.accepted_order.accepted_order,
});

export default connect(
	mapStateToProps,
	{ getSingleDeliveryOrder, acceptToDeliverOrder, pickupOrder, deliverOrder }
)(ViewOrder);
