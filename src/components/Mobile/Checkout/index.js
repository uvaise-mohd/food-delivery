import React, { Component } from "react";
import Meta from "../../helpers/meta";
import PaymentList from "./PaymentList";
import { Redirect } from "react-router";
import { checkConfirmCart } from "../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { GoogleApiWrapper } from "google-maps-react";
import Loading from "../../helpers/loading";
import { ArrowLeft } from "react-iconly";

class Checkout extends Component {
	state = {
		loading: false,
		process_distance_calc_loading: false,
		continueFetchPaymentGateway: true,
		gateways_received: false,
		toPay: "",
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
		if (!this.props.confirmCart) {
			return <Redirect to={"/cart"} />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		return (
			<React.Fragment>
				{this.state.loading && <Loading />}
				{this.state.process_distance_calc_loading && <Loading />}
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<div className="bg-white" style={{ minHeight: '100vh' }}>
					<div style={{ "position": "absolute", "top": "15px", "left": "15px" }} onClick={() => this.context.router.history.goBack()}>
						<ArrowLeft />
					</div>
					<div className="text-center pt-15" style={{ "ontSize": "15px", "fontWeight": "bolder" }}>
						Payment
					</div>
					<div className="pt-20">
						<div className="font-w600 my-10 ml-20">Choose a Payment Method</div>
						<PaymentList
							handleProcessDistanceCalcLoading={this.handleProcessDistanceCalcLoading}
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
});

// export default connect(
// 	mapStateToProps,
// 	{ checkConfirmCart, getPaymentGateways }
// )(Checkout);

export default GoogleApiWrapper({
	apiKey: localStorage.getItem("googleApiKey"),
	LoadingContainer: Loading,
})(
	connect(
		mapStateToProps,
		{
			checkConfirmCart,
		}
	)(Checkout)
);
