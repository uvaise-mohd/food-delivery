import React, { Component } from "react";
import { Discount, InfoCircle, ChevronRight } from "react-iconly";
import Ink from "react-ink";
import { applyCoupon } from "../../../../services/coupon/actions";
import { connect } from "react-redux";
import DelayLink from "../../../helpers/delayLink";

class Coupon extends Component {
	state = {
		inputCoupon: "",
		couponFailed: false,
		couponFailedType: "",
		couponSubtotalMessage: "",
	};

	componentDidMount() {
		// automatically apply coupon if already exists in localstorage
		if (localStorage.getItem("appliedCoupon")) {
			this.setState({ inputCoupon: localStorage.getItem("appliedCoupon") }, () => {
				this.refs.couponInput.defaultValue = localStorage.getItem("appliedCoupon");
				const { user } = this.props;
				const token = user.success ? this.props.user.data.auth_token : null;
				this.props.applyCoupon(
					token,
					this.state.inputCoupon,
					this.props.restaurant_info.id,
					this.props.subtotal
				);
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		const { coupon } = this.props;
		//check if props changed after calling the server
		if (coupon !== nextProps.coupon) {
			//if nextProps.coupon is successful then
			if (nextProps.coupon.success) {
				console.log("SUCCESS COUPON");
				localStorage.setItem("appliedCoupon", nextProps.coupon.code);
				this.setState({ couponFailed: false });
			} else {
				console.log("COUPON Removed");
				// coupon is invalid
				console.log("FAILED COUPON");
				localStorage.removeItem("appliedCoupon");
				this.setState({
					couponFailed: !nextProps.coupon.hideMessage,
					couponFailedType: nextProps.coupon.type,
					couponSubtotalMessage: nextProps.coupon.message,
				});
			}
		}
	}
	handleInput = (event) => {
		this.setState({ inputCoupon: event.target.value });
	};

	handleSubmit = (event) => {
		event.preventDefault();
		const { user } = this.props;
		const token = user.success ? this.props.user.data.auth_token : null;
		this.props.applyCoupon(token, this.state.inputCoupon, this.props.restaurant_info.id, this.props.subtotal);
	};

	componentWillUnmount() {
		// this.props.coupon.code = undefined;
		// localStorage.removeItem("appliedCoupon");
	}

	render() {
		const { coupon, user } = this.props;
		return (
			<React.Fragment>
				<div className="input-group pb-15 mt-20 mb-200">
				<div style={{fontWeight:'500',marginBottom:'15px',fontSize:'14px'}}>
							Add Coupon
						</div>
					<form
						className={`coupon-form ${!user.success && "coupon-block-not-loggedin"}`}
						onSubmit={this.handleSubmit}
						style={{  borderRadius: '10px' ,border:'1px solid #F5F5F8'}}
					>
						{/* <DelayLink to={'/coupons'}>
							<div className="input-group p-10 font-w600"
								style={{ backgroundColor: 'rgb(255 171 175)', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
							>
								<div>View All Coupons</div>
								<ChevronRight />
							</div>
						</DelayLink> */}

						
						<div className="input-group">
							<input
								type="text"
								className="form-control apply-coupon-input"
								placeholder="Coupon Code"
								onChange={this.handleInput}
								style={{ marginTop: '6px' ,}}
								spellCheck="false"
								ref="couponInput"
							/>
							<div className="" style={{}}>
								<button type="submit" style={{backgroundColor:'#ff0000',border:'none',height:'100%',width:'60px',borderTopRightRadius:'10px',borderBottomRightRadius:'10px',position:'relative'}}>
									<span>
										<Discount primaryColor="#fff"/>
									</span>
									<Ink duration="500" />
								</button>
							</div>
						</div>
					</form>
					<div className="coupon-status">
						{coupon.code && (
							<div className="coupon-success pt-10 pb-10">
								<React.Fragment>
									{'"' + coupon.code + '"'} Coupon Applied{" "}
									{coupon.discount_type === "PERCENTAGE" ? (
										coupon.coupon_discount + "%"
									) : (
										<React.Fragment>
											<span className="rupees-symbol">₹ </span>{coupon.coupon_discount}
										</React.Fragment>
									)}
								</React.Fragment>
							</div>
						)}
						{/* Coupon is not applied, then coupon state is true */}
						{this.state.couponFailed &&
							(this.state.couponFailedType === "MINSUBTOTAL" ? (
								<div className="coupon-fail pt-10 pb-10">{this.state.couponSubtotalMessage}</div>
							) : (
								<div className="coupon-fail pt-10 pb-10">
									Invalid Coupon
								</div>
							))}
						{!user.success && (
							<div style={{ color: 'red' }} className="coupon-not-loggedin-message d-flex align-items-center justify-content-center pt-10 pb-10">
								<InfoCircle className="mr-1" size="small" />
								Please Login To Apply Coupon
							</div>
						)}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	coupon: state.coupon.coupon,
	restaurant_info: state.items.restaurant_info,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ applyCoupon }
)(Coupon);
