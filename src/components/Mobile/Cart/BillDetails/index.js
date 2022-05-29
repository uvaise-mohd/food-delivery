import React, { Component } from "react";

import { connect } from "react-redux";
import { formatPrice } from "../../../helpers/formatPrice";
import { couponApplied } from "../../../../services/coupon/actions";

class BillDetails extends Component {
	state = {
		delivery_charges: 0,
		distance: 0,
		tips: 0,
		couponAppliedAmount: 0,
		user_selected: "DELIVERY"
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.user_selected === "DELIVERY" && nextProps.restaurant_info.is_free_delivery == 0) {
			if (this.props.restaurant_info.delivery_charges !== nextProps.restaurant_info.delivery_charges) {
				this.setState({ delivery_charges: nextProps.restaurant_info.delivery_charges });
			}
		}

		if (nextProps.distance) {
			if (this.props.user_selected === "DELIVERY" && nextProps.restaurant_info.is_free_delivery == 0) {
				if (nextProps.restaurant_info.delivery_charge_type === "DYNAMIC") {
					this.setState({ distance: nextProps.distance }, () => {
						//check if restaurant has dynamic delivery charge..
						this.calculateDynamicDeliveryCharge();
					});
				}
			}
		}

		if (nextProps.user_selected === "SELFPICKUP") {
			this.setState({ delivery_charges: 0, user_selected: "SELFPICKUP" });
		}

	}

	calculateDynamicDeliveryCharge = () => {

		if (this.state.user_selected !== "SELFPICKUP") {
			const { restaurant_info } = this.props;

			const distanceFromUserToRestaurant = this.state.distance;
			console.log("Distance from user to restaurant: " + distanceFromUserToRestaurant + " km");

			if (distanceFromUserToRestaurant > restaurant_info.base_delivery_distance) {
				const extraDistance = distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
				console.log("Extra Distance: " + extraDistance + " km");

				const extraCharge =
					(extraDistance / restaurant_info.extra_delivery_distance) * restaurant_info.extra_delivery_charge;
				console.log("Extra Charge: " + extraCharge);

				let dynamicDeliveryCharge = parseFloat(restaurant_info.base_delivery_charge) + parseFloat(extraCharge);
				console.log("Total Charge: " + dynamicDeliveryCharge);
				if (localStorage.getItem("enDelChrRnd") === "true") {
					dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
				}

				this.setState({ delivery_charges: dynamicDeliveryCharge });
			} else {
				this.setState({ delivery_charges: restaurant_info.base_delivery_charge });
			}
		}

	};

	// Calculating total with/without coupon/tax
	getTotalAfterCalculation = () => {
		const { total, restaurant_info, coupon, tips } = this.props;
		let calc = 0;
		if (coupon.code) {
			if (coupon.discount_type === "PERCENTAGE") {
				let percentage_discount = formatPrice((coupon.coupon_discount / 100) * parseFloat(total));
				if (coupon.max_discount) {
					if (parseFloat(percentage_discount) >= coupon.max_discount) {
						percentage_discount = coupon.max_discount;
					}
				}

				this.props.couponApplied(coupon, percentage_discount);
				const saveCouponAppliedAmount = new Promise((resolve) => {
					localStorage.setItem("couponAppliedAmount", percentage_discount);
					resolve("Saved");
				});
				saveCouponAppliedAmount.then(() => {
					this.checkAndSetAppliedAmount();
				});

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

		if (tips.value > 0) {
			calc = parseFloat(calc) + parseFloat(tips.value);
		}

		return formatPrice(calc);
	};

	checkAndSetAppliedAmount = () => {
		let elem = "";
		if (localStorage.getItem("currencySymbolAlign") === "left") {
			elem = "(" + localStorage.getItem("currencyFormat") + localStorage.getItem("couponAppliedAmount") + ")";
		} else {
			elem = "(" + localStorage.getItem("couponAppliedAmount") + localStorage.getItem("currencyFormat") + ")";
		}

		if (this.refs.appliedAmount) {
			this.refs.appliedAmount.innerHTML = elem;
		}
	};

	render() {
		const { total, restaurant_info, coupon, tips, removeTip } = this.props;
		// console.log(this.state.delivery_charges)
		return (
			<React.Fragment>
				<div className="px-15">
					<div
						className="bg-white mb-20"
					>
						<div className="p-15" style={{ boxShadow: 'rgb(136 136 136) 0px 0px 10px -3px', borderRadius: '10px' }}>
							<h2 className="bill-detail-text m-0">Payment Details</h2>
							<div className="display-flex mb-1">
								<div className="flex-auto">Item Total</div>
								<div className="flex-auto text-right">
									<span className="rupees-symbol">₹ </span>{formatPrice(total)}
								</div>
							</div>
							{coupon.code && (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto coupon-text">
											Coupon
										</div>
										<div className="flex-auto text-right coupon-text">
											<span>-</span>
											{coupon.discount_type === "PERCENTAGE" ? (
												<React.Fragment>
													{coupon.coupon_discount}%{" "}
													<span className="coupon-appliedAmount" ref="appliedAmount">
														{this.checkAndSetAppliedAmount()}
													</span>
												</React.Fragment>
											) : (
												<React.Fragment>
													<span className="rupees-symbol">₹ </span>{coupon.coupon_discount}
												</React.Fragment>
											)}
										</div>
									</div>
								</React.Fragment>
							)}
							{restaurant_info.store_charges === "0.00" ||
								restaurant_info.store_charges === null ? null : (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto">Store Charge</div>
										<div className="flex-auto text-right">
											<span className="rupees-symbol">₹ </span>{restaurant_info.store_charges}
										</div>
									</div>
								</React.Fragment>
							)}
							{restaurant_info.convenience_fee === "0.00" ||
								restaurant_info.convenience_fee === null ? null : (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto">Convenience Fee</div>
										<div className="flex-auto text-right">
											<span className="rupees-symbol">₹ </span>{restaurant_info.convenience_fee}
										</div>
									</div>
								</React.Fragment>
							)}
							{this.state.delivery_charges === 0 ? (
								null
							) : (
								<React.Fragment>
									<div className="display-flex">
										<div className="flex-auto">Delivery Charge</div>
										<div className="flex-auto text-right">
											<span className="rupees-symbol">₹ </span>{formatPrice(this.state.delivery_charges)}
										</div>
									</div>
									<div className="mb-1 text-muted" style={{ fontSize: '10px' }}>100% of the delivery fee will go to your Delivery Partner</div>
								</React.Fragment>
							)}
							{(localStorage.getItem("userSelected") === "DELIVERY" && restaurant_info.city && restaurant_info.city.is_surge == 1 && restaurant_info.city.surge_fee && restaurant_info.city.surge_fee > 0) ? (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto text-danger">Rain Surge</div>
										<div className="flex-auto text-right text-danger">
											<span className="rupees-symbol">₹ </span>{restaurant_info.city.surge_fee}
										</div>
									</div>
								</React.Fragment>
							) : (
								null
							)}
							{restaurant_info.tax && restaurant_info.tax > 0 && (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto text-danger">Restaurant GST</div>
										<div className="flex-auto text-right text-danger">
											<span>+</span>
											{restaurant_info.tax}%
										</div>
									</div>
								</React.Fragment>
							)}

							{/* {tips.value !== 0 && (
								<React.Fragment>
									<div className="display-flex mb-1">
										<div className="flex-auto">Delivery Tip</div>
										<div className="flex-auto text-right">
											<span className="rupees-symbol">₹ </span>{formatPrice(tips.value)}
											<br />
											<span onClick={removeTip}>
												<b style={{ fontSize: '10px', color: 'red' }}>Remove Tip</b>
											</span>
										</div>
									</div>
								</React.Fragment>
							)} */}

							<hr style={{ borderTop: '1px dashed #C9C9C9' }} />

							<div className="display-flex">
								<div className="flex-auto font-w700">To Pay</div>
								<div className="flex-auto text-right font-w700">
									{/* Calculating total after coupon_discount coupon or without coupon_discount coupon */}
									<span className="rupees-symbol">₹ </span>{this.getTotalAfterCalculation()}
								</div>
							</div>
							{this.props.user_selected === "SELFPICKUP" && (
								<p className="my-2 mt-3 text-danger font-weight-bold">
									{localStorage.getItem("selectedSelfPickupMessage")}
								</p>
							)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	coupon: state.coupon.coupon,
	restaurant_info: state.items.restaurant_info,
});

export default connect(
	mapStateToProps,
	{ couponApplied }
)(BillDetails);
