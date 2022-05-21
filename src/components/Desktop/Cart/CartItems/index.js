import React, { Component } from "react";
import { WEBSITE_URL } from "../../../../configs/website";
import Ink from "react-ink";
import { formatPrice } from "../../../helpers/formatPrice";
import { connect } from "react-redux";
import { Delete } from "react-iconly";
class CartItems extends Component {

	_getItemTotal = (item) => {
		let addonTotal = 0;
		let sum = 0;
		if (item.selectedaddons) {
			item.selectedaddons.map((addonArray) => {
				addonTotal += parseFloat(addonArray.price);
				return addonTotal;
			});
		}
		sum += item.price * item.quantity + addonTotal * item.quantity;
		sum = parseFloat(sum);

		return <div>
			<span className="rupees-symbol">₹ </span>{formatPrice(sum)}
		</div>
	};
	_generateKey = (pre) => {
		let newkey = `${pre}_${new Date().getTime()}_${Math.random()
			.toString(36)
			.substring(2, 15) +
			Math.random()
				.toString(36)
				.substring(2, 15)}`;
		console.log(newkey);
		return newkey;
	};
	render() {
		const { addProductQuantity, removeProductQuantity, item, removeProduct } = this.props;
		return (
			<React.Fragment>
				<div style={{ display: 'flex' }}>
					<div className="pt-15">
						{item.image ? (
							<img style={{ borderRadius: '0.5rem', height: '110px', width: '110px', objectFit: 'cover' }} src={WEBSITE_URL + "/assets/img/items/" + item.image} />
						) : (
							<div style={{ width: '110px' }}></div>
						)}
					</div>
					<div className="ml-4" style={{ width: '55vw' }}>
						<React.Fragment>
							<div className="pt-15 pb-2">
								<div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div>
											{item.is_veg || item.is_egg ? (
												<React.Fragment>
													{item.is_veg ? (
														<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
													) : (
														<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
													)}
												</React.Fragment>
											) : (
												<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
											)}
										</div>
										<div className={`${!item.is_active ? "text-danger ml-2 mt-2" : "ml-2 mt-2"}`} style={{ fontWeight: 'bolder' }}>
											{item.name}
										</div>
									</div>
									{item.selectedaddons && (
										<React.Fragment>
											{item.selectedaddons.map((addonArray, index) => (
												<React.Fragment key={item.id + addonArray.addon_id}>
													{localStorage.getItem("showAddonPricesOnCart") === "true" ? (
														<span style={{ color: "#adadad", fontSize: "0.8rem" }}>
															<p className="p-0 m-0">
																{addonArray.addon_name +
																	"- " +
																	localStorage.getItem("currencyFormat") +
																	addonArray.price}
															</p>
															{/* {(index ? ", " : "") + addonArray.addon_name + "- " + addonArray.price } */}
														</span>
													) : (
														<span style={{ color: "#adadad", fontSize: "0.8rem" }}>
															{(index ? ", " : "") + addonArray.addon_name}
														</span>
													)}
												</React.Fragment>
											))}
										</React.Fragment>
									)}
								</div>
							</div>
							{item.is_active ? (
								<React.Fragment>
									<div className="cart-item-price mb-2 mb-10">
										<React.Fragment>{this._getItemTotal(item)}</React.Fragment>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<div className="btn-group btn-group-sm cart-item-btn">
											<button
												type="button"
												className="btn btn-add-remove"
												style={{ "width": "30px", "borderBottom": "1px solid #FF4848", "borderLeft": "1px solid #FF4848", "borderTop": "1px solid #FF4848", "borderTopLeftRadius": "0.8rem", "borderBottomLeftRadius": "0.8rem" }}
												onClick={() => removeProductQuantity(item)}
											>
												<span className="btn-dec">
													{item.quantity === 1 ? (
														<Delete size="small" />
													) : (
														"-"
													)}
												</span>
												<Ink duration="500" />
											</button>
											<button type="button" style={{ "border": "none", "width": "10px", "color": "#FF4848", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontWeight": "600", "fontSize": "1rem", "borderTop": "1px solid #FF4848", "borderBottom": "1px solid #FF4848", "backgroundColor": "rgb(255, 255, 255)" }}>
												{item.quantity}
											</button>
											<button
												type="button"
												className="btn btn-add-remove"
												style={{ "width": "30px", "color": "#FF4848", "borderTopRightRadius": "0.8rem", "borderBottomRightRadius": "0.8rem", "borderTop": "1px solid #FF4848", "borderRight": "1px solid #FF4848", "borderBottom": "1px solid #FF4848" }}
												onClick={() => addProductQuantity(item)}
											>
												<span className="btn-dec">+</span>
												<Ink duration="500" />
											</button>
										</div>
										<button
											type="button"
											className="btn btn-add-remove text-danger"
											onClick={() => {
												removeProduct(item);
											}}
											style={{ border: '1px solid', height: '2rem', width: '2rem', borderRadius: '50%' }}
										>
											<Delete size="small" />
										</button>
									</div>
								</React.Fragment>
							) : (
								<React.Fragment>
									<button
										type="button"
										className="btn btn-add-remove text-danger"
										onClick={() => {
											removeProduct(item);
										}}
									>
										Remove Item
									</button>

									<div className="text-danger">
										Item Not Available
									</div>
								</React.Fragment>
							)}
						</React.Fragment>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
});

export default connect(
	mapStateToProps,
	{}
)(CartItems);
