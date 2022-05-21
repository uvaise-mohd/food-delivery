import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../../services/cart/actions";

import Customization from "../../Customization";
import Fade from "react-reveal/Fade";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";
import { WEBSITE_URL } from "../../../../../configs/website";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class RecommendedItems extends Component {
	static contextTypes = {
		router: () => null,
	};

	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			this.props.update();
		}, 100);
	};

	render() {
		const { addProduct, removeProduct, product, cartProducts, restaurant } = this.props;
		product.quantity = 1;
		return (
			<React.Fragment>
				<div className="mb-10" style={{ height: '240px' }}>
					<div className="mb-10 mr-10" key={product.id}>
						{product.image &&
							<Link to={restaurant.slug + "/" + product.id}>
								<img style={{ height: '150px', width: '150px', objectFit: 'cover', borderRadius: '0.8rem' }} src={WEBSITE_URL + "/assets/img/items/" + product.image} alt={product.name} />
							</Link>
						}
					</div>
					<div style={{ position: 'relative', textAlign: 'center', marginTop: product.image ? '-25px' : '70px', left: '20px', width: '110px' }}>
						{cartProducts.find((cp) => cp.id === product.id) !==
							undefined && (
								<React.Fragment>
									<div className="item-actions mt-2">
										<div
											className="btn-group btn-group-sm"
											role="group"
											aria-label="btnGroupIcons1"
											style={{ borderRadius: "0.5rem" }}
										>
											{product.is_active ? (
												<React.Fragment>
													{product.addon_categories.length ? (
														null
													) : (
														<button
															type="button"
															className="btn btn-add-remove"
															style={{ "width": "30px", "borderBottom": "1px solid #FF4848", "borderLeft": "1px solid #FF4848", "borderTop": "1px solid #FF4848", "borderTopLeftRadius": "0.8rem", "borderBottomLeftRadius": "0.8rem" }}
															onClick={() => {
																product.quantity = 1;
																removeProduct(product);
																this.forceStateUpdate();
															}}
														>
															<span class="btn-dec">-</span>
															{/* <Ink duration="500" /> */}
														</button>
													)}
													{product.addon_categories.length ? null : (
														<span
															className="pl-2 pr-2"
															style={{ "border": "none", "width": "10px", "color": "#FF4848", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontWeight": "600", "fontSize": "1rem", "borderTop": "1px solid #FF4848", "borderBottom": "1px solid #FF4848", "backgroundColor": "rgb(255, 255, 255)" }}
														>
															<React.Fragment>
																{
																	cartProducts.find(
																		(cp) => cp.id === product.id
																	).quantity
																}
															</React.Fragment>
														</span>
													)}

													{product.addon_categories.length ? (
														<Customization
															product={product}
															addProduct={addProduct}
															forceUpdate={this.forceStateUpdate}
														/>
													) : (
														<button
															type="button"
															className="btn btn-add-remove"
															style={{ "width": "30px", "color": "#FF4848", "borderTopRightRadius": "0.8rem", "borderBottomRightRadius": "0.8rem", "borderTop": "1px solid #FF4848", "borderRight": "1px solid #FF4848", "borderBottom": "1px solid #FF4848" }}
															onClick={() => {
																addProduct(product);
																this.forceStateUpdate();
															}}
														>
															<span class="btn-dec">+</span>
															{/* <Ink duration="500" /> */}
														</button>
													)}
												</React.Fragment>
											) : (
												<div className="robo text-danger text-item-not-available">
													Item Not Available
												</div>
											)}
										</div>
									</div>
								</React.Fragment>
							)}

						{cartProducts.find((cp) => cp.id === product.id) ===
							undefined && (
								<React.Fragment>
									<div className="item-actions mt-2">
										{product.is_active ? (
											<React.Fragment>
												{product.addon_categories.length ? (
													<Customization
														product={product}
														addProduct={addProduct}
														forceUpdate={this.forceStateUpdate}
													/>
												) : (
													<button
														type="button"
														style={{ "position": "relative", "border": "1px solid rgb(255, 72, 72)", "color": "rgb(255, 72, 72)", "width": "70px", "backgroundColor": "rgb(255, 255, 255)", "letterSpacing": "0.8px", "fontWeight": "bolder", "padding": "4px", "borderRadius": "0.8rem" }}
														onClick={() => {
															product.quantity = 1;
															addProduct(product);
															this.forceStateUpdate();
														}}
													>
														ADD
														{/* <Ink duration="500" /> */}
													</button>
												)}
											</React.Fragment>
										) : (
											<div className="robo text-danger text-item-not-available">
												Item Not Available
											</div>
										)}
									</div>
								</React.Fragment>
							)}
					</div>
					<div style={{ display: 'flex', alignItems: 'center', marginTop: product.image ? null : '65px' }}>
						<div>
							{product.is_veg || product.is_egg ? (
								<React.Fragment>
									{product.is_veg ? (
										<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
									) : (
										<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
									)}
								</React.Fragment>
							) : (
								<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
							)}
						</div>
						<div className="mt-2 ml-1" style={{ "fontWeight": "bolder", "lineHeight": "20px", "maxWidth": "73px", "fontSize": "13px", "color": "black", "overflow": "hidden", "textOverflow": "ellipsis", "whiteSpace": "nowrap" }}>
							{product.name}
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div className="mr-5" style={{ fontWeight: '600', fontSize: '11px' }}>
							<span className="rupees-symbol">₹ </span>{product.price}
						</div>
						{product.old_price && product.old_price > 0 &&
							<div style={{ color: 'red', textDecoration: 'line-through', fontSize: '9px' }}>
								<span className="rupees-symbol">₹ </span>{product.old_price}
							</div>
						}
					</div>
					{product.addon_categories.length > 0 && (
						<span
							className="text-muted"
							style={{ "fontWeight": "400", "fontSize": "0.8rem", "opacity": "0.8" }}
						>
							Customizable
						</span>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
});

export default connect(
	mapStateToProps,
	{ addProduct, removeProduct }
)(RecommendedItems);
