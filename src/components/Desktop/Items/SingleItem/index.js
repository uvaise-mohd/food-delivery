import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";
import {
	getRestaurantInfo,
	getRestaurantItems,
	getSingleItem,
	resetInfo,
	resetItems,
} from "../../../../services/items/actions";
import Customization from "../Customization";
import FloatCart from "../../FloatCart";
import LazyLoad from "react-lazyload";
import { Redirect } from "react-router";
import RestaurantInfo from "../RestaurantInfo";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";
import { WEBSITE_URL } from "../../../../configs/website";
import { getSettings } from "../../../../services/settings/actions";
import Hero from "../../Hero";
import Footer from "../../Footer";

class SingleItem extends Component {
	state = {
		update: true,
		is_active: 1,
		loading: true,
		item_loading: true,
	};
	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			if (this.state.update) {
				this.setState({ update: false });
			} else {
				this.setState({ update: true });
			}
		}, 100);
	};

	componentDidMount() {
		this.props.getSettings();

		this.props.getRestaurantInfo(this.props.restaurant);

		this.props.getSingleItem(this.props.itemId).then((response) => {
			if (response) {
				if (response.payload.id) {
					this.setState({ item_loading: false });
				}
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.restaurant_info.is_active === "undefined") {
			this.setState({ loading: true });
		}
		if (nextProps.restaurant_info.is_active === 1 || nextProps.restaurant_info.is_active === 0) {
			this.setState({ loading: false });
			this.setState({ is_active: nextProps.restaurant_info.is_active });
		}
		if (!this.state.is_active) {
			document.getElementsByTagName("html")[0].classList.add("page-inactive");
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					// console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	componentWillUnmount() {
		document.getElementsByTagName("html")[0].classList.remove("page-inactive");
	}

	render() {
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		const { addProduct, removeProduct, cartProducts, single_item } = this.props;
		return (
			<React.Fragment>
				<div className="bg-white" style={{ minHeight: '30vh' }}>
					<Hero />

					<RestaurantInfo
						history={this.props.history}
						restaurant={this.props.restaurant_info}
						withLinkToRestaurant={true}
					/>

					{single_item.id && (
						<div className="container">
							<div className="single-item px-15 bg-white mt-20">
								<span className="hidden">{(single_item.quantity = 1)}</span>
								<div
									className="category-list-item single-item-img"
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									{this.state.item_loading ? (
										<ContentLoader
											height={400}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="0" y="0" rx="4" ry="4" width={window.innerWidth} height="290" />
											<rect x="0" y="300" rx="0" ry="0" width="115" height="20" />
											<rect x="0" y="325" rx="0" ry="0" width="75" height="16" />

											<rect x={window.innerWidth - 100} y="300" rx="4" ry="4" width="115" height="35" />
											<rect x={window.innerWidth - 50} y="300" rx="4" ry="4" width="115" height="35" />
										</ContentLoader>
									) : (
										<React.Fragment>
											<div style={{ display: 'flex' }}>
												{single_item.image && (
													<LazyLoad>
														<img
															src={WEBSITE_URL + "/assets/img/items/" + single_item.image}
															alt={single_item.name}
															style={{ width: "30%", height: "auto", borderRadius: '1rem' }}
															className="mt-20"
														/>
													</LazyLoad>
												)}
												<div className="ml-50">
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<div>
															{single_item.is_veg || single_item.is_egg ? (
																<React.Fragment>
																	{single_item.is_veg ? (
																		<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
																	) : (
																		<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
																	)}
																</React.Fragment>
															) : (
																<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
															)}
														</div>
														<div className="mt-3 ml-2" style={{ fontWeight: 'bolder', fontSize: '16px' }}>
															{single_item.name}
														</div>
													</div>
													<div className="mt-1" style={{ color: '#7E7E7E', fontSize: '13px' }}>
														{single_item.description}
													</div>
													<div className="mt-1" style={{ display: 'flex', alignItems: 'center' }}>
														<div className="mr-5" style={{ fontWeight: '600', fontSize: '14px' }}>
															<span className="rupees-symbol">₹ </span>{single_item.price}
														</div>
														{single_item.old_price && single_item.old_price > 0 &&
															<div style={{ color: 'red', textDecoration: 'line-through', fontSize: '12px' }}>
																<span className="rupees-symbol">₹ </span>{single_item.old_price}
															</div>
														}
													</div>
													{single_item.addon_categories.length > 0 && (
														<span
															className="customizable-item-text"
															style={{
																color: localStorage.getItem("storeColor"),
															}}
														>
															Customizable
														</span>
													)}
													{cartProducts.find((cp) => cp.id === single_item.id) !==
														undefined && (
															<React.Fragment>
																<div className="item-actions mt-2">
																	<div
																		className="btn-group btn-group-sm"
																		role="group"
																		aria-label="btnGroupIcons1"
																		style={{ borderRadius: "0.5rem" }}
																	>
																		{single_item.is_active ? (
																			<React.Fragment>
																				{single_item.addon_categories.length ? (
																					null
																				) : (
																					<button
																						type="button"
																						className="btn btn-add-remove"
																						style={{ "width": "30px", "borderBottom": "1px solid #FF4848", "borderLeft": "1px solid #FF4848", "borderTop": "1px solid #FF4848", "borderTopLeftRadius": "0.8rem", "borderBottomLeftRadius": "0.8rem" }}
																						onClick={() => {
																							single_item.quantity = 1;
																							removeProduct(single_item);
																							this.forceStateUpdate();
																						}}
																					>
																						<span class="btn-dec">-</span>
																						{/* <Ink duration="500" /> */}
																					</button>
																				)}
																				{single_item.addon_categories.length ? null : (
																					<span
																						className="pl-2 pr-2"
																						style={{ "border": "none", "width": "10px", "color": "#FF4848", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontWeight": "600", "fontSize": "1rem", "borderTop": "1px solid #FF4848", "borderBottom": "1px solid #FF4848", "backgroundColor": "rgb(255, 255, 255)" }}
																					>
																						<React.Fragment>
																							{
																								cartProducts.find(
																									(cp) => cp.id === single_item.id
																								).quantity
																							}
																						</React.Fragment>
																					</span>
																				)}

																				{single_item.addon_categories.length ? (
																					<Customization
																						product={single_item}
																						addProduct={addProduct}
																						forceUpdate={this.forceStateUpdate}
																					/>
																				) : (
																					<button
																						type="button"
																						className="btn btn-add-remove"
																						style={{ "width": "30px", "color": "#FF4848", "borderTopRightRadius": "0.8rem", "borderBottomRightRadius": "0.8rem", "borderTop": "1px solid #FF4848", "borderRight": "1px solid #FF4848", "borderBottom": "1px solid #FF4848" }}
																						onClick={() => {
																							addProduct(single_item);
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

													{cartProducts.find((cp) => cp.id === single_item.id) ===
														undefined && (
															<React.Fragment>
																<div className="item-actions mt-2">
																	{single_item.is_active ? (
																		<React.Fragment>
																			{single_item.addon_categories.length ? (
																				<Customization
																					product={single_item}
																					addProduct={addProduct}
																					forceUpdate={this.forceStateUpdate}
																				/>
																			) : (
																				<button
																					type="button"
																					style={{ "position": "relative", "border": "1px solid rgb(255, 72, 72)", "color": "rgb(255, 72, 72)", "width": "70px", "backgroundColor": "rgb(255, 255, 255)", "letterSpacing": "0.8px", "fontWeight": "bolder", "padding": "4px", "borderRadius": "0.8rem" }}
																					onClick={() => {
																						single_item.quantity = 1;
																						addProduct(single_item);
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
											</div>
										</React.Fragment>
									)}
								</div>
							</div>
						</div>
					)}

					<Footer />

					{!this.state.loading && (
						<React.Fragment>
							{this.state.is_active ? (
								<FloatCart />
							) : (
								<div className="auth-error no-click">
									<div className="error-shake">Currently Not Accepting Any Orders</div>
								</div>
							)}
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurant_info: state.items.restaurant_info,
	cartProducts: state.cart.products,
	single_item: state.items.single_item,
	settings: state.settings.settings,
});

export default connect(
	mapStateToProps,
	{
		getRestaurantInfo,
		getRestaurantItems,
		resetItems,
		resetInfo,
		getSingleItem,
		addProduct,
		removeProduct,
		getSettings,
	}
)(SingleItem);
