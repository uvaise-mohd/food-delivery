import React, { Component } from "react";

import Footer from "../Footer";
import Meta from "../../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateStoreUserInfo, logoutUser } from "../../../../services/Store/user/actions";
import FeatherIcon from 'feather-icons-react';
import Axios from "axios";
import DelayLink from "../../../helpers/delayLink";
import TopBar from "../TopBar";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import Fade from 'react-reveal/Fade';
import CountTo from "react-count-to";
import Ink from "react-ink";
import Loading from "../../../helpers/loading"
import { PieChart } from 'react-minimal-pie-chart';
import Moment from "react-moment";

class Reports extends Component {

	state = {
		stores: [],
		order_count: 0,
		date_from: new Date(),
		date_to: new Date(),
		current_date_type: 'today',
		datePopup: false,
		sale_amount: null,
		loading: true,
		on_going: 0,
		cancelled_orders: 0,
		settlementsPopup: false,
		settlements: [],
		payoutPopup: false,
		payouts: []
	};
	componentDidMount() {

		this._fetchOrderData('today');



	}
	onChangeFrom = (date) => this.setState({ date_from: date });
	onChangeTo = (date) => this.setState({ date_to: date });

	_fetchOrderData = (cuurent_date_type) => {
		Axios
			.post('https://chopze.com/public/api/store/get-report-data', {
				token: this.props.store_user.data.auth_token,
				current_date_type: cuurent_date_type,
				date_from: this.state.date_from,
				date_to: this.state.date_to,

			})
			.then((response) => {

				this.setState({
					order_count: response.data.order_count,
					on_going: response.data.on_going,
					cancelled_orders: response.data.cancelled_orders,
					sale_amount: response.data.sale_amount,
					loading: false,
				});


			});
	}

	exportReportData
	handlePopupOpen = () => {
		this.setState({ datePopup: true });
	};
	handlePopupClose = () => {
		this.setState({ datePopup: false });
	};

	handleSettlementsPopupOpen = () => {
		this.setState({ settlementsPopup: true, loading: true });

		Axios
			.post('https://chopze.com/public/api/store/get-restaurant-payout-summary', {
				token: this.props.store_user.data.auth_token
			})
			.then((response) => {

				this.setState({
					settlements: response.data,
					loading: false
				});


			});
	};
	handleSettlmenetsPopupClose = () => {
		this.setState({ settlementsPopup: false });
	};


	handlePayoutsPopupOpen = () => {
		this.setState({ payoutPopup: true, loading: true });

		Axios
			.post('https://chopze.com/public/api/store/get-restaurant-payouts', {
				token: this.props.store_user.data.auth_token
			})
			.then((response) => {

				this.setState({
					payouts: response.data,
					loading: false
				});


			});
	};
	handlePayoutsPopupClose = () => {
		this.setState({ payoutPopup: false });
	};


	applyCustomDates() {
		this.setState({
			datePopup: false,
			current_date_type: 'custom',
			loading: true,
		});

		this._fetchOrderData('custom');
	};

	applyToday() {
		this.setState({
			current_date_type: 'today',
			loading: true,
		});
		this._fetchOrderData('today');

	}

	applyThisWeek() {
		this.setState({
			current_date_type: 'this-week',
			loading: true,
		});

		this._fetchOrderData('this-week');
	}

	render() {
		const { store_user } = this.props;
		const roundedIconStyle = {
			backgroundColor: '#ef5350', width: '35px',
			height: '35px',
			padding: '5px',
			borderRadius: '50%', marginBottom: '5px'
		};
		if (!store_user) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/store/login"} />
			);
		}


		if (this.state.loading === true) {
			return (
				<Loading />
			);
		} else {
			const dataEntry = [
				{ title: 'Completed', value: this.state.order_count, color: '#42a5f5' },
				{ title: 'Cancelled', value: this.state.cancelled_orders, color: '#ef5350' },
				{ title: 'On-Going', value: this.state.on_going, color: '#efb70b' },
			];

			return (
				<React.Fragment>
					<Meta
						seotitle={'Reports | Chopze Store'}
						seodescription={localStorage.getItem("seoMetaDescription")}
						ogtype="website"
						ogtitle={localStorage.getItem("seoOgTitle")}
						ogdescription={localStorage.getItem("seoOgDescription")}
						ogurl={window.location.href}
						twittertitle={localStorage.getItem("seoTwitterTitle")}
						twitterdescription={localStorage.getItem("seoTwitterDescription")}
					/>
					<TopBar
						logo={false}
						boxshadow={true}
						has_title={true}
						disable_search={true}
						disable_back_button={false}
						has_delivery_icon={true}
					/>
					<React.Fragment>
						<div style={{ height: '120vh' }} className="bg-grey pt-15">

							<div className="row mt-50 pr-20  pl-20" style={{ "overflowX": "scroll", "overflowY": "hidden", height: '10vh' }}>
								<div onClick={() => this.applyToday()} className='btn btn-square btn-outline-primary m-10'>
									Today {this.state.current_date_type == 'today' && (
										<FeatherIcon icon="check-circle" size="11" stroke="#42a5f5" />
									)}
								</div>

								<div onClick={() => this.applyThisWeek()} className='btn btn-square btn-outline-primary m-10'>
									This Week {this.state.current_date_type == 'this-week' && (
										<FeatherIcon icon="check-circle" size="11" stroke="#42a5f5" />
									)}
								</div>

								<div onClick={this.handlePopupOpen} className='btn btn-square btn-outline-primary m-10'>
									Custom {this.state.current_date_type == 'custom' && (
										<FeatherIcon icon="check-circle" size="11" stroke="#42a5f5" />
									)}
								</div>

							</div>

							<div className="row gutters-tiny px-15">

								<div className="col-6">
									<div
										className="block shadow-light rounded"
										style={{ position: "relative", background: ' linear-gradient(to right, #fffff, #ffff)' }}
									>
										<div className="block-content block-content-full clearfix text-black">
											<div style={{
												backgroundColor: '#60b246', width: '35px',
												height: '35px',
												padding: '5px',
												borderRadius: '50%', marginBottom: '5px'
											}}>
												<FeatherIcon icon="shopping-bag" stroke="white" />
											</div>

											<div className="font-size-h3 font-w600">

												<CountTo
													to={this.state.order_count}
													speed={1000}
													className="font-size-h3 font-w600"
													easing={(t) => {
														return t < 0.5
															? 16 * t * t * t * t * t
															: 1 + 16 * --t * t * t * t * t;
													}}

												/>

												<div className="font-size-sm font-w600 text-muted">
													Orders Received
												</div>
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</div>
								</div>

								<div className="col-6">
									<div
										className="block shadow-light rounded"
										style={{ position: "relative", background: ' linear-gradient(to right, #fffff, #ffff)' }}
									>
										<div className="block-content block-content-full clearfix text-black">
											<div style={{
												backgroundColor: '#ef5350', width: '35px',
												height: '35px',
												padding: '5px',
												borderRadius: '50%', marginBottom: '5px'
											}}>
												<FeatherIcon icon="calendar" stroke="white" />
											</div>

											<div className="font-size-h3 font-w600">
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												<CountTo
													to={this.state.sale_amount}
													speed={1000}
													className="font-size-h3 font-w600"
													easing={(t) => {
														return t < 0.5
															? 16 * t * t * t * t * t
															: 1 + 16 * --t * t * t * t * t;
													}}
													digits={2}

												/>

												<div className="font-size-sm font-w600 text-muted">
													Turnover
												</div>
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</div>
								</div>

							</div>
							<React.Fragment>
								<div className="mt-20  bg-white mx-15 py-15 ">
									<h4 className="ml-20 mb-0">Statistics</h4>
									<PieChart
										data={dataEntry}
										label={({ dataEntry }) => dataEntry.title + '(' + dataEntry.value + ')'}
										lineWidth={15}
										rounded
										labelStyle={(index) => ({
											fill: dataEntry[index].color,
											fontSize: '6px',
											fontFamily: 'sans-serif',
										})}
										labelPosition={75}
										style={{ height: '250px' }}
									/>
								</div>
							</React.Fragment>

							<React.Fragment>
								<div className="mt-20  bg-white mx-15 mb-15 p-15 ">
									<div className="row">
										<div className="col-6 d-flex justify-content-center font-weight-bold p-5 " onClick={() => this.handlePayoutsPopupOpen()} style={{ position: "relative" }}>

											<div style={roundedIconStyle}>
												<FeatherIcon icon="file-text" stroke="white" />
											</div>
											<span className="m-10">Payout Statuses</span>
											<Ink duration="500" hasTouch="true" />

										</div>
										<div className="col-6  d-flex justify-content-center  font-weight-bold p-5" onClick={() => this.handleSettlementsPopupOpen()} style={{ position: "relative" }}>
											<div style={roundedIconStyle}>
												<FeatherIcon icon="briefcase" background={0} stroke="white" />
											</div>
											<span className="m-10">Settlements</span>

											<Ink duration="500" background="false" hasTouch="true" />
										</div>
									</div>
								</div>
							</React.Fragment>

						</div>

					</React.Fragment>



					{this.state.datePopup == true && (
						<React.Fragment>
							<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
								<Fade bottom >
									<div className="bg-white" style={{ height: 'auto', left: '0', padding: '20px', width: '100%', bottom: '0px', position: 'fixed', zIndex: '9999', paddingBottom: '6rem' }}>
										<h4>Custom Date Picker</h4>
										<div className="row">
											<div className="col-2" >From</div>
											<div className="col-10" ><DatePicker
												onChange={this.onChangeFrom}
												value={this.state.date_from}
												clearIcon={true}
											/></div>
										</div>
										<div className="row">
											<div className="col-2" >To</div>
											<div className="col-10" ><DatePicker
												onChange={this.onChangeTo}
												value={this.state.date_to}
												clearIcon={true}
											/></div>
										</div>

										<div onClick={() => this.applyCustomDates()} className="btn btn-square btn-outline-primary pull-right"> Apply </div>

									</div>
								</Fade>
							</div>
						</React.Fragment>
					)}

					{this.state.settlementsPopup == true && (
						<React.Fragment>
							<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
								<Fade bottom >
									<div className="bg-white" style={{ height: '100%', left: '0', padding: '20px', width: '100%', bottom: '0px', position: 'fixed', zIndex: '9999', paddingBottom: '6rem' }}>
										<div className="pull-right" onClick={() => this.handleSettlmenetsPopupClose()}>
											<FeatherIcon icon="x-circle" size="30" />
										</div>

										<div className="mt-50 " style={{ "height": "100%", "width": "100%", "overflowY": "scroll", "paddingBottom": "80px" }}>

											<div className="row my-10" >
												<div className="col-4 font-weight-bold">Date</div>
												<div className="col-3 font-weight-bold">Amount</div>
												<div className="col-5 font-weight-bold">Status</div>
											</div>
											{this.state.settlements && this.state.settlements.map((settlement) => (
												<div className="row my-10" key={settlement.id}>
													<div className="col-4"><Moment format="DD/MM/YYYY">{settlement.created_at}</Moment></div>
													<div className="col-3">{localStorage.getItem("currencyFormat")}{settlement.amount}</div>
													<div className="col-5">
														<span className="btn btn-square btn-sm btn-outline-success rounded min-width-100">Completed</span>
													</div>
												</div>
											))}
										</div>
									</div>
								</Fade>
							</div>
						</React.Fragment>
					)}

					{this.state.payoutPopup == true && (
						<React.Fragment>
							<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
								<Fade bottom >
									<div className="bg-white" style={{ height: '100%', left: '0', padding: '20px', width: '100%', bottom: '0px', position: 'fixed', zIndex: '9999', paddingBottom: '6rem' }}>
										<div className="pull-right" onClick={() => this.handlePayoutsPopupClose()}>
											<FeatherIcon icon="x-circle" size="30" />
										</div>

										<div className="mt-50 " style={{ "height": "100%", "width": "100%", "overflowY": "scroll", "paddingBottom": "80px" }}>

											<div className="row my-10" >
												<div className="col-4 font-weight-bold">Date</div>
												<div className="col-3 font-weight-bold">Amount</div>
												<div className="col-5 font-weight-bold">Status</div>
											</div>
											{this.state.payouts && this.state.payouts.map((payout) => (

												<div className="row my-15" key={payout.id}>
													<div className="col-3"><Moment format="DD/MM/YYYY">{payout.created_at}</Moment></div>
													<div className="col-3">{localStorage.getItem("currencyFormat")}{payout.amount}</div>
													<div className="col-6">
														{payout.status === 'COMPLETED' || payout.status === 'BANKCOMPLETED' ? (
															<span className="btn btn-square btn-sm btn-outline-success rounded min-width-100">{payout.status}</span>
														) : (
															<span className="btn btn-square btn-sm btn-outline-primary rounded min-width-100">{payout.status}</span>
														)}
														<DelayLink to={'/store/orders/' + payout.created_at}><FeatherIcon style={{ marginBottom: '-12px', marginLeft: '5px' }} icon="file-text" size="30" /></DelayLink>
													</div>
												</div>
											))}
										</div>
									</div>
								</Fade>
							</div>
						</React.Fragment>
					)}

					<div style={{
						"position": "fixed",
						"bottom": "6rem",
						"right": "1rem",
						"padding": "1.5rem",
						"borderRadius": "100%",
						"backgroundColor": "rgb(38, 160, 252)",
					}}><FeatherIcon icon="download-cloud" size="24" stroke="white" /> </div>
					<Footer active_reports={true} />
				</React.Fragment>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo, logoutUser }
)(Reports);
