import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import { Helmet } from "react-helmet";
import PaypalExpressBtn from "react-paypal-express-checkout";
import PaystackButton from "react-paystack";
import { RAZORPAY_PAYMENT_URL } from "../../../../configs";
import { PAYMONGO_PAYMENT_URL } from "../../../../configs";
import { MERCADOPAGO_PAYMENT_URL } from "../../../../configs";
import { PAYTM_PAYMENT_URL } from "../../../../configs";

import { connect } from "react-redux";
import { formatPrice } from "../../../helpers/formatPrice";

import { placeOrder } from "../../../../services/checkout/actions";
import { updateUserInfo } from "../../../../services/user/actions";
import { calculateDistance } from "../../../helpers/calculateDistance";
import calculateDistanceGoogle from "../../../helpers/calculateDistanceGoogle.js";
import Axios from "axios";
import axios from "axios";

import { getRestaurantInfoById } from "../../../../services/items/actions";
import Fade from 'react-reveal/Fade';
import Dialog from "@material-ui/core/Dialog";
import { Redirect } from "react-router";
import { ShieldDone } from "react-iconly";

class PaymentList extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		payment_gateway_loading: false,
		loading: false,
		stripe_opened: false,
		delivery_charges: 0.0,
		error: false,
		razorpay_opened: false,
		razorpay_success: false,
		canPayPartialWithWallet: false,
		walletChecked: false,
		canPayFullWithWallet: false,
		distance: 0,
		placeOrderError: false,
		errorMessage: "",

		payWithStripeCard: false,
		payWithStripeIdeal: false,
		payWithStripeFpx: false,

		paymongoCCNumber: "",
		paymongoCCExp: "",
		paymongoCCCvv: "",
		showPaymongoForm: false,
		paymongoRedirect: "",
		paymongo_processing: false,
		order_succes: false,
		order_confirm: false,
		order_online_confirm: false
	};

	componentDidMount() {
		const { user } = this.props;

		if (localStorage.getItem("activeRestaurant") !== null) {
			this.props.getRestaurantInfoById(localStorage.getItem("activeRestaurant")).then((response) => {
				if (response) {
					if (response.payload.id) {
						this.__doesRestaurantOperatesAtThisLocation(response.payload);
					}
				}
			});
		}

		if (user.success) {
			this.props.updateUserInfo(user.data.id, user.data.auth_token, null);
		}

		if (localStorage.getItem("userSelected") === "SELFPICKUP") {
			this.setState({ delivery_charges: 0.0 });
		} else {
			this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
		}

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.gatewayStatus) {
			// this.props.handleLoading(false);
			this.setState({ payment_gateway_loading: false });
		}

		if (nextProps.checkout !== this.props.checkout) {
			//remove coupon
			localStorage.removeItem("appliedCoupon");

			if (nextProps.checkout.data.payment_mode === "PAYMONGO") {
				if (this.state.paymongoRedirect !== "") {
					window.location = this.state.paymongoRedirect;
					return null;
				}
			}

			if (nextProps.checkout.data.payment_mode === "MERCADOPAGO") {
				window.location = MERCADOPAGO_PAYMENT_URL + "/" + nextProps.checkout.data.id;
				return null;
			}

			//for stripe ideal, fpx and 3d
			if (nextProps.checkout.data.order_status_id !== 8 && (nextProps.checkout.data.payment_mode == 'COD' || nextProps.checkout.data.payment_mode == 'WALLET')) {
				//if order_status_id is not Awaiting payment then
				//redirect to running order page
				this.setState({ order_succes: true, order_confirm: false });
				setTimeout(() => {
					this.context.router.history.push("/my-orders");
				}, 5000);
			}

			if (nextProps.checkout.data.payment_mode !== 'COD' && nextProps.checkout.data.payment_mode !== 'WALLET') {
				this.launchRazor(nextProps.checkout.data, this.props.history, this.sendOrderCompleteResponse, this.successRazor);
			}
		}

		//if  > 0 then user can pay with wallet (Amount will be deducted)
		if (nextProps.user.data.wallet_balance > 0) {
			// console.log("Can pay partial with wallet");
			this.setState({ canPayPartialWithWallet: true, canPayFullWithWallet: false });
		}

		if (nextProps.user.data.wallet_balance >= parseFloat(this.getTotalAfterCalculation())) {
			// console.log("Can pay full with wallet");
			this.setState({ canPayFullWithWallet: true, canPayPartialWithWallet: false });
		}
	}

	sendOrderCompleteResponse = (id, payment_id, order_id, signature) => {
		axios.post('https://app.snakyz.com/public/api/process-razorpay-state-update', {
			id: id,
			token: this.props.user.data.auth_token,
			payment_id,
			order_id,
			signature
		});
	};

	launchRazor = (order, history, runFunction, successRazor) => {
		console.log(parseFloat(order.payable).toFixed(2));
		axios.post('https://app.snakyz.com/public/api/process-razorpay', {
			amount: parseFloat(order.payable).toFixed(2),
			id: order.id,
			token: this.props.user.data.auth_token
		})
			.then((res) => {
				// console.log(res.data.response.id);
				if (res.data.razorpay_success) {

					if (!window.ReactNativeWebView) {
						const options = {
							key: 'rzp_live_qiEWGfEpXiaboK',
							amount: parseFloat(order.payable).toFixed(2),
							name: 'Chopze Delivery',
							currency: 'INR',
							order_id: res.data.response.id,
							payment_capture: 1,
							method: {
								netbanking: true,
								card: true,
								wallet: false,
								upi: true
							},

							handler(response) {
								console.log("Final Response", response);
								runFunction(order.id, response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);

								successRazor();
							},
							modal: {
								ondismiss: function () {
									console.log("closed");
								},
								confirm_close: true
							},
							prefill: {
								name: this.props.user.data.name,
								contact: this.props.user.data.phone,
							},

						};
						const rzp1 = new window.Razorpay(options);
						rzp1.open();
					} else {
						// Its from ReactNativeWebView .. Hence Launching Native RazorPay
						const options = {
							key: 'rzp_live_qiEWGfEpXiaboK',
							amount: parseFloat(order.payable).toFixed(2),
							name: 'Chopze Delivery',
							currency: 'INR',
							order_id: res.data.response.id,
							payment_capture: 1,
							method: {
								netbanking: true,
								card: true,
								wallet: false,
								upi: true
							},
							prefill: {
								name: this.props.user.data.name,
								contact: this.props.user.data.phone,
							},
						};

						const response = {
							type: 'razor_pay_initiate',
							data: {
								options: options,
								order_id: order.id,
								auth_token: this.props.user.data.auth_token
							}
						};

						window.ReactNativeWebView.postMessage(JSON.stringify(response));

					}

				}
			});
	}

	successRazor = () => {
		this.setState({ order_succes: true, order_confirm: false });
		setTimeout(() => {
			this.context.router.history.push("/my-orders");
		}, 5000);
	}

	__doesRestaurantOperatesAtThisLocation = (restaurant_info) => {
		//send user lat long to helper, check with the current restaurant lat long and setstate accordingly
		const { user } = this.props;
		if (user.success) {
			let self = this;

			if (localStorage.getItem("enGDMA") === "true") {
				if (localStorage.getItem("userSelected") === "DELIVERY") {
					this.props.handleProcessDistanceCalcLoading(true);
				}
				calculateDistanceGoogle(
					restaurant_info.longitude,
					restaurant_info.latitude,
					user.data.default_address.longitude,
					user.data.default_address.latitude,
					this.props.google,
					function (distance) {
						if (localStorage.getItem("userSelected") === "DELIVERY") {
							if (self.props.restaurant_info.delivery_charge_type === "DYNAMIC") {
								self.setState({ distance: distance }, () => {
									//check if restaurant has dynamic delivery charge..
									self.calculateDynamicDeliveryCharge();
								});
							}
							self.props.handleProcessDistanceCalcLoading(false);
						}
					}
				);
			} else {
				const distance = calculateDistance(
					restaurant_info.longitude,
					restaurant_info.latitude,
					user.data.default_address.longitude,
					user.data.default_address.latitude
				);
				if (localStorage.getItem("userSelected") === "DELIVERY") {
					if (this.props.restaurant_info.delivery_charge_type === "DYNAMIC") {
						this.setState({ distance: distance }, () => {
							//check if restaurant has dynamic delivery charge..
							this.calculateDynamicDeliveryCharge();
						});
					}
				}
			}
		}
	};

	clearCart = () => {
		const { cartProducts, updateCart, removeCoupon } = this.props;
		cartProducts.splice(0, cartProducts.length);
		this.closeFloatCart();
		removeCoupon();
		setTimeout(() => {
			updateCart(cartProducts);
		}, 500);
		this.addProduct(this.state.product);
		this.openFloatCart();
		this.setState({ open: !this.state.open, product: [] });
		localStorage.setItem("cleared", "true");
	};

	calculateDynamicDeliveryCharge = () => {
		const { restaurant_info } = this.props;

		const distanceFromUserToRestaurant = this.state.distance;
		// console.log("Distance from user to restaurant: " + distanceFromUserToRestaurant + " km");

		if (distanceFromUserToRestaurant > restaurant_info.base_delivery_distance) {
			const extraDistance = distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
			// console.log("Extra Distance: " + extraDistance + " km");

			const extraCharge =
				(extraDistance / restaurant_info.extra_delivery_distance) * restaurant_info.extra_delivery_charge;
			// console.log("Extra Charge: " + extraCharge);

			let dynamicDeliveryCharge = parseFloat(restaurant_info.base_delivery_charge) + parseFloat(extraCharge);
			if (localStorage.getItem("enDelChrRnd") === "true") {
				dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
			}

			// console.log("Total Charge: " + dynamicDeliveryCharge);
			this.setState({ delivery_charges: dynamicDeliveryCharge }, () => {
				this.processPayWithWalletBlocks();
			});
		} else {
			this.setState({ delivery_charges: restaurant_info.base_delivery_charge }, () => {
				this.processPayWithWalletBlocks();
			});
		}
	};

	processPayWithWalletBlocks = () => {
		if (this.props.user.data.wallet_balance > 0) {
			console.log("Can pay partial with wallet");
			this.setState({ canPayPartialWithWallet: true, canPayFullWithWallet: false });
		}

		if (this.props.user.data.wallet_balance >= parseFloat(this.getTotalAfterCalculation())) {
			console.log("Can pay full with wallet");
			this.setState({ canPayFullWithWallet: true, canPayPartialWithWallet: false });
		}
	};

	/* Stripe */
	onOpened = () => {
		this.setState({ stripe_opened: true });
	};
	onToken = (payment_token) => {
		const method = "STRIPE";
		this.__placeOrder(payment_token, method);
	};
	/* END Stripe */

	/* Paypal */
	onSuccess = (payment) => {
		const payment_token = "";
		const method = "PAYPAL";
		this.__placeOrder(payment_token, method);
	};

	onCancel = (data) => {
		console.log("Paypal Payment Canceled");
	};

	onError = (err) => {
		console.log("Error!");
	};
	/* END Paypal */

	/* PayStack */
	callback = (response) => {
		if (response.status === "success") {
			const payment_token = response.reference;
			const method = "PAYSTACK";
			this.__placeOrder(payment_token, method);
		} else {
			console.log(response);
		}
	};

	close = () => {
		console.log("PayStack Payment Closed");
	};

	getReference = () => {
		//you can put any unique reference implementation code here
		let text = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

		for (let i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};
	/* END PayStack */

	__placeOrder = (payment_token, method, pending_payment = false) => {
		// disable all button Onclick with pointer events
		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.add("no-click");
		}

		let tipAmount = null;
		let is_scheduled = 0;
		let scheduled_date = null;
		let scheduled_time = null;
		console.log("cart_tips", JSON.parse(localStorage.getItem("cart_tips")));
		if (JSON.parse(localStorage.getItem("cart_tips")) != null) {
			tipAmount = JSON.parse(localStorage.getItem("cart_tips")).value;
		}

		if (localStorage.getItem("schedule_date") && localStorage.getItem("schedule_time")) {
			is_scheduled = 1;
			scheduled_date = localStorage.getItem("schedule_date");
			scheduled_time = localStorage.getItem("schedule_time");
		}

		let device = this.getDevice();

		const { user, cartProducts, coupon, cartTotal } = this.props;
		if (user.success) {
			if (localStorage.getItem("userSelected") === "SELFPICKUP") {
				this.props
					.placeOrder(
						user,
						cartProducts,
						coupon.success ? coupon : null,
						JSON.parse(localStorage.getItem("userSetAddress")),
						localStorage.getItem("orderComment"),
						cartTotal,
						method,
						payment_token,
						2,
						this.state.walletChecked,
						parseFloat(this.state.distance),
						pending_payment,
						null,
						is_scheduled,
						scheduled_date,
						scheduled_time,
						device
					)
					.then((response) => {
						if (response) {
							if (!response.success) {
								this.setState({ placeOrderError: true, errorMessage: response.message });
								if (response.status === 429) {
									this.setState({ errorMessage: "Too Many Calls..." });
								}
								this.resetPage();
							}
							if (response.success) {
								this.clearCart();
							}
						}
					});
			} else {
				this.props
					.placeOrder(
						user,
						cartProducts,
						coupon.success ? coupon : null,
						JSON.parse(localStorage.getItem("userSetAddress")),
						localStorage.getItem("orderComment"),
						cartTotal,
						method,
						payment_token,
						1,
						this.state.walletChecked,
						parseFloat(this.state.distance),
						pending_payment,
						tipAmount,
						is_scheduled,
						scheduled_date,
						scheduled_time,
						device
					)
					.then((response) => {
						if (response) {
							console.log("Came here");
							console.log("THIS", response);
							if (response.status === 401) {
								this.setState({
									placeOrderError: true,
									errorMessage: "In Active User",
								});
								this.resetPage();
							} else if (!response.success) {
								this.setState({ placeOrderError: true, errorMessage: response.message });
								if (response.status === 429) {
									this.setState({ errorMessage: "Too Many Calls..." });
								}
								this.resetPage();
							}

							if (response.success) {
								this.clearCart();
							}
						}
					});
			}

			//show progress bar
			const progressBar = document.getElementById("progressBar");
			progressBar.classList.remove("hidden");
			let progress = 0;
			var foo = setInterval(function () {
				if (progress > 100) {
					clearInterval(foo);
				}
				progress = progress + 1;
				progressBar.style.width = progress + "%";
			}, 20);

			this.setState({ stripe_opened: false });
		}
	};

	getDevice = () => {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		
		if (/android/i.test(userAgent)) {
			return "Android";
		}

		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
			return "iOS";
		}

		return "Website";
	}

	resetPage = () => {
		const progressBar = document.getElementById("progressBar");
		progressBar.classList.add("hidden");
		setTimeout(() => {
			progressBar.style.width = "0%";
		}, 2200);

		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.remove("no-click");
		}
	};
	// Calculating total with/without coupon/tax
	getTotalAfterCalculation = () => {
		const { coupon, restaurant_info, user } = this.props;

		var tips = JSON.parse(localStorage.getItem("cart_tips"));

		const total = this.props.cartTotal.totalPrice;
		let calc = 0;
		if (coupon.code) {
			if (coupon.discount_type === "PERCENTAGE") {
				let percentage_discount = formatPrice((coupon.coupon_discount / 100) * parseFloat(total));
				if (coupon.max_discount) {
					if (parseFloat(percentage_discount) >= coupon.max_discount) {
						percentage_discount = coupon.max_discount;
					}
				}
				coupon.appliedAmount = percentage_discount;
				calc = formatPrice(
					formatPrice(
						parseFloat(total) -
						percentage_discount +
						parseFloat(restaurant_info.store_charges || 0.0)
					)
				);
			} else {
				calc = formatPrice(
					parseFloat(total) -
					(parseFloat(coupon.coupon_discount) || 0.0) +
					((parseFloat(restaurant_info.store_charges) || 0.0))
				);
			}
		} else {
			calc = formatPrice(
				parseFloat(total) +
				parseFloat(restaurant_info.store_charges || 0.0)
			);
		}

		if (restaurant_info.tax && restaurant_info.tax > 0) {
			calc = formatPrice(
				parseFloat(
					parseFloat(calc) + parseFloat(parseFloat(restaurant_info.tax) / 100) * calc
				)
			);
		}

		if (restaurant_info.convenience_fee && restaurant_info.convenience_fee > 0) {
			calc = formatPrice(
				parseFloat(calc) +
				parseFloat(restaurant_info.convenience_fee)
			);
		}

		if (localStorage.getItem("userSelected") === "DELIVERY" && restaurant_info.city && restaurant_info.city.is_surge == 1 && restaurant_info.city.surge_fee && restaurant_info.city.surge_fee > 0) {
			calc = formatPrice(
				parseFloat(calc) +
				parseFloat(restaurant_info.city.surge_fee)
			);
		}

		if (this.state.delivery_charges && this.state.delivery_charges > 0) {
			calc = formatPrice(
				parseFloat(calc) +
				parseFloat(this.state.delivery_charges || 0.0)
			);
		}

		if (this.state.walletChecked && user.data.wallet_balance < calc) {
			calc = calc - user.data.wallet_balance;
		}

		if (tips && tips.value > 0) {
			calc = parseFloat(calc) + parseFloat(tips.value);
		}
		return formatPrice(calc);
	};

	/* Razorpay */
	__handleRazorPay = () => {
		let self = this;
		this.setState({ razorpay_opened: true });
		const totalAmount = formatPrice(parseFloat(this.getTotalAfterCalculation()));

		Axios.post(RAZORPAY_PAYMENT_URL, {
			totalAmount: totalAmount,
		})
			.then((res) => {
				// console.log(res.data.response.id);
				if (res.data.razorpay_success) {
					const options = {
						key: localStorage.getItem("razorpayKeyId"),
						amount: totalAmount,
						name: localStorage.getItem("storeName"),
						currency: localStorage.getItem("currencyId"),
						order_id: res.data.response.id,
						handler(response) {
							// console.log("Final Response", response);
							self.setState({ razorpay_opened: false, razorpay_success: true });
							const payment_token = "";
							const method = "RAZORPAY";
							self.__placeOrder(payment_token, method);
						},
						modal: {
							ondismiss: function () {
								console.log("closed");
								self.setState({ razorpay_opened: false, razorpay_success: false });
							},
						},
						prefill: {
							name: this.props.user.data.name,
							email: this.props.user.data.email,
							contact: this.props.user.data.phone,
						},
					};
					const rzp1 = new window.Razorpay(options);

					rzp1.open();
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
	/* END Razorpay */

	/* Paymongo */
	handleInput = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	__showPaymongoForm = () => {
		this.setState({ showPaymongoForm: true });
	};

	openConfirmOrder = () => {
		this.setState({ order_confirm: true });
	};

	handleClose = () => {
		this.setState({ order_confirm: false });
	};

	openConfirmOrderOnline = () => {
		this.setState({ order_online_confirm: true });
	};

	handleCloseOnline = () => {
		this.setState({ order_online_confirm: false });
	};

	handlePaymongo = (event) => {
		event.preventDefault();

		const paymongoCCNumber = this.state.paymongoCCNumber;
		const paymongoCCExp = this.state.paymongoCCExp;
		const paymongoCCCvv = this.state.paymongoCCCvv;

		if (paymongoCCNumber === "" || paymongoCCExp === "" || paymongoCCCvv === "") {
			this.setState({ placeOrderError: true, errorMessage: "Please enter credit card details." });
		} else {
			this.props.handleLoading(true);
			this.setState({ paymongo_processing: true });
			let self = this;
			this.setState({ paymongo_opened: true, showPaymongoForm: false, placeOrderError: false, errorMessage: "" });
			const totalAmount = formatPrice(parseFloat(this.getTotalAfterCalculation()));
			const method = "PAYMONGO";
			Axios.post(PAYMONGO_PAYMENT_URL, {
				amount: totalAmount,
				name: this.props.user.data.name,
				email: this.props.user.data.email,
				phone: this.props.user.data.phone,
				ccNum: paymongoCCNumber,
				ccExp: paymongoCCExp,
				ccCvv: paymongoCCCvv,
			})
				.then((res) => {
					console.log(res);

					if (res.data.paymongo_success) {
						if (res.data.status === "succeeded") {
							self.setState({ paymongo_opened: false, paymongo_success: true });
							this.__placeOrder(res.data.token, method, false);
						} else if (res.data.status === "awaiting_next_action") {
							console.log("3d secure");
							self.setState({
								paymongo_opened: false,
								paymongo_success: true,
								paymongoRedirect: res.data.redirect_url,
							});
							this.__placeOrder(res.data.token, method, true);
						} else {
							this.props.handleLoading(false);
							self.setState({
								paymongo_processing: false,
								paymongo_opened: true,
								paymongo_success: false,
								placeOrderError: true,
								errorMessage: "Payment failed: " + res.data.error,
							});
						}
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		}
	};

	/* END Paymongo */

	handlePayWithStripeCardToggle = (event) => {
		this.setState({ payWithStripeCard: !this.state.payWithStripeCard }, () => {
			if (this.state.payWithStripeCard) {
				this.refs.payWithStripeCardToggle.classList.add("stripe-toggle-active");
				this.refs.payWithStripeCardToggle.scrollIntoView({ behavior: "instant", block: "start" });
			} else {
				this.refs.payWithStripeCardToggle.classList.remove("stripe-toggle-active");
			}
		});
	};
	handlePayWithStripeIdealToggle = (event) => {
		this.setState({ payWithStripeIdeal: !this.state.payWithStripeIdeal }, () => {
			if (this.state.payWithStripeIdeal) {
				this.refs.payWithStripeIdealToggle.classList.add("stripe-toggle-active");
				this.refs.payWithStripeIdealToggle.scrollIntoView({ behavior: "instant", block: "start" });
			} else {
				this.refs.payWithStripeIdealToggle.classList.remove("stripe-toggle-active");
			}
		});
	};
	handlePayWithStripeFpxToggle = (event) => {
		this.setState({ payWithStripeFpx: !this.state.payWithStripeFpx }, () => {
			if (this.state.payWithStripeFpx) {
				this.refs.payWithStripeFpxToggle.classList.add("stripe-toggle-active");
				this.refs.payWithStripeFpxToggle.scrollIntoView({ behavior: "instant", block: "start" });
			} else {
				this.refs.payWithStripeFpxToggle.classList.remove("stripe-toggle-active");
			}
		});
	};
	handlePaymentGatewayRedirect = (url) => {
		console.log("I am here");
		console.log("Placed order", this.props.checkout.id);
		const redirectUrl = url + "&order_id=" + this.props.checkout.id;
		window.location.replace(redirectUrl);
	};

	/* FlutterWave */
	__processFlutterWave = () => {
		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.add("no-click");
		}
		let flutterWaveBtn = document.getElementsByClassName("flutterwave-btn")[0];
		flutterWaveBtn.click();
	};
	/*END FlutterWave */

	render() {
		const client = {
			sandbox: localStorage.getItem("paypalSandboxKey"),
			production: localStorage.getItem("paypalProductionKey"),
		};

		this.props.toPay(formatPrice(parseFloat(this.getTotalAfterCalculation())));

		const gateways = [
			{ name: 'COD' }
		]

		if (this.props.restaurant_info) {
			if (!this.props.restaurant_info.is_active) {
				console.log("store is closed");
				return <Redirect to={"/cart"} />;
			}
		}

		return (
			<React.Fragment>
				{this.state.placeOrderError && (
					<div className="auth-error ongoing-payment">
						<div className="error-shake">{this.state.errorMessage}</div>
					</div>
				)}

				{this.props.paymentgateways.some((gateway) => gateway.name === "Razorpay") && (
					<Helmet>
						<script src="https://checkout.razorpay.com/v1/checkout.js" />
					</Helmet>
				)}

				<Dialog
					fullWidth={true}
					fullScreen={false}
					open={this.state.order_succes}
					style={{ width: "90vw", margin: "auto" }}
					PaperProps={{ style: { backgroundColor: "#fff", borderRadius: "10px" } }}
				>
					<img src="https://app.snakyz.com/assets/snaky/order-success.gif" />
					<div style={{ fontWeight: 'bolder', fontSize: '16px', textAlign: 'center' }}>Successful</div>
					<div className="mb-20" style={{ fontWeight: '400', fontSize: '13px', textAlign: 'center' }}>Order Placed Successfully</div>
				</Dialog>

				{this.state.order_confirm == true && (
					<React.Fragment>
						<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
							<Fade bottom>
								<div className="bg-white" style={{ height: 'auto', left: '0', width: '100%', paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', bottom: '0px', position: 'fixed', zIndex: '9999', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
									<div className="d-flex justify-content-end" onClick={this.handleClose}>Close</div>
									<div className="text-center font-w600" style={{ color: '#FF0036', fontSize: '16px' }}>
										Cancellation Policy
									</div>
									<p className="text-center mt-20">If you choose to Cancel, you can do it within 60
										seconds after placing the order. Post which you
										will be charged a 100% cancellation fee. However,
										in the event of an unusual delay of the order , you
										will not be charged a cancellation fee
									</p>
									<button className="paymentGatewayBlock" onClick={() => this.__placeOrder("", "COD")}
										style={{
											fontWeight: '900', color: 'white', backgroundColor: localStorage.getItem("storeColor"),
											borderRadius: '0.8rem', width: '90vw', border: 'none', height: '40px'
										}}
									>
										I UNDERSTAND , PROCEED WITH ORDER
									</button>
								</div>
							</Fade>
						</div>
					</React.Fragment>
				)}

				{this.state.order_online_confirm == true && (
					<React.Fragment>
						<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
							<Fade bottom>
								<div className="bg-white" style={{ height: 'auto', left: '0', width: '100%', paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', bottom: '0px', position: 'fixed', zIndex: '9999', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
									<div className="d-flex justify-content-end" onClick={this.handleCloseOnline}>Close</div>
									<div className="text-center font-w600" style={{ color: '#FF0036', fontSize: '16px' }}>
										Cancellation Policy
									</div>
									<p className="text-center mt-20">If you choose to Cancel, you can do it within 60
										seconds after placing the order. Post which you
										will be charged a 100% cancellation fee. However,
										in the event of an unusual delay of the order , you
										will not be charged a cancellation fee
									</p>
									<button className="paymentGatewayBlock" onClick={() => this.__placeOrder("", "RAZORPAY")}
										style={{
											fontWeight: '900', color: 'white', backgroundColor: localStorage.getItem("storeColor"),
											borderRadius: '0.8rem', width: '90vw', border: 'none', height: '40px'
										}}
									>
										I UNDERSTAND , PROCEED WITH ORDER
									</button>
								</div>
							</Fade>
						</div>
					</React.Fragment>
				)}

				{(this.state.stripe_opened || this.state.razorpay_opened) && (
					<React.Fragment>
						<div className="height-80 overlay-loading ongoing-payment-spin">
							<div className="spin-load" />
						</div>
						<div className="auth-error ongoing-payment">
							<div className="error-shake">{localStorage.getItem("checkoutPaymentInProcess")}</div>
						</div>
					</React.Fragment>
				)}

				<div className="col-12 mb-50">
					{this.state.payment_gateway_loading ? (
						<div className="row">
							<div className="col-12">
								<div className="block block-link-shadow text-left shadow-light">
									<div className="block-content block-content-full clearfix py-3 payment-select-block">
										<ContentLoader
											height={70}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="320" y="10" rx="4" ry="4" width="55" height="55" />
											<rect x="0" y="10" rx="0" ry="0" width="85" height="20" />
											<rect x="0" y="40" rx="0" ry="0" width="190" height="18" />
										</ContentLoader>
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="block block-link-shadow text-left shadow-light">
									<div className="block-content block-content-full clearfix py-3 payment-select-block">
										<ContentLoader
											height={70}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="320" y="10" rx="4" ry="4" width="55" height="55" />
											<rect x="0" y="10" rx="0" ry="0" width="85" height="20" />
											<rect x="0" y="40" rx="0" ry="0" width="190" height="18" />
										</ContentLoader>
									</div>
								</div>
							</div>
						</div>
					) : (
						<React.Fragment>
							<div className="row">
								{this.state.canPayPartialWithWallet && (
									<React.Fragment>
										<div
											className="col-12 mb-20 paymentGatewayBlock"
											onClick={() => this.setState({ walletChecked: !this.state.walletChecked })}
										>
											<div>
												<div className="block-content-full clearfix py-3 payment-select-block d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
													<div className="col-8 font-size-h5 font-w600">
														Wallet
														{this.state.walletChecked && (
															<ShieldDone className="ml-1 pt-2" size="medium" set="broken" primaryColor={localStorage.getItem("storeColor")} />
														)}
														<br />
														<span className="text-muted" style={{ fontSize: '10px' }}>
															<span style={{ color: localStorage.getItem("storeColor") }}><span className="rupees-symbol">₹ </span>{parseFloat(this.getTotalAfterCalculation())}</span>
															&nbsp;(<span className="rupees-symbol">₹ </span>{this.props.user.data.wallet_balance})
														</span>
													</div>
													<div className="col-4 float-right mt-5">
														<img
															src="https://app.snakyz.com/assets/wallet1.png"
															alt={"Wallet"}
															className="img-fluid"
															style={{ height: '4rem', width: '4rem' }}
														/>
													</div>
												</div>
											</div>
										</div>
									</React.Fragment>
								)}
								{this.state.canPayFullWithWallet && (
									<React.Fragment>
										<div
											className="col-12 mb-20 paymentGatewayBlock"
											onClick={() => this.__placeOrder("", "WALLET")}
										>
											<div>
												<div className="block-content-full clearfix py-3 payment-select-block d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
													<div className="col-8 font-size-h5 font-w600">
														Wallet<br /><span className="text-muted" style={{ fontSize: '10px' }}>
															<span style={{ color: localStorage.getItem("storeColor") }}><span className="rupees-symbol">₹ </span>{parseFloat(this.getTotalAfterCalculation())}</span>
															&nbsp;(<span className="rupees-symbol">₹ </span>{this.props.user.data.wallet_balance})
														</span>
													</div>
													<div className="col-4 float-right mt-10">
														<img
															src="https://app.snakyz.com/assets/wallet1.png"
															alt={"Wallet"}
															className="img-fluid"
															style={{ height: '4rem', width: '4rem' }}
														/>
													</div>
												</div>
											</div>
										</div>
										<hr />
									</React.Fragment>
								)}

								{gateways.map((gateway) => (
									<React.Fragment key={gateway.id}>
										{localStorage.getItem("userSelected") === "DELIVERY" &&
											<div
												className="col-12 paymentGatewayBlock"
												onClick={this.openConfirmOrder}
											>
												<div>
													<div className="block-content-full clearfix py-3 payment-select-block d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
														<div className="col-8 font-size-h5 font-w600">
															COD<br /><span className="text-muted" style={{ fontSize: '10px' }}>Cash On Delivery</span>
														</div>
														<div className="col-4 float-right mt-10">
															<img
																src="https://app.snakyz.com/assets/cod-icon.png"
																alt={gateway.name}
																className="img-fluid"
																style={{ height: '4rem', width: '4rem' }}
															/>
														</div>
													</div>
												</div>
											</div>
										}
										{/* <div
											className="col-12 mt-20 paymentGatewayBlock"
											onClick={this.openConfirmOrderOnline}
										>
											<div>
												<div className="block-content-full clearfix py-3 payment-select-block d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
													<div className="col-8 font-size-h5 font-w600">
														Online Payment<br /><span className="text-muted" style={{ fontSize: '10px' }}>UPI/Net Banking/Credit Card/Debit Card</span>
													</div>
													<div className="col-4 float-right mt-10">
														<img
															src="https://app.snakyz.com/assets/online.png"
															alt={gateway.name}
															className="img-fluid"
															style={{ height: '4rem', width: '4rem' }}
														/>
													</div>
												</div>
											</div>
										</div> */}
									</React.Fragment>
								))}
							</div>
						</React.Fragment>
					)}
				</div>

				<div className="progress push m-0 progress-transparent" style={{ height: "8px" }}>
					<div
						className="progress-bar progress-bar-striped progress-bar-animated hidden"
						role="progressbar"
						id="progressBar"
						style={{
							backgroundColor: localStorage.getItem("storeColor"),
							width: "10%",
						}}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	addresses: state.addresses.addresses,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	coupon: state.coupon.coupon,
	checkout: state.checkout.checkout,
	restaurant_info: state.items.restaurant_info,
});

export default connect(
	mapStateToProps,
	{ placeOrder, updateUserInfo, getRestaurantInfoById }
)(PaymentList);
