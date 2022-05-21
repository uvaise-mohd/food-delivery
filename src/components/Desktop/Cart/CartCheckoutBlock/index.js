import React, { Component } from "react";

// import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
// import { Link } from "react-router-dom";
import { checkConfirmCart, checkCartItemsAvailability } from "../../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { placeOrder } from "../../../../services/checkout/actions";
import { addProduct } from "../../../../services/cart/actions";
import { updateCart } from "../../../../services/total/actions";

class CartCheckoutBlock extends Component {
	static contextTypes = {
		router: () => null,
	};
	// state = {
	//     loading: true,
	//     is_operational: true
	// };

	state = {
		process_cart_loading: false,
	};

	componentDidMount() {
		// this.props.checkForItemsAvailability();
	}

	componentWillReceiveProps(nextProps) {
		// const { checkout} = this.props;
		if (nextProps.checkout !== this.props.checkout) {
			//redirect to running order page
			this.context.router.history.push("/running-order");
		}
		// console.log("NEXT PROPS - " + nextProps.is_operational);
		// if (nextProps.is_operational !== this.props.is_operational) {
		//     console.log("Came here -> FROM CHILD");
		//     this.setState({ is_operational: false, loading: false });
		// }
	}

	processCart = () => {
		const {
			handleProcessCartLoading,
			checkCartItemsAvailability,
			cartProducts,
			addProduct,
			updateCart,
			checkConfirmCart,
			handleItemsAvailability,
		} = this.props;

		handleProcessCartLoading(true);

		checkCartItemsAvailability(cartProducts).then((response) => {
			handleProcessCartLoading(false);
			this.setState({ process_cart_loading: false });

			if (response && response.length) {
				let isSomeInactive = false;
				response.map((arrItem) => {
					//find the item in the cart
					let item = cartProducts.find((item) => item.id === arrItem.id);
					//get new price and is_active status and set it.
					item.is_active = arrItem.is_active;
					item.price = arrItem.price;
					addProduct(item);

					if (!isSomeInactive) {
						if (!arrItem.is_active) {
							isSomeInactive = true;
						}
					}
					return item;
				});
				if (isSomeInactive) {
					updateCart(this.props.cartProducts);
					handleItemsAvailability(false);
				} else {
					updateCart(this.props.cartProducts);
					checkConfirmCart();
					this.context.router.history.push("/desktop/checkout");
				}
			}
		});
	};

	gotoNewAddressPage = () => {
		localStorage.setItem("fromCart", 1);
		this.context.router.history.push("/search-location");
	};
	
	gotoMyAddressPage = () => {
		localStorage.setItem("fromCart", 1);
		this.context.router.history.push("/my-addresses");
	};

	gotoLoginPage = () => {
		localStorage.setItem("fromCartToLogin", 1);
		this.context.router.history.push("/desktop/login");
	};

	render() {
		// console.log("LOADING - " + this.state.loading);

		const { user } = this.props;
		return (
			<React.Fragment>
				<div
					className="bg-white container cart-checkout-block-desktop"
					style={{
						height: user.success && this.props.user_selected === "SELFPICKUP" ? "0px" : "25vh",
					}}
				>
					{user.success ? (
						user.data.default_address == null ? (
							<div className="p-15">
								<h2 className="almost-there-text m-0 pb-5">
									Set Your Address
								</h2>
								<button
									onClick={this.gotoNewAddressPage}
									className="btn btn-lg btn-continue-desktop"
									style={{
										position: "relative",
										backgroundColor: localStorage.getItem("storeColor"),
									}}
								>
									New Address
									<Ink duration={500} />
								</button>
							</div>
						) : (
							<React.Fragment>
								{(this.props.user_selected === "DELIVERY" ||
									this.props.user_selected === null) && (
										<React.Fragment>
											<div className="px-15 py-10">
												<button
													onClick={this.gotoMyAddressPage}
													className="change-address-text m-0 p-5 pull-right"
													style={{
														color: localStorage.getItem("storeColor"),
													}}
												>
													Change
												</button>
												<h2 className="deliver-to-text mt-2 m-0 pl-0 pb-5">
													Delivery To
												</h2>
												<div className="user-address truncate-text m-0 pt-10">
													{user.data.default_address.address}
													{user.data.default_address.house !== null && (
														<p className="truncate-text">{user.data.default_address.house}</p>
													)}
												</div>
											</div>
										</React.Fragment>
									)}
								<React.Fragment>
									{this.props.is_operational ? (
										<div style={{ marginTop: "1.6rem" }}>
											<div
												onClick={this.processCart}
												className="btn btn-lg btn-continue-desktop"
												style={{
													backgroundColor: localStorage.getItem("storeColor"),
													color: 'white',
													position: "relative",
													bottom: '25px'
												}}
											>
												Proceed To Checkout
												<Ink duration={400} />
											</div>
										</div>
									) : (
										<div className="auth-error bg-danger">
											<div className="error-shake">
												Not Operational Now
											</div>
										</div>
									)}
								</React.Fragment>
							</React.Fragment>
						)
					) : (
						<div className="p-15">
							<h2 className="almost-there-text m-0 pb-5">Almost There</h2>
							<span className="almost-there-sub text-muted">
								Login to place your order
							</span>
							<button
								onClick={this.gotoLoginPage}
								className="btn btn-lg btn-continue-desktop"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
									position: "relative",
								}}
							>
								Continue
								<Ink duration={500} />
							</button>
						</div>
					)}
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
	restaurant: state.restaurant,
});

export default connect(
	mapStateToProps,
	{
		placeOrder,
		checkConfirmCart,
		checkCartItemsAvailability,
		addProduct,
		updateCart,
	}
)(CartCheckoutBlock);
