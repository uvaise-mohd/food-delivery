import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";
import { TimeCircle } from "react-iconly";
import { withRouter } from "react-router-dom";
import { WEBSITE_URL } from "../../../../configs/website";
import Fade from "react-reveal/Fade";
import Footer from "../../Footer";
import { connect } from "react-redux";
import {
	getDeliveryRestaurants,
	getSelfpickupRestaurants,
	getFavoriteRestaurants,
} from "../../../../services/restaurant/actions";
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

class FavoriteRestaurantList extends Component {
	state = {
		total: null,
		restaurants: [],
		loading: false,
		loading_more: true,
		selfpickup: false,
		userPreferredSelectionDelivery: true,
		userPreferredSelectionSelfPickup: false,
		no_restaurants: false,
		data: [],
		review_data: [],
		isHomeDelivery: true,
	};

	componentDidMount() {
		this.getMyFavoriteRestaurants();

		if (localStorage.getItem("userPreferredSelection") === "DELIVERY") {
			this.setState({ userPreferredSelectionDelivery: true, isHomeDelivery: true });
			// this.filterDelivery();
		}
		if (
			localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
			localStorage.getItem("enSPU") === "true"
		) {
			this.setState({ userPreferredSelectionSelfPickup: true, isHomeDelivery: false });
			// this.filterSelfPickup();
		} else {
			localStorage.setItem("userPreferredSelection", "DELIVERY");
			localStorage.setItem("userSelected", "DELIVERY");
			this.setState({ userPreferredSelectionDelivery: true, isHomeDelivery: true });
		}
	}

	getMyFavoriteRestaurants = () => {
		if (localStorage.getItem("userSetAddress")) {
			this.setState({
				loading: true,
			});
			const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
			this.props.getFavoriteRestaurants(userSetAddress.lat, userSetAddress.lng).then((restaurants) => {
				if (restaurants && restaurants.payload.length) {
					this.setState({
						total: restaurants.payload.length,
						no_restaurants: false,
						loading: false,
						loading_more: false,
					});
				} else {
					this.setState({
						total: 0,
						no_restaurants: true,
						loading: false,
						loading_more: false,
					});
				}
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				<div className="bg-white" style={{ minHeight: '100vh' }}>
					<div className="text-center pt-15" style={{ "ontSize": "15px", "fontWeight": "bolder" }}>
						Favourites
					</div>

					<Footer active_favourite={true} />

					{this.state.loading ? (
						<ContentLoader
							height={378}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="30" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="60" rx="0" ry="0" width="165" height="16" />

							<rect x="20" y="145" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="155" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="185" rx="0" ry="0" width="165" height="16" />

							<rect x="20" y="270" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="280" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="310" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					) : (
						<React.Fragment>
							{this.props.restaurants.length === 0 ? (
								// <ContentLoader
								// 	height={378}
								// 	width={400}
								// 	speed={1.2}
								// 	primaryColor="#f3f3f3"
								// 	secondaryColor="#ecebeb"
								// >
								// 	<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
								// 	<rect x="144" y="30" rx="0" ry="0" width="115" height="18" />
								// 	<rect x="144" y="60" rx="0" ry="0" width="165" height="16" />

								// 	<rect x="20" y="145" rx="4" ry="4" width="80" height="78" />
								// 	<rect x="144" y="155" rx="0" ry="0" width="115" height="18" />
								// 	<rect x="144" y="185" rx="0" ry="0" width="165" height="16" />

								// 	<rect x="20" y="270" rx="4" ry="4" width="80" height="78" />
								// 	<rect x="144" y="280" rx="0" ry="0" width="115" height="18" />
								// 	<rect x="144" y="310" rx="0" ry="0" width="165" height="16" />
								// </ContentLoader>

								<div className="text-center text-muted pt-100">
									No Favourited Restaurants.
								</div>
							) : (
								<div className="pt-20 pb-100">
									{this.props.restaurants.map((restaurant, index) => (
										<React.Fragment key={restaurant.id}>
											<LazyLoad>
												<div className="col-xs-12 col-sm-12 d-flex restaurant-block">
													<DelayLink
														to={"../stores/" + restaurant.slug}
														delay={200}
														className="block text-center mb-0"
													>
														<div
															className="block-content block-content-full pt-2"
														>
															<Fade duration={500}>
																<img
																	src={WEBSITE_URL + restaurant.image}
																	alt={restaurant.name}
																	className={`restaurant-image ${!restaurant.is_active &&
																		"restaurant-not-active"}`}
																/>
															</Fade>
														</div>
														<div style={{ width: '95%' }} className="block-content ml-4 block-content-full restaurant-info">
															<div className="font-w600 text-dark">
																{restaurant.name}
															</div>
															<div style={{ fontSize: '10px' }} className="text-muted truncate-text text-muted">
																{restaurant.description}
															</div>
															<div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
																<TimeCircle className="mr-2" size={10} />{" "}
																{restaurant.delivery_time}{" "}
																mins
															</div>
															{!restaurant.is_active && (
																<div className="restaurant-not-active-msg">
																	Not Accepting Any Orders
																</div>
															)}
															<Rater total={5} rating={restaurant.avgRating} />
															<hr style={{ borderTop: '1px dashed #707070', marginTop: '0px', marginBottom: '0px' }} />
															{restaurant.featured_description &&
																<div style={{ display: 'flex', alignItems: 'center' }}>
																	<div className="mr-1">
																		<img src="https://app.snakyz.com/assets/discount.png" style={{ height: '1rem' }} />
																	</div>
																	<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
																		{restaurant.featured_description}
																	</div>
																</div>
															}
														</div>
														<Ink duration="500" hasTouch={false} />
													</DelayLink>
												</div>
											</LazyLoad>
										</React.Fragment>
									))}
								</div>
							)}
						</React.Fragment>
					)}

					{this.state.loading_more ? (
						<div className="">
							<ContentLoader
								height={120}
								width={400}
								speed={1.2}
								primaryColor="#f3f3f3"
								secondaryColor="#ecebeb"
							>
								<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
								<rect x="144" y="35" rx="0" ry="0" width="115" height="18" />
								<rect x="144" y="65" rx="0" ry="0" width="165" height="16" />
							</ContentLoader>
						</div>
					) : null}
				</div>
			</React.Fragment>
		);
	}
}

// export default withRouter(FavoriteRestaurantList);

const mapStateToProps = (state) => ({
	restaurants: state.restaurant.favoriteRestaurants,
});

export default withRouter(
	connect(
		mapStateToProps,
		{
			getDeliveryRestaurants,
			getSelfpickupRestaurants,
			getFavoriteRestaurants,
		}
	)(FavoriteRestaurantList)
);
