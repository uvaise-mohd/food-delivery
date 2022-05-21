import React, { Component } from "react";
import Ink from "react-ink";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { Location, Message } from 'react-iconly';
import { connect } from "react-redux";
import { updateDeliveryUserInfo } from "../../../services/Delivery/user/actions";

class NewOrders extends Component {

	__refreshOrders = () => {
		if (this.refs.btnSpinner) {
			this.refs.btnSpinner.classList.add("fa-spin");
		}
		setTimeout(() => {
			if (this.refs.btnSpinner) {
				this.refs.btnSpinner.classList.remove("fa-spin");
			}
		}, 2 * 1000);
		this.props.refreshOrders();
	};

	componentDidMount() {
		this.props.updateDeliveryUserInfo(this.props.delivery_user.data.id, this.props.delivery_user.data.auth_token);
	}

	render() {
		const { new_orders } = this.props;

		return (
			<React.Fragment>
				<div className="delivery-bg">
					<div className="d-flex justify-content-between delivery-nav">
						<div className="delivery-tab-title px-20 py-15">
							New Orders
						</div>
						<div className="delivery-order-refresh">
							<button
								className="btn btn-refreshOrders mr-15"
								onClick={this.__refreshOrders}
								style={{ position: "relative" }}
							>
								Refresh
								<Ink duration={1200} />
							</button>
						</div>
					</div>

					{this.props.message &&
						<div style={{ position: "relative", borderRadius: "8px" }} className="delivery-message mt-20 block ml-15 mr-15">
							<div className="block-content block-content-full clearfix">
								<div style={{ display: 'flex' }}>
									<Message />
									<span className="ml-2 mt-1" style={{ fontWeight: 'bolder' }}>Message</span>
								</div>
								<div className="mt-2">
									{this.props.message.message}
								</div>
							</div>
						</div>
					}

					{this.props.delivery_user.data.accept_order == 1 ? (
						<React.Fragment>
							{new_orders.length === 0 ? (
								<p className="text-center text-muted py-15 mt-50">
									No New Orders Yet
								</p>
							) : (
								<div className="p-15">
									<div className="delivery-list-wrapper pb-20">
										{new_orders.map((order) => (
											<Link
												to={`/delivery/orders/${order.unique_order_id}`}
												key={order.id}
												style={{ position: "relative" }}
											>
												<div className="delivery-order p-15">
													<div className="mb-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
														<div style={{ fontWeight: '900', color: '#FF5B44', letterSpacing: '1px' }}>
															#{order.unique_order_id.substr(order.unique_order_id.length - 10)}
														</div>
														<div style={{ fontWeight: '500', color: '#FF5B44' }}>
															<Moment format="MMM DD YYYY, hh:mm A">
																{order.updated_at}
															</Moment>
														</div>
													</div>
													<hr />
													<div className="d-flex flex-row align-items-center justify-content-between mt-15" style={{ fontWeight: 'bolder' }}>
														<div>{order.stores.name}</div>
														<div>{order.payment_mode == 'COD' ? <>COD : {order.payable}</> : <>ONLINE : {order.payable}</>}</div>
													</div>
													<div style={{ display: 'flex' }} className="mt-15">
														<Location />
														<span>{order.address}</span>
													</div>
												</div>
												<Ink duration="500" hasTouch="true" />
											</Link>
										))}
									</div>
								</div>
							)}
						</React.Fragment>
					) : (
						<p className="text-center text-muted py-15 mt-50">
							No New Orders Yet
						</p>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
});

export default connect(
	mapStateToProps, { updateDeliveryUserInfo }
)(NewOrders);
