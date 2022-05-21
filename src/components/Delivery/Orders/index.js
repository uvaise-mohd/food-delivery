import React, { Component } from "react";
import ContentLoader from "react-content-loader";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getDeliveryOrders } from "../../../services/Delivery/orders/actions";
import { logoutDeliveryUser } from "../../../services/Delivery/user/actions";
import NewOrders from "../NewOrders";
import AcceptedOrders from "../AcceptedOrders";
import Ink from "react-ink";
import Account from "../Account";
import { Category, Chart, Bag2, User } from 'react-iconly';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PickedupOrders from "../PickedupOrders";
import Axios from "axios";

class Orders extends Component {

	state = {
		play: false,
		tabIndex: 0,
		message: null,
	};

	audio = new Audio("/assets/audio/delivery-notification.mp3");

	componentDidMount() {
		if (this.props.delivery_user.success) {
			this.props.getDeliveryOrders(this.props.delivery_user.data.auth_token);
			this.getDeliveryMessage();
		}

		this.refreshSetInterval = setInterval(() => {
			this.__refreshOrders();
		}, 15 * 1000);
	}

	getDeliveryMessage = () => {
		Axios
		.post('https://app.snakyz.com/public/api/delivery/get-message', {
            token: this.props.delivery_user.data.auth_token,

		})
		.then((response) => {
				this.setState({
					message: response.data.message,
				});
		});
	}

	__refreshOrders = () => {
		if (this.props.delivery_user.success) {
			this.props.getDeliveryOrders(this.props.delivery_user.data.auth_token);
		}
	};

	componentWillReceiveProps(newProps) {
		const { delivery_orders } = this.props;
		if (delivery_orders.new_orders) {
			if (newProps.delivery_orders.new_orders.length > delivery_orders.new_orders.length) {
				//new orders received,
				this.audio.play();
				if ("vibrate" in navigator) {
					navigator.vibrate(["100", "150", "100", "100", "150", "100"]);
				}
			}
		}
	}
	componentWillUnmount() {
		clearInterval(this.refreshSetInterval);
	}

	getLocationName = (location) => {
		try {
			console.log("Came to try");

			return (
				<span style={{ maxWidth: "100px", display: "block" }} className="truncate-text">
					{JSON.parse(location).address}
				</span>
			);
		} catch {
			return null;
		}
	};

	onTabSelect = (tabIndex) => {
		localStorage.setItem("deliveryTabIndex", tabIndex);
		this.setState({ tabIndex: tabIndex });
	};

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}

		return (
			<React.Fragment>
				<Meta
					seotitle="Delivery Orders"
					ogtype="website"
					ogurl={window.location.href}
				/>

				<Tabs
					selectedIndex={
						localStorage.getItem("deliveryTabIndex") === null
							? this.state.tabIndex
							: parseInt(localStorage.getItem("deliveryTabIndex"))
					}
					onSelect={(tabIndex) => this.onTabSelect(tabIndex)}
				>
					<div
						className="content font-size-xs clearfix footer-fixed delivery-footer"
						style={{ display: "block", width: "96%", padding: "0", height: "55px" }}
					>
						<TabList>
							<Tab>
								<div className="text-center">
									{this.props.delivery_orders.new_orders && this.props.delivery_orders.new_orders.length > 0 &&
										<div style={{ height: '20px', width: '20px', border: '1px solid #FE0B15', borderRadius: '50%', position: 'absolute', right: '5px', top: '5px', backgroundColor: 'white' }}>
											{this.props.delivery_orders.new_orders.length}
										</div>
									}
									<Category />
									<Ink duration="500" hasTouch="true" />
								</div>
							</Tab>
							<Tab>
								<div className="text-center">
									{this.props.delivery_orders.accepted_orders && this.props.delivery_orders.accepted_orders.length > 0 &&
										<div style={{ height: '20px', width: '20px', border: '1px solid #FE0B15', borderRadius: '50%', position: 'absolute', right: '5px', top: '5px', backgroundColor: 'white' }}>
											{this.props.delivery_orders.accepted_orders.length}
										</div>
									}
									<Chart />
									<Ink duration="500" hasTouch="true" />
								</div>
							</Tab>
							<Tab>
								<div className="text-center">
									{this.props.delivery_orders.pickedup_orders && this.props.delivery_orders.pickedup_orders.length > 0 &&
										<div style={{ height: '20px', width: '20px', border: '1px solid #FE0B15', borderRadius: '50%', position: 'absolute', right: '5px', top: '5px', backgroundColor: 'white' }}>
											{this.props.delivery_orders.pickedup_orders.length}
										</div>
									}
									<Bag2 />
									<Ink duration="500" hasTouch="true" />
								</div>
							</Tab>
							<Tab>
								<div className="text-center">
									<User />
									<Ink duration="500" hasTouch="true" />
								</div>
							</Tab>
						</TabList>
					</div>
					<TabPanel>
						{!this.props.delivery_orders.new_orders ? (
							<div className="pt-50">
								<ContentLoader
									height={window.innerHeight}
									width={window.innerWidth}
									speed={1.2}
									primaryColor={"#E0E0E0"}
									secondaryColor={"#fefefe"}
								>
									<rect x="15" y="30" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="30" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="70" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="173" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="173" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="213" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="316" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="316" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="356" rx="0" ry="0" width="250" height="23" />
								</ContentLoader>
							</div>
						) : (
							<NewOrders
								refreshOrders={this.__refreshOrders}
								getLocationName={this.getLocationName}
								new_orders={this.props.delivery_orders.new_orders}
								message={this.state.message}
							/>
						)}
					</TabPanel>
					<TabPanel>
						{!this.props.delivery_orders.accepted_orders ? (
							<div className="pt-50">
								<ContentLoader
									height={window.innerHeight}
									width={window.innerWidth}
									speed={1.2}
									primaryColor={"#E0E0E0"}
									secondaryColor={"#fefefe"}
								>
									<rect x="15" y="30" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="30" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="70" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="173" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="173" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="213" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="316" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="316" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="356" rx="0" ry="0" width="250" height="23" />
								</ContentLoader>
							</div>
						) : (
							<AcceptedOrders
								refreshOrders={this.__refreshOrders}
								getLocationName={this.getLocationName}
								accepted_orders={this.props.delivery_orders.accepted_orders}
							/>
						)}
					</TabPanel>
					<TabPanel>
						{!this.props.delivery_orders.pickedup_orders ? (
							<div className="pt-50">
								<ContentLoader
									height={window.innerHeight}
									width={window.innerWidth}
									speed={1.2}
									primaryColor={"#E0E0E0"}
									secondaryColor={"#fefefe"}
								>
									<rect x="15" y="30" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="30" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="70" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="173" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="173" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="213" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="316" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="316" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="356" rx="0" ry="0" width="250" height="23" />
								</ContentLoader>
							</div>
						) : (
							<PickedupOrders
								refreshOrders={this.__refreshOrders}
								getLocationName={this.getLocationName}
								pickedup_orders={this.props.delivery_orders.pickedup_orders}
							/>
						)}
					</TabPanel>
					<TabPanel>
						<Account
							delivery_user={this.props.delivery_user}
							logoutDeliveryUser={this.props.logoutDeliveryUser}
						/>
					</TabPanel>
				</Tabs>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	delivery_orders: state.delivery_orders.delivery_orders,
});

export default connect(
	mapStateToProps,
	{ getDeliveryOrders, logoutDeliveryUser }
)(Orders);
