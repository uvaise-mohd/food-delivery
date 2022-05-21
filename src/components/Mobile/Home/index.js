import * as firebase from "firebase/app";

import React, { Component } from "react";
import Ink from "react-ink";
import Footer from "../Footer";
import Meta from "../../helpers/meta";
import Nav from "../Nav";
import PromoSlider from "./PromoSlider";
import SmallSlider from "./SmallSlider";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getPromoSlides } from "../../../services/promoSlider/actions";
import { Search } from "react-iconly";
import messaging from "../../../init-fcm";
import { resetInfo, resetItems, resetBackup } from "../../../services/items/actions";
import { WEBSITE_URL } from "../../../configs/website";
import { Link } from "react-router-dom";
import Loading from "../../helpers/loading";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import { TimeCircle, Star } from "react-iconly";
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import DelayLink from "../../helpers/delayLink";
// import moment from "moment";

class Home extends Component {

	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
		shuffle: [],
	};

	async componentDidMount() {
		this.props.resetItems();
		this.props.resetInfo();
		this.props.resetBackup();

		const { user } = this.props;

		document.getElementsByTagName("html")[0].classList.remove("page-inactive");

		//if currentLocation doesnt exists in localstorage then redirect the user to firstscreen
		//else make API calls
		if (localStorage.getItem("userSetAddress") !== null) {
			// this.context.router.history.push("/search-location");
			// console.log("Redirect to search location");
			// return <Redirect to="/search-location" />;
			const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));

			this.props.getPromoSlides(userSetAddress.lat, userSetAddress.lng)
				.then((response) => {
					console.log(response.payload.stores)
					this.setState({ shuffle: response.payload.stores })
				});



		} else {
			//call to promoSlider API to fetch the slides
		}

		// if (user.success) {
		// 	if (localStorage.getItem("enablePushNotification") === "true") {
		// 		if (firebase.messaging.isSupported()) {
		// 			// const today = moment().toDate();

		// 			// console.log("TODAY", today);
		// 			// const lastSavedNotificationToken = moment(localStorage.getItem("lastSavedNotificationToken"));
		// 			// const days = moment(today).diff(lastSavedNotificationToken, "days");

		// 			// console.log("DAYS", days);

		// 			// const callForNotificationToken = isNaN(days) || days >= 5;

		// 			// console.log(callForNotificationToken);
		// 			// if (callForNotificationToken) {
		// 			let handler = this.props.saveNotificationToken;
		// 			messaging
		// 				.requestPermission()
		// 				.then(async function() {
		// 					const push_token = await messaging.getToken();
		// 					handler(push_token, user.data.id, user.data.auth_token);
		// 					// localStorage.setItem("lastSavedNotificationToken", today);
		// 				})
		// 				.catch(function(err) {
		// 					console.log("Unable to get permission to notify.", err);
		// 				});
		// 			// }
		// 		}
		// 	}
		// }
		// this.interval = setInterval(() => this.refreshPage(), 5000);
	}

	refreshPage = () => {
		var array = [];
		array = this.props.promo_slides.stores;
		var currentIndex = this.props.promo_slides.stores.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		// console.log(array);
		this.setState({ shuffle: array })
		// return array;
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.promo_slides) {
			this.setState({ loading: false });
		}
		// if (this.props.languages !== nextProps.languages) {
		// 	if (localStorage.getItem("userPreferedLanguage")) {
		// 		this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
		// 	} else {
		// 		if (nextProps.languages.length) {
		// 			// console.log("Fetching Translation Data...");
		// 			const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
		// 			this.props.getSingleLanguageData(id);
		// 		}
		// 	}
		// }
		// clearInterval(this.interval);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}

		if (localStorage.getItem("userSetAddress") === null) {
			// this.context.router.history.push("/search-location");
			// console.log("Redirect to search location");
			return <Redirect to="/search-location" />;
		}

		const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
		if (Object.keys(userSetAddress).length === 0 && userSetAddress.constructor === Object) {
			return <Redirect to="/search-location" />;
		}

		const { history, user, promo_slides } = this.props;



		const stores = this.state.shuffle;

		// console.log(stores);

		return (
			<React.Fragment>
				{/* <PullToRefresh onRefresh={() => window.location.reload()}> */}
					<React.Fragment>
						<Meta
							ogtype="website"
							ogurl={window.location.href}
						/>

						{this.state.loading && <Loading />}

						<div className="height-100-percent bg-white">
							<Nav
								active_nearme={true}
								disable_back_button={true}
								history={history}
								loggedin={user.success}
							/>

							<Link to="explore">
								<div
									className="mock-search-block bg-white px-15 pt-10"
								>
									<div className="px-15 d-flex justify-content-between">
										<div>
											<span>Search Food or Store Here</span>
										</div>
										<div style={{ color: '#ababab', marginTop: '5px' }}>
											<Search />
										</div>
									</div>
								</div>
							</Link>

							{promo_slides.message && promo_slides.message.message &&
								<div className="ml-15 mr-15 mt-20 p-10" style={{ border: '1px solid red', borderRadius: '1rem' }}>
									{promo_slides.message.message}
								</div>
							}

							{promo_slides.categories &&
								<React.Fragment>
									<div className="ml-15 mt-20" style={{ fontSize: '1.2em', fontWeight: '900' }}>
										Categories
									</div>
									<div className="ml-15 mr-15 mt-20" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
										{promo_slides.categories.map(category => (
											<DelayLink to={'/category-stores/' + category.id} key={category.id}>
												<div style={{ textAlign: '-webkit-center' }}>
													<div className="category-block">
														<img style={{ height: '2rem', width: '2rem' }} src={WEBSITE_URL + category.image} />
													</div>
													<div className="mt-2" style={{ fontSize: '13px', fontWeight: '900' }}>
														{category.name}
													</div>
												</div>
											</DelayLink>
										))}
									</div>
								</React.Fragment>
							}

							{/* Passing slides as props to PromoSlider */}
							<React.Fragment>
								{promo_slides && promo_slides.banners && promo_slides.banners.length > 0 && (
									<PromoSlider
										slides={promo_slides.banners}
									/>
								)}
							</React.Fragment>

							{/* {promo_slides && promo_slides.items && promo_slides.items.length > 0 &&
								<div className="ml-15 mr-15" style={{ marginTop: '30px' }}>
									<div className="mb-10" style={{ fontSize: '1.2em', fontWeight: '900' }}>
										Trending Items
									</div>
									<div style={{ display: "flex", overflowX: 'scroll', whiteSpace: 'nowrap' }}>
										{promo_slides.items.map((item) =>
											<div className="trending-item p-10 ml-5 mt-5 mb-5 mr-5">
												<NavLink
													to={"stores/" + item.store_slug + "/" + item.id}
													key={item.id}
													style={{ position: "relative" }}
												>
													<LazyLoad>
														<img
															src={WEBSITE_URL + "/assets/img/items/" + item.image}
															alt={item.name}
															style={{
																height: '90px',
																width: '90px',
																borderRadius: '8px',
																objectFit: 'cover'
															}}
														/>
													</LazyLoad>
													<Ink duration="500" hasTouch={true} />
												</NavLink>
												<div className="mt-5" style={{ "maxWidth": "90px", "overflow": "hidden" }}>
													{item.name}
												</div>
												<div style={{ "maxWidth": "90px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "8px" }}>
													{item.description}
												</div>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<div className="mr-5" style={{ fontWeight: '600', fontSize: '11px' }}>
														<span className="rupees-symbol">₹ </span>{item.price}
													</div>
													{item.old_price && item.old_price > 0 &&
														<div style={{ color: 'red', textDecoration: 'line-through', fontSize: '9px' }}>
															<span className="rupees-symbol">₹ </span>{item.old_price}
														</div>
													}
												</div>
											</div>
										)}
									</div>
								</div>
							} */}

							{promo_slides && promo_slides.trending_stores && promo_slides.trending_stores.length > 0 &&
								<div className="ml-15 mr-15" style={{ marginTop: '30px' }}>
									<div className="mb-10" style={{ fontSize: '1.2em', fontWeight: '900' }}>
										Trending Stores
									</div>
									<div style={{ display: "flex", overflowX: 'scroll', whiteSpace: 'nowrap' }}>
										{promo_slides.trending_stores.map((store) =>
											<div className="p-10 ml-5 mt-5 mb-5 mr-5" style={{ borderRadius: '10px', boxShadow: 'rgb(136 136 136) 0px 0px 10px -5px' }}>
												<NavLink
													to={"stores/" + store.slug}
													key={store.id}
													style={{ position: "relative" }}
												>
													<LazyLoad>
														<img
															src={WEBSITE_URL + store.image}
															alt={store.name}
															style={{
																height: '80px',
																width: '32vw',
																borderRadius: '8px',
																objectFit: 'cover'
															}}
															className={`${!store.is_active &&
																"restaurant-not-active"}`}
														/>
													</LazyLoad>
													<Ink duration="500" hasTouch={true} />
												</NavLink>
												<div className="mt-5" style={{ "maxWidth": "32vw", "overflow": "hidden", "fontWeight": "bolder" }}>
													{store.name}
												</div>
												{!store.is_active && (
													<div className="restaurant-not-active-msg">
														Not Accepting Any Orders
													</div>
												)}
												<div style={{ "maxWidth": "32vw", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
													{store.description}
												</div>
												<div className="d-flex" style={{ justifyContent: 'space-between', color: '#7E7E7E', fontSize: '9px' }}>
													<div>
														<Rater total={5} rating={store.avgRating} />
													</div>
													<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
														<TimeCircle style={{ marginRight: '1px' }} size={10} />
														<span className="mt-1"> {store.delivery_time} mins</span>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							}

							<React.Fragment>
								<div style={{ marginTop: (promo_slides.trending_stores && promo_slides.trending_stores.length > 0) ? null : '50px' }}>
									{promo_slides && promo_slides.sliders && promo_slides.sliders.length > 0 && (
										<SmallSlider
											slides={promo_slides.sliders}
										/>
									)}
								</div>
							</React.Fragment>

							{promo_slides && promo_slides.featuresStores && promo_slides.featuresStores.length > 0 &&
								<div style={{ marginTop: '30px' }}>
									<div className="ml-10" style={{ fontSize: '1.2em', fontWeight: '900' }}>
										Featured Stores
									</div>
									<div className="d-flex m-0" style={{
										flexWrap: "wrap",
										margin: '5px',
										padding: '10px',
										justifyContent: "space-between",
										backgroundColor: 'white'
									}}
									>
										{promo_slides.featuresStores.map((restaurant) =>
											<div className="store-block p-10 d-flex justify-content-center">
												<NavLink
													to={"stores/" + restaurant.slug}
													key={restaurant.id}
													style={{ position: "relative" }}
												>
													<LazyLoad>
														<img
															src={WEBSITE_URL + restaurant.image}
															placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"}
															// alt={restaurant.name}
															style={{
																height: '80px',
																width: '36vw',
																borderRadius: '8px',
																objectFit: 'cover'
															}}
															className={`${!restaurant.is_active &&
																"restaurant-not-active"}`}
														/>
													</LazyLoad>
													<div className="mt-5" style={{ "maxWidth": "36vw", "overflow": "hidden", "fontWeight": "bolder" }}>
														{restaurant.name}
													</div>
													{!restaurant.is_active && (
														<div className="restaurant-not-active-msg">
															Not Accepting Any Orders
														</div>
													)}
													<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
														{restaurant.description}
													</div>
													<div className="d-flex" style={{ justifyContent: 'space-between', color: '#7E7E7E', fontSize: '9px' }}>
														<div>
															<Rater total={5} rating={restaurant.avgRating} />
														</div>
														<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
															<TimeCircle style={{ marginRight: '1px' }} size={10} />
															<span> {restaurant.delivery_time} mins</span>
														</div>
													</div>
													{restaurant.featured_description &&
														<div style={{ display: 'flex', alignItems: 'center' }}>
															<div className="mr-1">
																<img src="https://chopze.com/assets/discount.png" style={{ height: '1rem' }} />
															</div>
															<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
																{restaurant.featured_description}
															</div>
														</div>
													}
													<Ink duration="500" hasTouch={true} />
												</NavLink>
											</div>
										)}
									</div>
								</div>
							}

							{promo_slides && promo_slides.stores && promo_slides.stores.length > 0 ? (
								<React.Fragment>
									<div className="ml-10" style={{ fontSize: '1.2em', fontWeight: '900', marginTop: promo_slides.featuresStores.length ? null : '30px' }}>
										Explore Restaurants
									</div>
									<div className="d-flex m-0" style={{
										flexWrap: "wrap",
										margin: '5px',
										padding: '10px',
										justifyContent: "space-between",
										backgroundColor: 'white'
									}}
									>
										{stores.map((restaurant) =>
											<div className="store-block p-10 d-flex justify-content-center">
												<NavLink
													to={"stores/" + restaurant.slug}
													key={restaurant.id}
													style={{ position: "relative" }}
												>
													<LazyLoad>
														<img
															src={WEBSITE_URL + restaurant.image}
															placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"}
															// alt={restaurant.name}
															style={{
																height: '80px',
																width: '36vw',
																borderRadius: '8px',
																objectFit: 'cover'
															}}
															className={`${!restaurant.is_active &&
																"restaurant-not-active"}`}
														/>
													</LazyLoad>
													<div className="mt-5" style={{ "maxWidth": "36vw", "overflow": "hidden", "fontWeight": "bolder" }}>
														{restaurant.name}
													</div>
													{!restaurant.is_active && (
														<div className="restaurant-not-active-msg">
															Not Accepting Any Orders
														</div>
													)}
													<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
														{restaurant.description}
													</div>
													<div className="d-flex" style={{ justifyContent: 'space-between', color: '#7E7E7E', fontSize: '9px' }}>
														<div>
															<Rater total={5} rating={restaurant.avgRating} />
														</div>
														<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
															<TimeCircle style={{ marginRight: '1px' }} size={10} />
															<span> {restaurant.delivery_time} mins</span>
														</div>
													</div>
													{restaurant.featured_description &&
														<div style={{ display: 'flex', alignItems: 'center' }}>
															<div className="mr-1">
																<img src="https://chopze.com/assets/discount.png" style={{ height: '1rem' }} />
															</div>
															<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
																{restaurant.featured_description}
															</div>
														</div>
													}
													<Ink duration="500" hasTouch={true} />
												</NavLink>
											</div>
										)}
									</div>
								</React.Fragment>
							) : (
								<React.Fragment>
									<img src={`${WEBSITE_URL}/assets/34799-restaurant-locations.gif`} style={{ width: '50vw', marginLeft: '25vw', opacity: '0.5', marginTop: '10vh', marginBottom: '2vh' }} />
									<div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '5vh', opacity: '0.5', textAlign: 'center' }}>We are Not Operational at this Location</div>
								</React.Fragment>
							)}

							{promo_slides && promo_slides.categories &&
								<NavLink
									to={'/category-stores/' + 1}
									style={{ position: "relative" }}
								>
									<div className="view-more text-center ml-15 mr-15 mb-100 pt-10 pb-10">View More Restaurants</div>
									<Ink duration="500" hasTouch={true} />
								</NavLink>
							}

							{/* <RestaurantList user={user} /> */}
							<Footer active_home={true} />
						</div>
					</React.Fragment>
				{/* </PullToRefresh> */}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	promo_slides: state.promo_slides.promo_slides,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{
		getPromoSlides,
		resetInfo,
		resetItems,
		resetBackup,
	}
)(Home);
