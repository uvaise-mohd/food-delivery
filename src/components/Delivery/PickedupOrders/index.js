import React, { Component } from "react";
import Ink from "react-ink";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { Location } from 'react-iconly';

class PickedupOrders extends Component {

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

	render() {
		const { pickedup_orders } = this.props;
		return (
			<React.Fragment>
				<div>
					<div className="d-flex justify-content-between delivery-nav">
						<div className="delivery-tab-title px-20 py-15">
							Picked Up Orders
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

					{pickedup_orders.length === 0 ? (
						<p className="text-center text-muted py-15 mt-50">
							No Picked Up Orders
						</p>
					) : (
						<div className="p-15">
							<div className="delivery-list-wrapper pb-20">
								{pickedup_orders.map((order) => (
									<Link
										to={`/delivery/orders/${order.unique_order_id}`}
										key={order.id}
										style={{ position: "relative" }}
									>
										<div className="delivery-list-item p-15 delivery-message">
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
												<div>{order.stores && order.stores.name}</div>
												<div>{order.payment_mode == 'COD' ? <>COD : {order.payable}</>:<>ONLINE : {order.payable}</>}</div>
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
				</div>
			</React.Fragment>
		);
	}
}

export default PickedupOrders;
