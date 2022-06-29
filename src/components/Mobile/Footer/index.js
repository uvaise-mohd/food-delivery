import React, { Component } from "react";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Home, Heart2, Bag, User, ChevronRight, Search } from "react-iconly";
import PWAInstallation from "../PWAInstallation";
import axios from "axios";
import { Link } from "react-router-dom";

class Footer extends Component {
	state = {
		active_home: false,
		active_favourite: false,
		active_cart: false,
		active_account: false,
		order_count: 0
	};

	componentDidMount() {
		if (this.props.user.success) {
			axios
				.post('https://app.snakyz.com/public/api/user-orders-check', {
					token: this.props.user.data.auth_token
				})
				.then((response) => {
					const data = response.data;
					this.setState({
						order_count: data.count
					});
				});
		}

		if (this.props.active_home === true) {
			this.setState({ active_home: true });
		}
		if (this.props.active_favourite === true) {
			this.setState({ active_favourite: true });
		}
		if (this.props.active_cart === true) {
			this.setState({ active_cart: true });
		}
		if (this.props.active_account === true) {
			this.setState({ active_account: true });
		}
	}

	render() {

		const { cartTotal, user } = this.props;

		return (
			<React.Fragment>
				{/* {localStorage.getItem("showPwaInstallPromptFooter") === "true" && <PWAInstallation type={"footer"} />} */}

				<div className="d-flex justify-content-center">
					<div
						className="content pt-10 py-5 font-size-xs clearfix footer-float"
					>
						<NavLink to="/" className={`col footer-links px-2 py-1 ${this.state.active_home ? "active-footer-tab" : ""}`}>
							{this.state.active_home ? <Home set="bold" /> : <Home />}
						</NavLink>
						<NavLink to={"/explore"} className={`col footer-links px-2 py-1 ${this.state.active_favourite ? "active-footer-tab" : ""}`}>
							{this.state.active_favourite ? <Search set="bold" /> : <Search />}
						</NavLink>
						<NavLink to="/cart" className={`col footer-links px-2 py-1 ${this.state.active_cart ? "active-footer-tab" : ""}`}>
							{this.state.active_cart ? <Bag set="bold" /> : <Bag />}
							{cartTotal.productQuantity && cartTotal.productQuantity != 0 ? (
								<span className="cart-qnt-badge">{cartTotal.productQuantity}</span>
							) : (null)}
						</NavLink>
						<NavLink to="/my-account" className={`col footer-links px-2 py-1 ${this.state.active_account ? "active-footer-tab" : ""}`}>
							{this.state.active_account ? <User set="bold" /> : <User />}
						</NavLink>
					</div>
				</div>
				{this.state.order_count > 0 &&
					<Link to={'/my-orders'} className="d-flex justify-content-between" style={{"position":"fixed","bottom":"4rem","width":"100%","padding":"10px 10px","backgroundColor":"rgb(254 11 21 / 80%)","color":"white","fontWeight":"bold","height":"40px","alignItems":"center"}}>
						<div>You have ongoing Orders ( {this.state.order_count} ) </div>
						<div className="d-flex " style={{ "marginTop": "-2px", "alignItems": "center", "fontWeight": "bold" }}>View <ChevronRight /></div>
					</Link>
				}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	cartTotal: state.total.data,
});

export default connect(
	mapStateToProps,
	{}
)(Footer);
