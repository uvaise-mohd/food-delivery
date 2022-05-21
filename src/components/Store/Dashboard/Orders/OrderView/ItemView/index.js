import React, { Component } from "react";

class ItemView extends Component {
	render() {
		const item = this.props.item;
		return (
			<React.Fragment>
				<div className="d-flex justify-content-between pl-10 pr-10 pt-10">
					<div>
						{item.name}
					</div>
					<div>
						<span>
							x{item.quantity}
						</span>
					</div>
					<div>
						₹ {item.price}
					</div>
				</div>
				<div className="pr-10" style={{
					marginLeft: '50px',
					color: '#979797',
					fontSize: '10px'
				}}>
					{item &&
						item.order_item_addons.map((addonArray, index) => (
							<React.Fragment key={item.id + addonArray.id + index}>
								<div className="d-flex justify-content-between">
									<div>
										{addonArray.addon_name}
									</div>
									<div>
										₹ {addonArray.addon_price}
									</div>
								</div>
							</React.Fragment>
						))}
				</div>
				<hr style={{ borderTop: '1px dashed #B8B8B8' }} />
			</React.Fragment>
		);
	}
}

export default ItemView;
