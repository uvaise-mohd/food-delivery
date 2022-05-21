import React, { Component } from "react";
import { TimeCircle } from "react-iconly";
import { withRouter } from "react-router-dom";
import { WEBSITE_URL } from "../../../configs/website";
import { connect } from "react-redux";
import {
	getDeliveryRestaurants,
	getSelfpickupRestaurants,
	getFavoriteRestaurants,
} from "../../../services/restaurant/actions";
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import Hero from "../Hero";
import Loading from "../../helpers/loading";
import Footer from "../Footer";
import { NavLink } from "react-router-dom";

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
				<Hero active_favourite={true} />

				{this.state.loading ? (
					<Loading />
				) : (
					<React.Fragment>
						<div style={{ display: 'flex', justifyContent: 'space-between' }} className="container mt-50">
							<div style={{ fontSize: '1.2em', fontWeight: '900' }}>
								Favourites
							</div>
						</div>

						{this.props.restaurants.length === 0 ? (
							<div style={{ minHeight: '30vh' }} className="text-muted mt-50 container">No Stores Found</div>
						) : (
							<React.Fragment>
								<div className="container">
									<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
										{this.props.restaurants.map((restaurant) =>
											<div className="mt-30">
												<NavLink
													to={"/desktop/stores/" + restaurant.slug}
													key={restaurant.id}
													style={{ position: "relative" }}
												>
													<div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
														<div className={`list-card-image ${!restaurant.is_active && "restaurant-not-active"}`}>
															<img alt="chopze" src={WEBSITE_URL + restaurant.image}
																style={{ width: '22.5vw', height: '15vw', objectFit: 'cover' }}
																placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"} />
														</div>
														<div className="p-3 position-relative">
															<div className="list-card-body">
																<h6 className="mb-1">{restaurant.name}</h6>
																<p className="text-muted mb-3">{restaurant.description}</p>
																{!restaurant.is_active &&
																	<div className="restaurant-not-active-msg">
																		Not Accepting Any Orders
																	</div>
																}
																<div style={{ display: 'flex', justifyContent: 'space-between' }}>
																	<p className={`text-gray mb-3 time ${!restaurant.is_active && "restaurant-not-active"}`}><span
																		className="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2"><TimeCircle className="pt-2" size={20} /> 15–30 min</span></p>
																	<div style={{ fontSize: '20px' }}>
																		<Rater total={5} rating={restaurant.avgRating} />
																	</div>
																</div>
															</div>
															{restaurant.featured_description &&
																<div className={`${!restaurant.is_active && "restaurant-not-active"}`} style={{ display: 'flex', alignItems: 'center' }}>
																	<div className="mr-1">
																		<img src="https://app.snakyz.com/assets/discount.png" style={{ height: '1.5rem' }} />
																	</div>
																	<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "12px" }}>
																		{restaurant.featured_description}
																	</div>
																</div>
															}
														</div>
													</div>
												</NavLink>
											</div>
										)}
									</div>

								</div>
							</React.Fragment>
						)}
					</React.Fragment>
				)}

				<Footer />
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
