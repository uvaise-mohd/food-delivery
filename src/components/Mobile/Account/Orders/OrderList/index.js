import React, { Component } from "react";

import DelayLink from "../../../../helpers/delayLink";
import Ink from "react-ink";
import Moment from "react-moment";
import { TickSquare, ShieldDone, ShieldFail, TimeSquare, Bag2 } from "react-iconly";
import { formatPrice } from "../../../../helpers/formatPrice";
import OrderCancelPopup from "./OrderCancelPopup";
import { getSingleItem } from "../../../../../services/items/actions";
import { connect } from "react-redux";
import { addProduct } from "../../../../../services/cart/actions";

class OrderList extends Component {
	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("bg-grey");
	}

	_getTotalItemCost = (item) => {
		let itemCost = parseFloat(item.price) * item.quantity;
		if (item.order_item_addons.length) {
			item.order_item_addons.map((addon) => {
				itemCost += parseFloat(addon.addon_price) * item.quantity;
				return itemCost;
			});
		}
		return formatPrice(itemCost);
	};

	addProducts = (order) => {
		const { addProduct } = this.props;
		console.log(order.orderitems);

		order.orderitems.forEach(item => {
			this.props.getSingleItem(item.item_id).then((response) => {
				if (response) {
					response.payload.quantity = 1;
					addProduct(response.payload);
				}
			});
		});

		setTimeout(() => {
			this.context.router.history.push("/cart");
		}, 1000);
	}

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
	}

	render() {
		const { order, user, cancelOrder } = this.props;
		return (
			<React.Fragment>
				<div className="mb-4">
					<div className="p-3 order-block">
						<DelayLink
							to={`/view-order/${order.unique_order_id}`}
							// delay={250}
							style={{ position: "relative" }}
						>
							<div>
								{/* <div className="mb-2" style={{ fontWeight: 'bolder', fontSize: '15px', color: localStorage.getItem("storeColor") }}>#{order.unique_order_id}</div> */}
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div style={{ fontWeight: 'bolder', fontSize: '15px' }}>{order.stores.name}</div>
									{order.order_status_id === 1 &&
										<div style={{ color: '#0960BD', display: 'flex', alignItems: 'center' }}><span><TickSquare className="mr-1" size={14} /></span><span>Order Placed</span></div>
									}
									{order.order_status_id === 5 &&
										<div style={{ color: '#1ABE30', display: 'flex', alignItems: 'center' }}><span><ShieldDone className="mr-1" size={14} /></span><span>Delivered</span></div>
									}
									{order.order_status_id === 6 &&
										<div style={{ color: '#FF0000', display: 'flex', alignItems: 'center' }}><span><ShieldFail className="mr-1" size={14} /></span><span>Cancelled</span></div>
									}
									{order.order_status_id === 9 &&
										<div style={{ color: '#FF0000', display: 'flex', alignItems: 'center' }}><span><ShieldFail className="mr-1" size={14} /></span><span>Transaction Failed</span></div>
									}
									{order.order_status_id === 10 &&
										<div style={{ color: '#8B8B8B', display: 'flex', alignItems: 'center' }}><span><TickSquare className="mr-1" size={14} /></span><span>Transaction Pending</span></div>
									}
									{order.order_status_id === 11 &&
										<div style={{ color: '#FE0B15', display: 'flex', alignItems: 'center' }}><span><Bag2 className="mr-1" size={14} /></span><span>Self Pick Up</span></div>
									}
									{order.order_status_id != 1 && order.order_status_id != 5 && order.order_status_id != 6 && order.order_status_id != 9 && order.order_status_id != 10 && order.order_status_id != 11 &&
										<div style={{ color: '#0960BD', display: 'flex', alignItems: 'center' }}><span><TimeSquare className="mr-1" size={14} /></span><span>On Going</span></div>
									}
								</div>
								<div className="text-muted mt-2">{order.stores.address}</div>
								<div className="text-muted mt-2 font-w600"><span className="rupees-symbol">₹</span>{order.total}</div>

								<hr style={{ borderTop: '1px dashed grey' }} />
								{order.orderitems.map((item) => (
									<div className="mb-2">
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div>{item.name}</div>
											<div className="font-w600">x {item.quantity}</div>
										</div>
										{item.order_item_addons.map((addon) => (
											<div className="text-muted ml-4">{addon.addon_name}</div>
										))}
									</div>
								))}
								<div className="text-muted" style={{ fontSize: '11px' }}><Moment format="MMM DD, hh:mm A">{order.created_at}</Moment></div>
							</div>
						</DelayLink>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
							{/* {(order.order_status_id == 5 || order.order_status_id == 6 || order.order_status_id == 9) &&
								<div
									className="btn btn-square btn-outline-secondary mb-10 pl-2 pr-2 order-track2-button"
									style={{ position: "relative", zIndex: "999" }}
									onClick={() => this.addProducts(order)}
								>
									Reorder
								</div>
							} */}
							{order.can_cancel && order.order_status_id == 1 &&
								<OrderCancelPopup order={order} user={user} cancelOrder={cancelOrder} />
							}
						</div>
					</div>
				</div>
			</React.Fragment >
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	cancel: state.orders.cancel,
});

export default connect(
	mapStateToProps,
	{ getSingleItem, addProduct }
)(OrderList);
