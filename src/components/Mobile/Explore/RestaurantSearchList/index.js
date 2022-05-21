import React, { Component } from "react";

import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";
import { TimeCircle } from "react-iconly";
import { WEBSITE_URL } from "../../../../configs/website";
import Fade from "react-reveal/Fade";
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

class RestaurantSearchList extends Component {
	render() {
		const { restaurants } = this.props;
		// console.log(restaurants);

		return (
			<React.Fragment>
				<div className="bg-white mb-50">
					<h4 className="px-15 mb-1">Restaurants</h4>
					{restaurants.map((restaurant) => (
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
													style={{ borderRadius: '0.8rem' }}
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
			</React.Fragment>
		);
	}
}

export default RestaurantSearchList;
