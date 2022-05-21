import React, { Component } from "react";
import Moment from "react-moment";
import { Location } from 'react-iconly';

class OrdersHistory extends Component {

	getDeliveryCharge = (delivery_charge) => {
		console.log(this.props.commission);
		console.log(delivery_charge);
		return this.props.commission / 100 * delivery_charge;
	}

	render() {
		const { order } = this.props;
		return (
			<React.Fragment>
				<div className="delivery-list-item p-15 bg-white" style={{ borderRadius: '5px' }}>
					<div className="mb-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ fontWeight: '900', color: '#FF5B44', letterSpacing: '1px' }}>
							#{order.order.unique_order_id.substr(order.order.unique_order_id.length - 10)}
						</div>
						<div style={{ fontWeight: '500', color: '#FF5B44' }}>
							<Moment format="MMM DD YYYY, hh:mm A">
								{order.updated_at}
							</Moment>
						</div>
					</div>
					<hr />
					<div className="mt-15" style={{ fontWeight: 'bolder' }}>
						{order.order.stores.name}
					</div>
					<div style={{ display: 'flex' }} className="mt-15">
						<Location />
						<span>{order.order.address}</span>
					</div>
					<div className="mt-10 d-flex align-items-center" style={{ fontWeight: 'bolder' }}>
						Delivery Charege: ₹ {order.order.delivery_charge}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default OrdersHistory;
