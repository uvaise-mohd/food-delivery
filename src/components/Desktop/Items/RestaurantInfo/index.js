import React, { Component } from "react";
import { WEBSITE_URL } from "../../../../configs/website";
import ContentLoader from "react-content-loader";
import { connect } from "react-redux";
import { setFavoriteRest } from "../../../../services/items/actions";
import ProgressiveImage from "react-progressive-image";
import Ink from "react-ink";
import { ChevronLeft } from "react-iconly";
import Rater from 'react-rater';
import { TimeCircle } from "react-iconly";

class RestaurantInfo extends Component {
	state = {
		withLinkToRestaurant: false,
		isFavorite: false,
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		this.setState({ withLinkToRestaurant: this.props.withLinkToRestaurant });
		if (this.props.history.location.state && this.props.history.location.state.fromExplorePage) {
			this.setState({ withLinkToRestaurant: this.props.history.location.state.fromExplorePage });
		}

		this.registerScrollEvent();
	}

	componentWillUnmount() {
		this.removeScrollEvent();
	}

	fixedRestaurantInfo = (hidden) => {
		if (this.child) {
			if (hidden) {
				this.child.heading.classList.add("hidden");
			} else {
				this.child.heading.classList.remove("hidden");
			}
		}
	};

	registerScrollEvent() {
		window.addEventListener("scroll", this.scrollFunc);
	}
	removeScrollEvent() {
		window.removeEventListener("scroll", this.scrollFunc);
	}
	scrollFunc = () => {
		if (document.documentElement.scrollTop > 55) {
			let hidden = false;
			this.fixedRestaurantInfo(hidden);
		}
		if (document.documentElement.scrollTop < 55) {
			let hidden = true;
			this.fixedRestaurantInfo(hidden);
		}
	};

	setFavoriteRestaurant = () => {
		const { restaurant_info, user } = this.props;
		if (user.success) {
			if (restaurant_info.is_favorited) {
				this.refs.heartIcon.classList.remove("is-active");
			} else {
				this.refs.heartIcon.classList.add("is-active");
			}
			this.props.setFavoriteRest(user.data.auth_token, restaurant_info.id);
		}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.restaurant_info !== prevState.restaurant_info) {
			return {
				data: nextProps.restaurant_info,
			};
		} else {
			return null;
		}
	}

	render() {
		const { history, restaurant, user } = this.props;
		console.log(restaurant)
		return (
			<React.Fragment>
				<div>
					{/* {restaurant &&
						<ProgressiveImage
							delay={100}
							src={WEBSITE_URL + restaurant.image}
							placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
						>
							{(src, loading) => (
								<img src={src} className="img-fluid" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
							)}
						</ProgressiveImage>
					} */}

					{restaurant.length === 0 ? (
						<ContentLoader
							height={170}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					) : (
						<React.Fragment>
							<div className="offer-section pt-10 pb-50">
								<div className="container position-relative">
									<ProgressiveImage
										delay={100}
										src={WEBSITE_URL + restaurant.image}
										placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
									>
										{(src, loading) => (
											<img src={src} className="restaurant-pic" />
										)}
									</ProgressiveImage>
									{user.success && (
										<span onClick={this.setFavoriteRestaurant}>
											<div
												ref="heartIcon"
												className={`heart-desktop ${restaurant.is_favorited && "is-active"}`}
											/>
										</span>
									)}
									<div className="pt-3 text-white">
										<h2 className="font-weight-bold text-white">{restaurant.name}</h2>
										<p className="text-white m-0">{restaurant.description}</p>
										<div style={{ fontSize: '25px' }}>
											<Rater total={5} rating={restaurant.avgRating} />
										</div>
									</div>
									<div className="pb-4">
										<div className="row">
											<div className="col-6 col-md-2">
												<p className="text-white-50 font-weight-bold m-0 small">ETA</p>
												<p className="text-white m-0">{restaurant.delivery_time}{" "}mins</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</React.Fragment>
					)}
				</div>
				{restaurant.custom_message !== "<p><br></p>" &&
					restaurant.custom_message !== "null" &&
					(restaurant.custom_message !== "" && (
						<div
							style={{
								position: "relative",
								background: "#fff",
							}}
							dangerouslySetInnerHTML={{
								__html: restaurant.custom_message,
							}}
						/>
					))}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurant_info: state.items.restaurant_info,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ setFavoriteRest }
)(RestaurantInfo);
