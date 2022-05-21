import React, { Component } from "react";
import CountTo from "react-count-to";
import { updateDeliveryUserInfo, updateDeliveryOrderHistory } from "../../../services/Delivery/user/actions";
import { connect } from "react-redux";
import OrdersHistory from "./OrdersHistory";
import EarningChart from "./EarningChart";
import EarningDetails from "./EarningDetails";
import EarningChartLight from "./EarningChartLight";
import DeliveryReviews from "./DeliveryReviews";
import { Avatar } from 'evergreen-ui';
import { Wallet, Calendar, TimeSquare, TickSquare, Login, Bag, Show, User, Swap } from 'react-iconly';
import { ToggleSwitch } from 'react-dragswitch';
import 'react-dragswitch/dist/index.css';
import Loading from "../../helpers/loading";
import Axios from "axios";
import { Link } from 'react-router-dom';

class Account extends Component {

	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: false,
		dark_mode: false,
	};

	__toggleActiveOff(user_id) {
		this.setState({ loading: true });
		Axios
			.post('https://app.snakyz.com/public/api/deliver-user/off', {
				token: this.props.delivery_user.data.auth_token,
				user_id: user_id
			})
			.then((response) => {
				// add new
				this.props.updateDeliveryUserInfo(this.props.delivery_user.data.id, this.props.delivery_user.data.auth_token);
				this.setState({ loading: false });
			});
	};

	componentDidMount() {
		const { delivery_user } = this.props;
		//update delivery guy info
		this.props.updateDeliveryUserInfo(delivery_user.data.id, delivery_user.data.auth_token);
		if (localStorage.getItem("deliveryDark") == "true") {
			this.setState({ dark_mode: true });
		} else {
			this.setState({ dark_mode: false });
		}
	}

	filterOnGoingOrders = () => {
		this.props.updateDeliveryOrderHistory(
			this.props.delivery_user.data.orders.filter((order) => order.is_complete === 0)
		);
		this.setState({ show_orderhistory: true, show_earnings: false });
	};

	filterCompletedOrders = () => {
		this.props.updateDeliveryOrderHistory(
			this.props.delivery_user.data.orders.filter((order) => order.is_complete === 1)
		);
		this.setState({ show_orderhistory: true, show_earnings: false, show_reviews: false });
	};

	showEarningsTable = () => {
		this.setState({ show_orderhistory: false, show_earnings: true, show_reviews: false });
	};

	showReviews = () => {
		this.setState({ show_orderhistory: false, show_earnings: false, show_reviews: true });
	};

	handleToggleLightDarkMode = () => {
		let state = localStorage.getItem("deliveryDark");
		if (state == "true") {
			const removeLightState = new Promise((resolve) => {
				localStorage.setItem("deliveryDark", "false");
				resolve("Removed Light State");
			});
			removeLightState.then(() => {
				window.location.reload();
			});
		} else {
			const setLightState = new Promise((resolve) => {
				localStorage.setItem("deliveryDark", "true");
				resolve("Set Light State");
			});
			setLightState.then(() => {
				window.location.reload();
			});
		}
	};

	render() {
		const { delivery_user, logoutDeliveryUser, order_history } = this.props;
		// console.log(this.state);

		return (
			<React.Fragment>
				{this.state.loading && <Loading />}

				<div className="d-flex justify-content-between delivery-nav">
					<div className="delivery-tab-title px-20 py-15">
						Profile
					</div>
				</div>

				{/* <div>
					<button
						onClick={this.handleToggleLightDarkMode}
						className="btn btn-default btn-block btn-toggleLightDark"
					>
						Dark Mode
					</button>
				</div> */}

				<div className="pt-20">
					{/* <div className="pr-5">
						{localStorage.getItem("deliveryAppLightMode") === "true" ? (
							<EarningChartLight data={delivery_user.chart} />
						) : (
							<EarningChart data={delivery_user.chart} />
						)}
					</div> */}

					<div className="delivery-message mr-15 ml-15 p-15" style={{ borderRadius: '8px', display: 'flex' }}>
						<div className="col-3">
							<Avatar
								name={delivery_user.data.name}
								size={60} />
						</div>
						<div className="col-6">
							<span style={{ fontWeight: '600' }}>{delivery_user.data.name}</span>
							<br />
							<span style={{ fontSize: '12px' }}>{delivery_user.data.phone}</span>
							<br />
							<span style={{ fontSize: '12px' }}>{delivery_user.data.email}</span>
						</div>
						<div className="col-2 pt-20 pl-30">
							<ToggleSwitch checked={delivery_user.data.is_active} onChange={() => this.__toggleActiveOff(delivery_user.data.id)} />
						</div>
					</div>

					<div className="delivery-message mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
						<div className="">
							<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
								<span className="mt-2">Dark Mode</span> <span style={{ color: '#FE0B15' }}>
									<ToggleSwitch checked={this.state.dark_mode} onChange={() => this.handleToggleLightDarkMode()} />
								</span>
							</div>
						</div>
					</div>

					<div className="row gutters-tiny px-15 mt-10">
						<React.Fragment>
						<div className="col-6 mb-5 p-5">
								<div className="p-10" style={{ backgroundColor: '#9D0B0B', fontWeight: '600', color: 'white', borderRadius: '5px', height: '80px' }}>
									<div>
										<div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												Today Earnings
											</div>
											<Wallet />
										</div>
										<div style={{marginBottom: '20px'}}>
											₹
											<CountTo
												to={delivery_user.data.todayEarnings}
												speed={1000}
												className="font-w600 ml-1"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-6 mb-5 p-5">
								<div className="p-10" style={{ backgroundColor: '#9D0B0B', fontWeight: '600', color: 'white', borderRadius: '5px', height: '80px' }}>
									<div>
										<div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												Earnings
											</div>
											<Wallet />
										</div>
										<div style={{marginBottom: '20px'}}>
											₹
											<CountTo
												to={delivery_user.data.wallet_balance}
												speed={1000}
												className="font-w600 ml-1"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-6 mb-5 p-5">
								<div className="p-10" style={{ backgroundColor: '#9D0B0B', fontWeight: '600', color: 'white', borderRadius: '5px', height: '80px' }}>
									<div>
										<div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												Total Distance
											</div>
											<Swap />
										</div>
										<div style={{marginBottom: '20px'}}>
											<CountTo
												to={delivery_user.data.totalDistance}
												speed={1000}
												className="font-w600  ml-1"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
											{' '}KM
										</div>
									</div>
								</div>
							</div>
							<div className="col-6 mb-5 p-5">
								<div className="p-10" style={{ backgroundColor: '#9D0B0B', fontWeight: '600', color: 'white', borderRadius: '5px', height: '80px' }}>
									<div>
										<div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												On Going Orders
											</div>
											<TimeSquare />
										</div>
										<div style={{marginBottom: '20px'}}>
											<CountTo
												to={delivery_user.data.onGoingCount}
												speed={1000}
												className="font-w600 ml-1"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-6 mb-5 p-5">
								<div className="p-10" style={{ backgroundColor: '#9D0B0B', fontWeight: '600', color: 'white', borderRadius: '5px', height: '80px' }}>
									<div>
										<div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												Completed Count
											</div>
											<TickSquare />
										</div>
										<idv style={{marginBottom: '20px'}}>
											<CountTo
												to={delivery_user.data.completedCount}
												speed={1000}
												className="font-w600 ml-1"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
										</idv>
									</div>
								</div>
							</div>
							<div className="col-6 mb-5 p-5">
								<div className="p-10" style={{ backgroundColor: '#9D0B0B', fontWeight: '600', color: 'white', borderRadius: '5px', height: '80px' }}>
									<div>
										<div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												Cash On Hand
											</div>
											<Show />
										</div>
										<idv>
											₹
											<CountTo
												to={delivery_user.data.cod_on_hand}
												speed={1000}
												className="font-w600 ml-1"
												easing={(t) => {
													return t < 0.5
														? 16 * t * t * t * t * t
														: 1 + 16 * --t * t * t * t * t;
												}}
												digits={2}
											/>
										</idv>
									</div>
								</div>
							</div>
						</React.Fragment>
					</div>

					<div className="ml-15 mt-20 mr-15 delivery-message pt-20 pr-5" style={{ borderRadius: '5px' }}>
						{localStorage.getItem("deliveryDark") == "true" ? (
							<EarningChart data={delivery_user.chart} />
						) : (
							<EarningChartLight data={delivery_user.chart} />
						)}
					</div>

					<div className="delivery-message mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
						<Link to="/delivery/edit-user">
							<div className="">
								<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
									<span className="mt-2">Edit Profile</span> <span style={{ color: '#FE0B15' }}><User /></span>
								</div>
							</div>
						</Link>
					</div>
					<div className="delivery-message mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
						<Link to="/delivery/completed-orders">
							<div className="">
								<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
									<span className="mt-2">Order History</span> <span style={{ color: '#FE0B15' }}><Bag /></span>
								</div>
							</div>
						</Link>
					</div>
					<div className="delivery-message mr-15 mt-10 ml-15 mb-50 p-15" style={{ borderRadius: '8px' }}>
						<div className="" onClick={() => logoutDeliveryUser(delivery_user)}>
							<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
								<span className="mt-2">Logout</span> <span style={{ color: '#FE0B15' }}><Login /></span>
							</div>
						</div>
					</div>
					{this.state.show_orderhistory && (
						<div className="orders-history px-15 mt-20 mb-50">
							{order_history && order_history.length > 0
								? order_history.map((order) => <OrdersHistory order={order} key={order.id} commission={delivery_user.commission_rate} />)
								: <p className="text-center text-muted py-15 mt-20">
									No Completed Orders
								</p>
							}
						</div>
					)}
					{this.state.show_earnings && (
						<div className="delivery-earnings px-15 mt-20">
							{delivery_user.data.earnings &&
								delivery_user.data.earnings.map((earning) => (
									<EarningDetails key={earning.id} transaction={earning} />
								))}
						</div>
					)}
					{this.state.show_reviews && (
						<div className="delivery-reviews px-15 mt-20">
							{delivery_user.data.ratings &&
								delivery_user.data.ratings.map((rating) => (
									<DeliveryReviews
										key={rating.id}
										rating={rating.rating_delivery}
										review={rating.review_delivery}
									/>
								))}
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	order_history: state.delivery_user.order_history,
});

export default connect(
	mapStateToProps,
	{ updateDeliveryUserInfo, updateDeliveryOrderHistory }
)(Account);
