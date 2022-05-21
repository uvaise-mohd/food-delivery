import React, { Component } from "react";
import {
	getRestaurantInfo,
	getRestaurantItems,
	getRestaurantInfoForLoggedInUser,
} from "../../../services/items/actions";
import ItemList from "./ItemList";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import RestaurantInfo from "./RestaurantInfo";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import Fade from 'react-reveal/Fade';
import { addRating } from "../../../services/rating/actions";
import { getReviewsForStore } from "../../../services/rating/actions";
import Loading from "../../helpers/loading";
import StarRatingComponent from "react-star-rating-component";
import Moment from 'react-moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Rater from 'react-rater';
import { Edit } from "react-iconly";
import Ink from "react-ink";
import axios from "axios";
import FloatCart from "../FloatCart";
import Hero from "../Hero";
import Footer from "../Footer";

class Items extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		is_active: 1,
		loading: true,
		menuListOpen: false,
		menuClicked: false,
		couponSheet: false,
		coupon: null,
		menu: true,
		review: false,
		rating_store: 0,
		review_store: "",
		edited_rating_store: 0,
		edited_review_store: "",
		user_review_id: null,
		required_error: false,
		already_rated: false,
		completed: false,
		edit_review: false,

	};

	handleEditOpen = (content) => {
		this.setState({ edit_review: true });
	};

	handleEditClose = () => {
		this.setState({ edit_review: false });
	};

	handlePopupOpen = (content) => {
		this.setState({ couponSheet: true, coupon: content });
	};

	handlePopupClose = () => {
		this.setState({ couponSheet: false });
	};

	handleMenu = () => {
		this.setState({ menu: true, review: false });
	}

	handleReview = () => {
		this.setState({ review: true, menu: false });
	}

	componentDidMount() {
		localStorage.setItem("userSelected", "DELIVERY");
		this.props.getSettings();
		//if currentLocation doesnt exists in localstorage then redirect the user to firstscreen
		//else make API calls
		const { user } = this.props;
		let info = user.success
			? this.props.getRestaurantInfoForLoggedInUser(this.props.restaurant)
			: this.props.getRestaurantInfo(this.props.restaurant);
		this.props.getReviewsForStore(this.props.restaurant);
		if (info) {
			info.then((response) => {
				if (response) {
					if (response.payload.id) {
						//get items
						this.props.getRestaurantItems(this.props.restaurant);
					} else {
						//404, redirect to homepage
						this.context.router.history.push("/");
					}

					if (response.payload.delivery_type === 1) {
						localStorage.setItem("userSelected", "DELIVERY");
					}
					if (response.payload.delivery_type === 2) {
						localStorage.setItem("userSelected", "SELFPICKUP");
					}
					if (
						response.payload.delivery_type === 3 &&
						localStorage.getItem("userPreferredSelection") === "DELIVERY"
					) {
						localStorage.setItem("userSelected", "DELIVERY");
					}
					if (
						response.payload.delivery_type === 3 &&
						localStorage.getItem("userPreferredSelection") === "SELFPICKUP"
					) {
						localStorage.setItem("userSelected", "SELFPICKUP");
					}
					if (response.payload.is_active === "undefined") {
						this.setState({ loading: true });
					}
					if (response.payload.is_active === 1 || response.payload.is_active === 0) {
						this.setState({ loading: false });
						this.setState({ is_active: response.payload.is_active });
					}
				}
			});
		}

		if (localStorage.getItem("userSelected") === null) {
			localStorage.setItem("userSelected", "DELIVERY");
		}
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillReceiveProps(nextProps) {
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

		if (this.props.user.data) {
			if (nextProps.reviews) {
				nextProps.reviews.forEach(review => {
					if (review.user_id == this.props.user.data.id) {
						this.setState({ edited_rating_store: review.rating_store, edited_review_store: review.review_store, user_review_id: review.id });
					}
				});
			}
		}
	}

	onStoreRating = (nextValue, prevValue, name) => {
		this.setState({ rating_store: nextValue });
	};

	onEditRating = (nextValue, prevValue, name) => {
		this.setState({ edited_rating_store: nextValue });
	};

	feedbackComment = (event) => {
		event.preventDefault();
		this.setState({ [event.target.name]: event.target.value });
	};

	updateReview = () => {
		if (this.state.user_review_id) {
			this.setState({ loading: true });
			axios
				.post('https://chopze.com/public/api/update-review', {
					token: this.props.user.data.auth_token,
					id: this.state.user_review_id,
					rating: this.state.edited_rating_store,
					review: this.state.edited_review_store,
				})
				.then((response) => {
					this.setState({ loading: false, edit_review: false });
					this.props.getReviewsForStore(this.props.restaurant);
				});
		}
	}

	submitRating = () => {
		if (this.state.rating_store === 0) {
			this.setState({
				required_error: true,
			});

			setTimeout(() => {
				this.setState({
					required_error: false
				});
			}, 5000);
		} else {
			this.setState({ loading: true });
			this.props.addRating(this.props.user.data.auth_token, this.props.restaurant_info.id, this.state.rating_store, this.state.review_store).then((response) => {
				console.log(response);
				console.log("here 1");
				if (response && response.payload.success) {
					//successfully saved
					window.location.reload();
				} else {
					this.setState({
						already_rated: true,
						loading: false
					});

					setTimeout(() => {
						this.setState({
							already_rated: false
						});
					}, 5000);
				}
			});
			this.setState({
				restaurant_rating: 0,
				comment: "",
			});
		}
	};

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
		// document.getElementsByTagName("html")[0].classList.remove("page-inactive");

	}

	render() {

		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>

				{this.state.required_error && (
					<div className="auth-error-desktop mb-50">
						<div className="error-shake">Rating is required</div>
					</div>
				)}
				{this.state.already_rated && (
					<div className="auth-error-desktop mb-50">
						<div className="error-shake">The Store has been already rated by you.</div>
					</div>
				)}
				{this.state.loading && <Loading />}

				<div className="bg-white" style={{ minHeight: '100vh' }} key={this.props.restaurant}>
					<Hero />

					<RestaurantInfo
						history={this.props.history}
						restaurant={this.props.restaurant_info}
						withLinkToRestaurant={false}
					/>

					{this.state.couponSheet == true && (
						<React.Fragment>
							<div onClick={this.handlePopupClose} style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9999', position: 'fixed', backgroundColor: '#000000a6' }}>
								<Fade bottom>
									<div className="bg-white" style={{ height: 'auto', left: '12.5vw', width: '75vw', paddingLeft: '20px', paddingRight: '20px', paddingTop: '30px', paddingBottom: '75px', bottom: '0px', position: 'fixed', zIndex: '9999', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
										{/* <div className="d-flex justify-content-end mb-2" onClick={this.handlePopupClose}>Close</div> */}
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div className="pl-3 pr-3" style={{ borderRadius: '0.5rem', color: 'white', fontWeight: 'bolder', letterSpacing: '1px', backgroundColor: '#FE0B15', height: '40px', display: 'flex', alignItems: 'center' }}>
												{this.state.coupon.code}
											</div>
											<CopyToClipboard text={this.state.coupon.code}>
												<div style={{ color: '#FE0B15', fontWeight: 'bolder', letterSpacing: '1px' }}>
													COPY
												</div>
											</CopyToClipboard>
										</div>
										<div className="mt-2" style={{ fontWeight: 'bolder' }}>
											{this.state.coupon.name}
										</div>
										<hr style={{ borderTop: '1px dashed grey' }} />
										<div className="text-muted mb-20">
											{this.state.coupon.description}
										</div>
									</div>
								</Fade>
							</div>
						</React.Fragment>
					)}

					{this.state.edit_review == true && (
						<React.Fragment>
							<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9999', position: 'fixed', backgroundColor: '#000000a6' }}>
								<Fade bottom>
									<div className="bg-white" style={{ height: 'auto', left: '12.5vw', width: '75vw', paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '100px', bottom: '0px', position: 'fixed', zIndex: '9999', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
										<div className="d-flex justify-content-end"><span onClick={this.handleEditClose}>Close</span></div>
										<div>
											<StarRatingComponent
												name="edited_rating"
												starCount={5}
												value={this.state.edited_rating_store}
												onStarClick={this.onEditRating}
											/>
										</div>
										<div style={{ fontWeight: 'bolder', letterSpacing: '1px' }}>Write a Review</div>
										<div className="text-muted">Share your Experience with this Store here...</div>
										<textarea
											placeholder={localStorage.getItem("rarReviewBoxTextPlaceHolderText")}
											value={this.state.edited_review_store}
											onChange={this.feedbackComment}
											className="feedback-textarea mt-2"
											name="edited_review_store"
										/>

										<div
											onClick={this.updateReview}
											className="btn btn-lg btn-continue-desktop update-user"
											style={{
												backgroundColor: localStorage.getItem("storeColor"),
												color: 'white',
												position: "relative",
											}}
										>
											Update Review
											<Ink duration={400} />
										</div>
									</div>
								</Fade>
							</div>
						</React.Fragment>
					)}

					<div className="container">
						<div style={{ display: 'flex', alignItems: 'center', marginTop: '-30px' }}>
							<div className="col-2"></div>
							<div onClick={this.handleMenu} className="col-4 text-center pt-20 pb-20" style={{
								fontWeight: '700', color: this.state.menu ? '#ffffff' : '#FF8585',
								backgroundColor: this.state.menu ? '#FF4646' : '#FFBCBC', letterSpacing: '1px',
								borderTopLeftRadius: '0.8rem', borderBottomLeftRadius: '0.8rem', fontSize: '15px'
							}}>
								Menu
							</div>
							<div onClick={this.handleReview} className="col-4 text-center pt-20 pb-20" style={{
								fontWeight: '700', color: this.state.review ? '#ffffff' : '#FF8585',
								backgroundColor: this.state.review ? '#FF4646' : '#FFBCBC', letterSpacing: '1px',
								borderTopRightRadius: '0.8rem', borderBottomRightRadius: '0.8rem', fontSize: '15px'
							}}>
								Review
							</div>
							<div className="col-2"></div>
						</div>
					</div>

					{this.state.menu && !this.state.review &&
						<React.Fragment>
							{this.props.restaurant_info && this.props.restaurant_info.filterdCoupons && this.props.restaurant_info.filterdCoupons.length > 0 &&
								<div className="container">
									<div style={{ display: 'flex' }} className="slider-wrapper">
										{this.props.restaurant_info.filterdCoupons.map((coupon, index) => (
											<div className="p-10 mr-20" style={{ border: '2px solid #FFCCCC', borderRadius: '0.5rem' }} key={index}>
												<div onClick={() => this.handlePopupOpen(coupon)} style={{ display: 'flex', alignItems: 'center' }}>
													<img src="https://chopze.com/assets/discount.png" style={{ height: '1.5rem' }} />
													<div className="ml-1 rupees-symbol" style={{ color: '#7E7E7E', fontWeight: 'bolder' }}>{coupon.name}</div>
												</div>
												<div className="mt-1" style={{ display: 'flex', color: '#7E7E7E', fontSize: '10px' }}>
													<div>USE {coupon.code}</div>
													{coupon.max_discount &&
														<div className="ml-1">| ABOVE <span className="rupees-symbol">₹ {coupon.max_discount}</span></div>
													}
												</div>
											</div>
										))}
									</div>
								</div>
							}

							<div className="container">
								<ItemList
									data={this.props.restaurant_items}
									restaurant={this.props.restaurant_info}
									menuClicked={this.state.menuClicked}
									restaurant_backup_items={this.props.restaurant_backup_items}
								/>
							</div>
						</React.Fragment>
					}

					{this.state.review && !this.state.menu &&
						<React.Fragment>
							<div className="container">
								{this.props.user.success &&
									<div className="ml-20 mr-20 mt-20 mb-20">
										<div style={{ fontWeight: 'bolder', letterSpacing: '1px' }}>Rate Restaurant</div>
										<div>
											<StarRatingComponent
												name="rating_store"
												starCount={5}
												value={this.state.rating_store}
												onStarClick={this.onStoreRating}
											/>
										</div>
										<div style={{ fontWeight: 'bolder', letterSpacing: '1px' }}>Write a Review</div>
										<div className="text-muted">Share your Experience with this Store here...</div>
										<textarea
											placeholder={localStorage.getItem("rarReviewBoxTextPlaceHolderText")}
											value={this.state.review_store}
											onChange={this.feedbackComment}
											className="feedback-textarea mt-2"
											name="review_store"
										/>
										<button
											className="mt-2"
											style={{ "backgroundColor": "rgb(255, 70, 70)", "border": "none", "width": "10vw", "borderRadius": "0.5rem", "fontWeight": "bolder", "color": "white", "letterSpacing": "1px", "height": "40px" }}
											onClick={this.submitRating}
											type="button"
										>
											Send
										</button>
									</div>
								}
							</div>
						</React.Fragment>
					}

					{this.state.review && !this.state.menu && this.props.reviews && this.props.reviews.map((review) => (
						<React.Fragment>
							<div className="container">
								{review.review_store &&
									<div className="ml-20 mr-20">
										<hr style={{ borderTop: '1px dahsed grey' }} />
										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<div className="font-w600">{review.username}</div>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<div><Moment fromNow>{review.created_at}</Moment></div>
													{this.props.user.data && review.user_id == this.props.user.data.id &&
														<div className="ml-2" onClick={() => this.handleEditOpen()}><Edit size={18} /></div>
													}
												</div>
											</div>
											<div style={{ fontSize: '16px' }}>
												<Rater total={5} rating={review.rating_store} />
											</div>
											<p className="mt-10">{review.review_store}</p>
										</div>
									</div>
								}
							</div>
						</React.Fragment>
					))}

					<Footer />
				</div>
				<div>
					{!this.state.loading && (
						<React.Fragment>
							{this.state.is_active ? (
								<FloatCart />
							) : (
								<div className="auth-error-desktop no-click">
									<div className="error-shake">Not Accepting Any Orders</div>
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
	restaurant_items: state.items.restaurant_items,
	cartTotal: state.total.data,
	settings: state.settings.settings,
	user: state.user.user,
	restaurant_backup_items: state.items.restaurant_backup_items,
	reviews: state.rating.reviews,
});

export default connect(
	mapStateToProps,
	{
		getRestaurantInfo,
		getRestaurantItems,
		getSettings,
		getRestaurantInfoForLoggedInUser,
		getReviewsForStore,
		addRating
	}
)(Items);
