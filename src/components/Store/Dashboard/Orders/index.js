import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../services/Store/user/actions";
import { connect } from "react-redux";
import Ink from "react-ink";
import Footer from "../Footer";
import TopBar from "../TopBar";
import { formatPrice } from "../../../helpers/formatPrice";
import axios from "axios";
import Moment from "react-moment";
import DelayLink from "../../../helpers/delayLink";
import ContentLoader from "react-content-loader"
import { ArrowRight } from 'react-iconly';

class Orders extends Component {

	state = {
		new_orders: [],
		// scheduled_orders: [],
		// self_orders: [],
		ongoing_orders: [],
		picked_orders: [],
		cancelled_orders: [],
		completed_orders: [],
		new_orders_view: true,
		// scheduled_orders_view: false,
		// self_orders_view: false,
		ongoing_orders_view: false,
		picked_orders_view: false,
		cancelled_orders_view: false,
		completed_orders_view: false
	};

	componentDidMount() {
		this.__getOrdersData();
		this.interval = setInterval(() => this.__getOrdersData(), 25000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	__getOrdersData = () => {
		axios
			.post('https://chopze.com/public/api/store/get-all-orders', {
				token: this.props.store_user.data.auth_token,
			})
			.then((response) => {
				const orders = response.data;
				// console.log(orders);
				if (orders) {
					// add new
					this.setState({
						new_orders: Object.values(orders.new_orders),
						// scheduled_orders: Object.values(orders.scheduled_orders),
						// self_orders: Object.values(orders.self_orders),
						ongoing_orders: Object.values(orders.ongoing_orders),
						picked_orders: Object.values(orders.picked_orders),
						cancelled_orders: Object.values(orders.cancelled_orders),
						completed_orders: Object.values(orders.completed_orders),
					});

				} else {
					this.setState({
						new_orders: [],
						scheduled_orders: [],
						// self_orders: [],
						// ongoing_orders: [],
						picked_orders: [],
						cancelled_orders: [],
						completed_orders: [],
					});
				}
			});
	}

	ongoingOrders = () => {
		this.setState({ ongoing_orders_view: true, new_orders_view: false, picked_orders_view: false, cancelled_orders_view: false, completed_orders_view: false });
	}

	pickedOrders = () => {
		this.setState({ picked_orders_view: true, new_orders_view: false, ongoing_orders_view: false, cancelled_orders_view: false, completed_orders_view: false });
	}

	newOrders = () => {
		this.setState({ new_orders_view: true, ongoing_orders_view: false, picked_orders_view: false, cancelled_orders_view: false, completed_orders_view: false });
	}

	cancelledOrders = () => {
		this.setState({ cancelled_orders_view: true, new_orders_view: false, ongoing_orders_view: false, picked_orders_view: false, completed_orders_view: false });
	}

	completedOrders = () => {
		this.setState({ completed_orders_view: true, new_orders_view: false, ongoing_orders_view: false, picked_orders_view: false, cancelled_orders_view: false });
	}

	getTotal(order) {
		var total = 0;
		var tax = 0;

		if (order.tax && order.tax > 0) {
			tax = order.tax;
		} else {
			tax = 0;
		}

		total = parseFloat(tax) + parseFloat(order.restaurant_total);

		return formatPrice(total);
	}

	render() {
		const { store_user } = this.props;
		// console.log(this.state.new_orders);
		// console.log(this.state.ongoing_orders);

		return (
			<React.Fragment>
				<TopBar
					has_title={true}
					title="Orders"
				/>

				<div className="pt-50 bg-grey" style={{ minHeight: '100vh' }}>
					<div className="row gutters-tiny ml-15 mr-15 mt-20 mb-20 bg-white" style={{ borderRadius: '8px' }}>
						<div onClick={this.newOrders} className={this.state.new_orders_view ? "vendor-order-border col text-center pt-20 pb-20" : "text-muted col text-center pt-20 pb-20"} style={{ borderRadius: '8px' }}>
							<div style={{ border: 'none', backgroundColor: 'white' }}>
								New<br />{this.state.new_orders.length > 0 && <span>( <span style={{ fontWeight: 'bolder' }}>{this.state.new_orders.length}</span> )</span>}
							</div>
						</div>

						<div onClick={this.ongoingOrders} className={this.state.ongoing_orders_view ? "vendor-order-border col text-center pt-20 pb-20" : "text-muted col text-center pt-20 pb-20"} style={{ borderRadius: '8px' }}>
							<div style={{ border: 'none', backgroundColor: 'white' }}>
								Going<br />{this.state.ongoing_orders.length > 0 && <span>( <span style={{ fontWeight: 'bolder' }}>{this.state.ongoing_orders.length}</span> )</span>}
							</div>
						</div>

						<div onClick={this.pickedOrders} className={this.state.picked_orders_view ? "vendor-order-border col text-center pt-20 pb-20" : "text-muted col text-center pt-20 pb-20"} style={{ borderRadius: '8px' }}>
							<div style={{ border: 'none', backgroundColor: 'white' }}>
								Picked<br />{this.state.picked_orders.length > 0 && <span>( <span style={{ fontWeight: 'bolder' }}>{this.state.picked_orders.length}</span> )</span>}
							</div>
						</div>

						<div onClick={this.cancelledOrders} className={this.state.cancelled_orders_view ? "vendor-order-border col text-center pt-20 pb-20" : "text-muted col text-center pt-20 pb-20"} style={{ borderRadius: '8px' }}>
							<div style={{ border: 'none', backgroundColor: 'white' }}>
								Cancelled<br />{this.state.cancelled_orders.length > 0 && <span>( <span style={{ fontWeight: 'bolder' }}>{this.state.cancelled_orders.length}</span> )</span>}
							</div>
						</div>

						<div onClick={this.completedOrders} className={this.state.completed_orders_view ? "vendor-order-border col text-center pt-20 pb-20" : "text-muted col text-center pt-20 pb-20"} style={{ borderRadius: '8px' }}>
							<div style={{ border: 'none', backgroundColor: 'white' }}>
								Completed<br />{this.state.completed_orders.length > 0 && <span>( <span style={{ fontWeight: 'bolder' }}>{this.state.completed_orders.length}</span> )</span>}
							</div>
						</div>
					</div>

					<div style={{ paddingBottom: '12vh' }}>
						{this.state.new_orders_view &&
							<React.Fragment>
								{this.state.new_orders.length === 0 ? (
									<div className="text-muted text-center mt-50">
										No New Orders
									</div>
								) : (
									this.state.new_orders.map((order, index) => (
										<React.Fragment key={order.id}>
											<div className="bg-white ml-15 mr-15 mb-15" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #D9D9D9' }}>
												<DelayLink delay={200} to={'/store/order/view/' + order.unique_order_id}>
													<div className="clearfix text-black" style={{ position: 'relative' }}>
														<div className="row">
															<div className="col-4">
																<div style={{ fontSize: '15px', fontWeight: '500' }}> #{order.unique_order_id.slice(-7)} </div>
																<br />
																<div style={{ fontSize: '13px', fontWeight: '400' }}> <Moment format="hh:mm A">{order.created_at}</Moment> </div>
															</div>
															<div className="col-4">
																<div style={{ fontSize: '12px', fontWeight: '400' }}> Order Value </div>
																<br />
																<div style={{ fontSize: '12px', fontWeight: '400' }}> ₹ {order.restaurant_total} </div>
															</div>
															<div className="col-4" style={{ "textAlignLast": "center" }}>
																<br />
																<ArrowRight icon="home" />
															</div>
														</div>
													</div>
												</DelayLink>
												{order.delivery_type == '2' &&
													<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
														Self Pick-Up Order
													</div>
												}
												{order.is_scheduled == 1 &&
													<div>
														<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
															Scheduled Order
														</div>
													</div>
												}
											</div>
										</React.Fragment>
									))
								)}
							</React.Fragment>
						}
						{this.state.picked_orders_view &&
							<React.Fragment>
								{this.state.picked_orders.length === 0 ? (
									<div className="text-muted text-center mt-50">
										No Picked Orders
									</div>
								) : (
									this.state.picked_orders.map((order, index) => (
										<React.Fragment key={order.id}>
											<div className="bg-white ml-15 mr-15 mb-15" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #D9D9D9' }}>
												<DelayLink delay={200} to={'/store/order/view/' + order.unique_order_id}>
													<div className="clearfix text-black" style={{ position: 'relative' }}>
														<div className="row">
															<div className="col-4">
																<div style={{ fontSize: '15px', fontWeight: '500' }}> #{order.unique_order_id.slice(-7)} </div>
																<br />
																<div style={{ fontSize: '13px', fontWeight: '400' }}> <Moment format="hh:mm A">{order.created_at}</Moment> </div>
															</div>
															<div className="col-4">
																<div style={{ fontSize: '12px', fontWeight: '400' }}> Order Value </div>
																<br />
																<div style={{ fontSize: '12px', fontWeight: '400' }}> ₹ {order.restaurant_total} </div>
															</div>
															<div className="col-4" style={{ "textAlignLast": "center" }}>
																<br />
																<ArrowRight icon="home" />
															</div>
														</div>
													</div>
												</DelayLink>
												{order.delivery_type == '2' &&
													<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
														Self Pick-Up Order
													</div>
												}
												{order.is_scheduled == 1 &&
													<div>
														<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
															Scheduled Order
														</div>
													</div>
												}
											</div>
										</React.Fragment>
									))
								)}
							</React.Fragment>
						}
						{this.state.cancelled_orders_view &&
							<React.Fragment>
								{this.state.cancelled_orders.length === 0 ? (
									<div className="text-muted text-center mt-50">
										No Cancelled Orders
									</div>
								) : (
									this.state.cancelled_orders.map((order, index) => (
										<React.Fragment key={order.id}>
											<div className="bg-white ml-15 mr-15 mb-15" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #D9D9D9' }}>
												<DelayLink delay={200} to={'/store/order/view/' + order.unique_order_id}>
													<div className="clearfix text-black" style={{ position: 'relative' }}>
														<div className="row">
															<div className="col-4">
																<div style={{ fontSize: '15px', fontWeight: '500' }}> #{order.unique_order_id.slice(-7)} </div>
																<br />
																<div style={{ fontSize: '13px', fontWeight: '400' }}> <Moment format="hh:mm A">{order.created_at}</Moment> </div>
															</div>
															<div className="col-4">
																<div style={{ fontSize: '12px', fontWeight: '400' }}> Order Value </div>
																<br />
																<div style={{ fontSize: '12px', fontWeight: '400' }}> ₹ {order.restaurant_total} </div>
															</div>
															<div className="col-4" style={{ "textAlignLast": "center" }}>
																<br />
																<ArrowRight icon="home" />
															</div>
														</div>
													</div>
												</DelayLink>
												{order.delivery_type == '2' &&
													<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
														Self Pick-Up Order
													</div>
												}
												{order.is_scheduled == 1 &&
													<div>
														<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
															Scheduled Order
														</div>
													</div>
												}
											</div>
										</React.Fragment>
									))
								)}
							</React.Fragment>
						}
						{this.state.completed_orders_view &&
							<React.Fragment>
								{this.state.completed_orders.length === 0 ? (
									<div className="text-muted text-center mt-50">
										No Completed Orders
									</div>
								) : (
									this.state.completed_orders.map((order, index) => (
										<React.Fragment key={order.id}>
											<div className="bg-white ml-15 mr-15 mb-15" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #D9D9D9' }}>
												<DelayLink delay={200} to={'/store/order/view/' + order.unique_order_id}>
													<div className="clearfix text-black" style={{ position: 'relative' }}>
														<div className="row">
															<div className="col-4">
																<div style={{ fontSize: '15px', fontWeight: '500' }}> #{order.unique_order_id.slice(-7)} </div>
																<br />
																<div style={{ fontSize: '13px', fontWeight: '400' }}> <Moment format="hh:mm A">{order.created_at}</Moment> </div>
															</div>
															<div className="col-4">
																<div style={{ fontSize: '12px', fontWeight: '400' }}> Order Value </div>
																<br />
																<div style={{ fontSize: '12px', fontWeight: '400' }}> ₹ {order.restaurant_total} </div>
															</div>
															<div className="col-4" style={{ "textAlignLast": "center" }}>
																<br />
																<ArrowRight icon="home" />
															</div>
														</div>
													</div>
												</DelayLink>
												{order.delivery_type == '2' &&
													<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
														Self Pick-Up Order
													</div>
												}
												{order.is_scheduled == 1 &&
													<div>
														<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
															Scheduled Order
														</div>
													</div>
												}
											</div>
										</React.Fragment>
									))
								)}
							</React.Fragment>
						}
						{this.state.ongoing_orders_view &&
							<React.Fragment>
								{this.state.ongoing_orders.length === 0 ? (
									<div className="text-muted text-center mt-50">
										No On-Going Orders
									</div>
								) : (
									this.state.ongoing_orders.map((order, index) => (
										<React.Fragment key={order.id}>
											<div className="bg-white ml-15 mr-15 mb-15" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #D9D9D9' }}>
												<DelayLink delay={200} to={'/store/order/view/' + order.unique_order_id}>
													<div className="clearfix text-black" style={{ position: 'relative' }}>
														<div className="row">
															<div className="col-4">
																<div style={{ fontSize: '15px', fontWeight: '500' }}> #{order.unique_order_id.slice(-7)} </div>
																<br />
																<div style={{ fontSize: '13px', fontWeight: '400' }}> <Moment format="hh:mm A">{order.created_at}</Moment> </div>
															</div>
															<div className="col-4">
																<div style={{ fontSize: '12px', fontWeight: '400' }}> Order Value </div>
																<br />
																<div style={{ fontSize: '12px', fontWeight: '400' }}> ₹ {order.restaurant_total} </div>
															</div>
															<div className="col-4" style={{ "textAlignLast": "center" }}>
																<br />
																<ArrowRight icon="home" />
															</div>
														</div>
													</div>
												</DelayLink>
												{order.delivery_type == '2' &&
													<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
														Self Pick-Up Order
													</div>
												}
												{order.is_scheduled == 1 &&
													<div>
														<div className="mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
															Scheduled Order
														</div>
													</div>
												}
											</div>
										</React.Fragment>
									))
								)}
							</React.Fragment>
						}
					</div>
				</div >

				<Footer active_orders={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo }
)(Orders);
