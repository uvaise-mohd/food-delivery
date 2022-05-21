import React, { Component } from "react";
import { connect } from "react-redux";
import Hero from "../Hero";
import { getPromoSlides } from "../../../services/promoSlider/actions";
import { resetInfo, resetItems, resetBackup } from "../../../services/items/actions";
import Loading from "../../helpers/loading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { WEBSITE_URL } from "../../../configs/website";
import DelayLink from "../../helpers/delayLink";
import ProgressiveImage from "react-progressive-image";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import { TimeCircle, ChevronRight } from "react-iconly";
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import Footer from "../Footer";
import { Redirect } from "react-router";

class Desktop extends Component {

	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
	};

	async componentDidMount() {
		this.props.resetItems();
		this.props.resetInfo();
		this.props.resetBackup();

		const { user } = this.props;

		//if currentLocation doesnt exists in localstorage then redirect the user to firstscreen
		//else make API calls
		if (localStorage.getItem("userSetAddress") !== null) {
			const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));

			this.props.getPromoSlides(userSetAddress.lat, userSetAddress.lng);

		} else {
			//call to promoSlider API to fetch the slides
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.promo_slides) {
			this.setState({ loading: false });
		}
	}

	render() {

		if (localStorage.getItem("userSetAddress") === null) {
			this.context.router.history.push("/desktop/search-location");
			// console.log("Redirect to search location");
			// return <Redirect to="/desktop/search-location" />;
		}

		if (localStorage.getItem("userSetAddress")) {
			const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
			if (Object.keys(userSetAddress).length === 0 && userSetAddress.constructor === Object) {
				return <Redirect to="/desktop/search-location" />;
			}
		}

		const { history, user, promo_slides } = this.props;

		const settings1 = {
			//   centerMode: true,
			//   centerPadding: '30px',
			slidesToShow: 4,
			arrows: true,
			responsive: [{
				breakpoint: 768,
				settings: {
					arrows: true,
					centerMode: true,
					centerPadding: '40px',
					slidesToShow: 4
				}
			},
			{
				breakpoint: 480,
				settings: {
					arrows: true,
					centerMode: true,
					centerPadding: '40px',
					slidesToShow: 4
				}
			}
			]
		};

		return (
			<React.Fragment>
				<Hero active_home={true} />

				{this.state.loading && <Loading />}

				<React.Fragment>
					<div className="osahan-home-page">
						<React.Fragment>
							{promo_slides.categories &&
								<div className="container mt-20 mb-20">
									<div className="mt-20 mb-10" style={{ fontSize: '1.2em', fontWeight: '900' }}>
										Categories
									</div>
									<div className="pl-50 pr-50" style={{ display: "flex", overflowX: 'scroll', whiteSpace: 'nowrap', justifyContent: 'space-between' }}>
										{promo_slides.categories.map(category => (
											<DelayLink to={'/desktop/category-stores/' + category.id} key={category.id}>
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
								</div>
							}
						</React.Fragment>

						<React.Fragment>
							{promo_slides && promo_slides.banners && promo_slides.banners.length > 0 && (
								<div className="bg-white">
									<div className="container pt-20 pb-20">
										<Carousel showIndicators={false} infiniteLoop={true} centerMode centerSlidePercentage={45} autoFocus={true} autoPlay={true} showStatus={false} stopOnHover={false} transitionTime={500} showArrows={false} showThumbs={false}>
											{promo_slides.banners.map(slide => (
												<DelayLink to={'/desktop/banner-items/' + slide.id} key={slide.id}>
													<div className="text-center" >
														<ProgressiveImage
															delay={100}
															src={WEBSITE_URL + slide.image}
															placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
														>
															{(src, loading) => (
																<img
																	src={src}
																	alt={'offers-great'}
																	style={{
																		borderRadius: '1rem',
																		width: '30vw',
																		height: '15vw',
																	}}
																/>
															)}
														</ProgressiveImage>
													</div>
												</DelayLink>
											))}
										</Carousel>
									</div>
								</div>
							)}
						</React.Fragment>

						<React.Fragment>
							<div className="container">
								{promo_slides && promo_slides.trending_stores && promo_slides.trending_stores.length > 0 &&
									<div style={{ marginTop: '30px' }}>
										<div className="mb-10" style={{ fontSize: '1.2em', fontWeight: '900' }}>
											Trending Stores
										</div>
										<div style={{ display: "flex", overflowX: 'scroll', whiteSpace: 'nowrap' }}>
											{promo_slides.trending_stores.map((item) =>
												<div className="bg-white p-10 ml-5 mt-5 mb-5 mr-10"
													style={{ "width": "220px", "borderRadius": "10px", "boxShadow": "rgb(136 136 136) 0px 0px 10px -5px" }}>
													<NavLink
														to={"/desktop/stores/" + item.slug}
														key={item.id}
														style={{ position: "relative" }}
													>
														<LazyLoad>
															<img
																src={WEBSITE_URL + item.image}
																alt={item.name}
																style={{
																	height: '150px',
																	width: '200px',
																	borderRadius: '8px',
																	objectFit: 'cover'
																}}
																className={`${!item.is_active &&
																	"restaurant-not-active"}`}
															/>
														</LazyLoad>
														<Ink duration="500" hasTouch={true} />
													</NavLink>
													<div className="mt-5" style={{ "maxWidth": "220px", "overflow": "hidden", "fontWeight": "bolder" }}>
														{item.name}
													</div>
													{!item.is_active && (
														<div className="restaurant-not-active-msg">
															Not Accepting Any Orders
														</div>
													)}
													<div style={{ "maxWidth": "220px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
														{item.description}
													</div>
													<div className="d-flex" style={{ justifyContent: 'space-between', color: '#7E7E7E', fontSize: '9px' }}>
														<div>
															<Rater total={5} rating={item.avgRating} />
														</div>
														<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
															<TimeCircle style={{ marginRight: '1px' }} size={10} />
															<span className="mt-1"> {item.delivery_time} mins</span>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								}
							</div>
						</React.Fragment>

						{/* <React.Fragment>
							<div className="container">
								{promo_slides && promo_slides.items && promo_slides.items.length > 0 &&
									<div style={{ marginTop: '30px' }}>
										<div className="mb-10" style={{ fontSize: '1.2em', fontWeight: '900' }}>
											Trending Items
										</div>
										<div style={{ display: "flex", overflowX: 'scroll', whiteSpace: 'nowrap' }}>
											{promo_slides.items.map((item) =>
												<div className="bg-white p-10 ml-5 mt-5 mb-5 mr-10"
													style={{ "width": "170px", "borderRadius": "10px", "boxShadow": "rgb(136 136 136) 0px 0px 10px -5px" }}>
													<NavLink
														to={"/desktop/stores/" + item.store_slug + "/" + item.id}
														key={item.id}
														style={{ position: "relative" }}
													>
														<LazyLoad>
															<img
																src={WEBSITE_URL + "/assets/img/items/" + item.image}
																alt={item.name}
																style={{
																	height: '150px',
																	width: '150px',
																	borderRadius: '8px',
																	objectFit: 'cover'
																}}
															/>
														</LazyLoad>
														<Ink duration="500" hasTouch={true} />
													</NavLink>
													<div className="mt-5" style={{ "maxWidth": "150px", "overflow": "hidden" }}>
														{item.name}
													</div>
													<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "8px" }}>
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
								}
							</div>
						</React.Fragment> */}

						<React.Fragment>
							{promo_slides && promo_slides.sliders && promo_slides.sliders.length > 0 && (
								<div className="bg-white">
									<div className="container pt-20 pb-20">
										<Carousel showIndicators={false} infiniteLoop={true} autoFocus={true} selectedItem={1} autoPlay={true} centerMode centerSlidePercentage={28} transitionTime={500} showStatus={false} stopOnHover={false} showArrows={false} showThumbs={false}>
											{promo_slides.sliders.map(slide => (
												<DelayLink to={'/desktop/slider-stores/' + slide.id} key={slide.id}>
													<div className="text-center" >
														<ProgressiveImage
															delay={100}
															src={WEBSITE_URL + slide.image}
															placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
														>
															{(src, loading) => (
																<img
																	src={src}
																	alt={'offers-great'}
																	style={{
																		borderRadius: '1rem',
																		width: '18vw',
																		height: '22vw',
																	}}
																/>
															)}
														</ProgressiveImage>
													</div>
												</DelayLink>
											))}
										</Carousel>
									</div>
								</div>
							)}
						</React.Fragment>

						<React.Fragment>
							<div className="container">
								{promo_slides && promo_slides.featuresStores && promo_slides.featuresStores.length > 0 &&
									<React.Fragment>
										<div className="mt-20">
											<div style={{ fontSize: '1.2em', fontWeight: '900' }}>
												Featured Stores
											</div>
										</div>

										<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
											{promo_slides.featuresStores.map((restaurant) =>
												<div className="mt-30">
													<NavLink
														to={"/desktop/stores/" + restaurant.slug}
														key={restaurant.id}
														style={{ position: "relative" }}
													>
														<div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
															<div className="list-card-image">
																<img alt="chopze" src={WEBSITE_URL + restaurant.image}
																	className={`${!restaurant.is_active &&
																		"restaurant-not-active"}`}
																	style={{ width: '22.5vw', height: '15vw', objectFit: 'cover' }}
																	placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"} />
															</div>
															<div className="p-3 position-relative">
																<div className="list-card-body">
																	<h6 className="mb-1">{restaurant.name}</h6>
																	{!restaurant.is_active && (
																		<div className="restaurant-not-active-msg">
																			Not Accepting Any Orders
																		</div>
																	)}
																	<p className="text-muted mb-3">{restaurant.description}</p>
																	<div style={{ display: 'flex', justifyContent: 'space-between' }}>
																		<p className="text-gray mb-3 time"><span
																			className="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2"><TimeCircle className="pt-2" size={20} /> 15–30 min</span></p>
																		<div style={{ fontSize: '20px' }}>
																			<Rater total={5} rating={restaurant.avgRating} />
																		</div>
																	</div>
																</div>
																{restaurant.featured_description &&
																	<div style={{ display: 'flex', alignItems: 'center' }}>
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
									</React.Fragment>
								}
							</div>
						</React.Fragment>

						<React.Fragment>
							<div className="container">
								{promo_slides && promo_slides.stores && promo_slides.stores.length > 0 &&
									<React.Fragment>
										<div style={{ display: 'flex', justifyContent: 'space-between' }} className="mt-50">
											<div style={{ fontSize: '1.2em', fontWeight: '900' }}>
												Explore Restaurants
											</div>
											<div style={{ color: localStorage.getItem("storeColor") }} class="font-weight-bold ml-auto">
												<NavLink
													to={'/desktop/category-stores/' + 1}
													style={{ position: "relative" }}
												>
													Explore More ...
												</NavLink>
											</div>
										</div>

										<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
											{promo_slides.stores.map((restaurant) =>
												<div className="mt-20">
													<NavLink
														to={"/desktop/stores/" + restaurant.slug}
														key={restaurant.id}
														style={{ position: "relative" }}
													>
														<div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
															<div className="list-card-image">
																<img alt="chopze" src={WEBSITE_URL + restaurant.image}
																	className={`${!restaurant.is_active &&
																		"restaurant-not-active"}`}
																	style={{ width: '17vw', height: '11vw', objectFit: 'cover' }}
																	placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"} />
															</div>
															<div className="p-3 position-relative">
																<div className="list-card-body">
																	<h5 className="mb-1" style={{ maxWidth: '15vw' }}>{restaurant.name}</h5>
																	{!restaurant.is_active && (
																		<div className="restaurant-not-active-msg">
																			Not Accepting Any Orders
																		</div>
																	)}
																	<p className="text-muted mb-1">{restaurant.description}</p>
																	<div style={{ fontSize: '16px' }}>
																		<Rater total={5} rating={restaurant.avgRating} />
																	</div>
																</div>
																{restaurant.featured_description &&
																	<div style={{ display: 'flex', alignItems: 'center' }}>
																		<div className="mr-1">
																			<img src="https://app.snakyz.com/assets/discount.png" style={{ height: '1.1rem' }} />
																		</div>
																		<div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
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
									</React.Fragment>
								}
							</div>
						</React.Fragment>

					</div>
				</React.Fragment>

				<Footer />
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
)(Desktop);
