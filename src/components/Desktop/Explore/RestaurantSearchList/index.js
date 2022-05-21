import React, { Component } from "react";
import { TimeCircle } from "react-iconly";
import { WEBSITE_URL } from "../../../../configs/website";
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import { NavLink } from "react-router-dom";

class RestaurantSearchList extends Component {
	render() {
		const { restaurants } = this.props;
		// console.log(restaurants);

		return (
			<React.Fragment>
				<div className="mb-50 container">
					<h4 className="mt-5 mb-1">Restaurants</h4>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
						{restaurants.map((restaurant) =>
							<div className="mt-10">
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
														<img src="https://chopze.com/assets/discount.png" style={{ height: '1.5rem' }} />
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
		);
	}
}

export default RestaurantSearchList;
