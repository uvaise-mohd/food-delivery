import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../services/Store/user/actions";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Document } from 'react-iconly';
import { Work } from 'react-iconly';
import { Home } from 'react-iconly';
import { User } from 'react-iconly';
import axios from "axios";

class Footer extends Component {
	state = {
		active_home: false,
		active_products: false,
		active_reports: false,
		active_account: false,
		active_orders: false,
		unread_alerts_count: null,
		new_orders: [],
		// scheduled_orders: [],
		// self_orders: [],
		ongoing_orders: [],
		picked_orders: [],
		cancelled_orders: [],
		new_order: false
	};

	componentDidMount() {
	 	this.__getOrdersData();
		 if (this.props.active_home === true) {
			this.setState({ active_home: true });
		}
		if (this.props.active_products === true) {
			this.setState({ active_products: true });
		}
		if (this.props.active_reports === true) {
			this.setState({ active_reports: true });
		}
		if (this.props.active_account === true) {
			this.setState({ active_account: true });
		}
		if (this.props.active_orders === true) {
			this.setState({ active_orders: true });
		}

		if (this.state.new_orders.length > 0 || this.state.cancelled_orders.length > 0 || this.state.picked_orders.length > 0 || this.state.ongoing_orders.length > 0) {
			this.setState({ new_order: true });
		}
	}

	__getOrdersData = () => {
		axios
		.post('https://app.snakyz.com/public/api/store/get-all-orders', {
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
				});

			} else {
				this.setState({
					new_orders: [],
					scheduled_orders: [],
					// self_orders: [],
					// ongoing_orders: [],
					picked_orders: [],
					cancelled_orders: [],
				});
			}
		});
	}

	render() {

		const { cartTotal, alertUnreadTotal, fresh } = this.props;

		return (
			<React.Fragment>
				<div className="content pt-10 py-5 font-size-xs clearfix footer-fixed">
					<NavLink to={('/store/dashboard')}  style={this.state.active_home ? {color:'#FE0B15'} : {}} className="col footer-links px-2 py-1">
						<Home icon="home" /> <br />
					</NavLink>

					<NavLink to="/store/orders" style={this.state.active_orders ? {color:'#FE0B15'} : {}} className="col footer-links px-2 py-1">
						{(this.state.new_orders.length > 0 || this.state.cancelled_orders.length > 0 || this.state.picked_orders.length > 0 || this.state.ongoing_orders.length > 0) &&
							<div style={{ position: 'absolute', top: '0vw', right: '6vw', backgroundColor: '#FE0B15', width: '8px', height: '8px', borderRadius: '50%' }}></div>
						}
						<Work /><br />
					</NavLink>
						
					<NavLink to={'/store/products'} style={this.state.active_products ? {color:'#FE0B15'} : {}} className="col footer-links px-2 py-1">	
						<Document /><br />
					</NavLink>

					<NavLink to="/store/account"  style={this.state.active_account ? {color:'#FE0B15'} : {}} className="col footer-links px-2 py-1">
						<User icon="user" /> <br />
					</NavLink>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	cartTotal: state.total.data,
	alertUnreadTotal: state.alert.alertUnreadTotal,
	store_user: state.store_user.store_user,
});

export default connect(mapStateToProps, { updateStoreUserInfo })(Footer);
