import React, { Component } from "react";
import Meta from "../../helpers/meta";
import { connect } from "react-redux";
import { updateDeliveryUserInfo } from "../../../services/Delivery/user/actions";
import Axios from "axios";
import Moment from "react-moment";
import { ArrowLeft } from 'react-iconly';
import { formatPrice } from "../../helpers/formatPrice";
import Loading from "../../helpers/loading";
import Ink from "react-ink";
import { Location } from 'react-iconly';
import { Link } from "react-router-dom";

class CompletedOrders extends Component {

	static contextTypes = {
		router: () => null,
	};

	state = {
		from: null,
		to: null,
		orders: [],
		loading: false,
	};

	// componentWillMount() {
	// 	if(localStorage.getItem("deliveryDark") == "true") {
	// 	   	require('../../../assets/delivery-dark.css');
	// 		document.getElementsByTagName("body")[0].classList.add("delivery-bg");
	// 	} else {
	// 		require('../../../assets/delivery-light.css');
	// 		document.getElementsByTagName("body")[0].classList.add("delivery-bg");
	// 	}
	// }

	getOrders = () => {
		if (this.state.from && this.state.to) {
			this.setState({ loading: true });
			Axios
				.post('https://app.snakyz.com/public/api/delivery/get-completed-orders', {
					token: this.props.delivery_user.data.auth_token,
					from: this.state.from,
					to: this.state.to
				})
				.then((response) => {
					const orders = response.data.data.orders;
					console.log(orders);
					this.setState({ loading: false });
					if (orders) {
						this.setState({
							orders: orders
						});
					} else {
						this.setState({
							orders: []
						});
					}
				});
		}
	};

	onChangeFrom = (event) => this.setState({ from: event.target.value });
	onChangeTo = (event) => this.setState({ to: event.target.value });

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

	getOrdersTotal() {
		let total = 0;

		this.state.orders.forEach(order => {
			total += parseFloat(order.order.delivery_charge);
			// if (order.tax) {
			// 	total += parseFloat(order.tax);
			// }
			// console.log(order);
		});

		return formatPrice(total);
	}

	render() {

		const url = 'https://app.snakyz.com/public/api/delivery/datewise-order/export?form=' + this.state.from + '&to=' + this.state.to + '&token=' + this.props.delivery_user.data.auth_token;

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<React.Fragment>
					<div className="col-12 p-0 fixed" style={{ "WebkitBoxShadow": "0 1px 3px rgba(0, 0, 0, 0.05)", "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.05)", "zIndex": "9", "backgroundColor": "white" }}>
						<div className="block m-0 delivery-message">
							<div className="block-content p-0">
								<div className="search-box">
									<div className="input-group-prepend">
										<button
											type="button"
											className="btn search-navs-btns delivery-message"
											style={{ position: "relative" }}
											onClick={() => {
												setTimeout(() => {
													this.context.router.history.goBack();
												}, 200);
											}}
										>
											<ArrowLeft />
											<Ink duration="500" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
				{this.state.loading && <Loading />}
				<React.Fragment>
					<div className="pt-50" style={{ minHeight: '100vh' }}>
						<div className="delivery-message ml-15 mr-15 mt-20 p-20" style={{ borderRadius: '8px', height: '190px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>From Date</div>
								<input onChange={this.onChangeFrom} type="date" className="p-5 delivery-message" style={{ color: '#B8B8B8', border: '1px solid #B8B8B8', borderRadius: '8px', width: '155px' }} />
							</div>
							<div className="mt-20" style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>To Date</div>
								<input onChange={this.onChangeTo} type="date" className="p-5 delivery-message" style={{ color: '#B8B8B8', border: '1px solid #B8B8B8', borderRadius: '8px', width: '155px' }} />
							</div>
							<div className="text-center mt-20">
								<button onClick={this.getOrders} className="pl-20 pr-20 pt-5 pb-5 delivery-message" style={{ border: '1px solid #FE0B15', borderRadius: '5px', color: '#FE0B15' }}>View Orders</button>
							</div>
						</div>

						{this.state.orders.length === 0 ? (
							<div className="text-center text-muted mt-100">
								No Orders For This Date
							</div>
						) : (
							<React.Fragment>
								<div className="mt-20" style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div className="ml-15 mt-1 delivery-text" style={{ fontSize: '14px', fontWeight: 'bolder' }}>
										Total Orders: {this.state.orders.length} <br />
										Total Earnings: ₹ {this.getOrdersTotal()}
									</div>
									<a href={url}>
										<button className="pl-20 pr-20 pt-5 pb-5 mr-15" style={{ border: '1px solid #00C127', borderRadius: '5px', backgroundColor: 'white', color: '#00C127' }}>Export Orders</button>
									</a>
								</div>
								{this.state.orders.map((order, index) => (
									<React.Fragment key={order.id}>
										<Link
											to={`/delivery/orders/${order.order.unique_order_id}`}
											key={order.order.id}
											style={{ position: "relative" }}
										>
											<div className="delivery-list-item ml-15 mr-15 mt-15 p-15 delivery-message" style={{ borderRadius: '5px' }}>
												<div className="mb-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
													<div style={{ fontWeight: '900', color: '#FF5B44', letterSpacing: '1px' }}>
														#{order.order.unique_order_id.substr(order.order.unique_order_id.length - 10)}
													</div>
													<div style={{ fontWeight: '500', color: '#FF5B44' }}>
														<Moment format="MMM DD YYYY, hh:mm A">
															{order.updated_at}
														</Moment>
													</div>
												</div>
												<hr />
												<div className="mt-15" style={{ fontWeight: 'bolder' }}>
													{order.order.stores && order.order.stores.name}
												</div>
												<div style={{ display: 'flex' }} className="mt-15">
													<Location />
													<span>{order.order.address}</span>
												</div>
												<div className="mt-10 d-flex align-items-center" style={{ fontWeight: 'bolder' }}>
													Delivery Charege: ₹ {order.order.delivery_charge}
												</div>
											</div>
											<Ink duration="500" hasTouch="true" />
										</Link>
									</React.Fragment>
								))}
							</React.Fragment>
						)}
					</div>
				</React.Fragment>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
});

export default connect(
	mapStateToProps,
	{ updateDeliveryUserInfo }
)(CompletedOrders);
