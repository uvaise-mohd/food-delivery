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
import {
  resetInfo,
  resetItems,
  resetBackup,
} from "../../../services/items/actions";
import { WEBSITE_URL } from "../../../configs/website";
import { Link } from "react-router-dom";
import Loading from "../../helpers/loading";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import { TimeCircle, Star, Location } from "react-iconly";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import DelayLink from "../../helpers/delayLink";
import HomeHeader from "./HomeHeader";
import StoreCategories from "./StoreCategories";
import RecommendedItems from "./RecommendedItems";
import Categories from "./Categories";
import PopularRestaurants from "./PopularRestaurants";
import SuggestedItems from "./SuggestedItems";
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

      this.props
        .getPromoSlides(userSetAddress.lat, userSetAddress.lng)
        .then((response) => {
          console.log(response.payload.stores);
          this.setState({ shuffle: response.payload.stores });
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
    var currentIndex = this.props.promo_slides.stores.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    // console.log(array);
    this.setState({ shuffle: array });
    // return array;
  };
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
    if (
      Object.keys(userSetAddress).length === 0 &&
      userSetAddress.constructor === Object
    ) {
      return <Redirect to="/search-location" />;
    }

    const { history, user, promo_slides } = this.props;

    const stores = this.state.shuffle;

    // console.log(stores);
    const test = [
      {
        id: 1,
        name: "Vegetable",
        image: "",
      },
      {
        id: 2,
        name: "Meat",
        image: "",
      },
      {
        id: 3,
        name: "Seafood",
        image: "",
      },
      {
        id: 2,
        name: "Seafood",
        image: "",
      },
      {
        id: 2,
        name: "Driedfoods",
        image: "",
      },
      {
        id: 2,
        name: "Fast Food",
        image: "",
      },
      {
        id: 2,
        name: "Fruit",
        image: "",
      },
      {
        id: 2,
        name: "Vegetable",
        image: "",
      },
    ];
    const colors = [
      "#3A860A",
      "#EF8E91",
      "#D26227",
      "#0BAA45",
      "#CB720B",
      "#37A1EE",
      "#FBA808",
    ];

    return (
      <React.Fragment>
        {/* <PullToRefresh onRefresh={() => window.location.reload()}> */}
        <React.Fragment>
          <Meta ogtype="website" ogurl={window.location.href} />

          {this.state.loading && <Loading />}

          <div className="height-100-percent bg-white p-10">
            <HomeHeader
              active_nearme={true}
              disable_back_button={true}
              history={history}
              loggedin={user.success}
            />
            <Nav
              active_nearme={true}
              disable_back_button={true}
              history={history}
              loggedin={user.success}
            />

            <Link to="explore">
              <div className="mock-search-block bg-white px-5 pt-10">
                <div
                  style={{ backgroundColor: "#F5F5F8", border: "none" }}
                  className="px-15 d-flex justify-content-start align-items-center"
                >
                  <div style={{ color: "#ababab", marginTop: "5px" }}>
                    <Search set={"light"} primaryColor="#000" size={"small"} />
                  </div>
                  <div className="ml-10">
                    <span>Search Food or Store Here</span>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="explore">
              <div className=" px-5 pt-20">
                <img style={{ width: "100%" }} src="assets/img/card.png" />
              </div>
            </Link>
            {promo_slides.message && promo_slides.message.message && (
              <div
                className="ml-15 mr-15 mt-20 p-10"
                style={{ border: "1px solid red", borderRadius: "1rem" }}
              >
                {promo_slides.message.message}
              </div>
            )}

            {promo_slides.categories && (
              <StoreCategories promo_slides={promo_slides} />
            )}

            {/* Passing slides as props to PromoSlider */}

            {/* <React.Fragment>
              {promo_slides &&
                promo_slides.sliders &&
                promo_slides.sliders.length > 0 && (
                  <SmallSlider slides={promo_slides.sliders} />
                )}
            </React.Fragment> */}

            {promo_slides &&
              promo_slides.featuresStores &&
              promo_slides.featuresStores.length > 0 && (
                <PopularRestaurants promo_slides={promo_slides} />
              )}
              {promo_slides &&
              promo_slides.master_categories &&
              promo_slides.master_categories.length > 0 && (
                <Categories master_categories={promo_slides.master_categories} />
              )}
            {promo_slides &&
              promo_slides.items &&
              promo_slides.items.length > 0 && (
                <RecommendedItems promo_slides={promo_slides} />
              )}

            {promo_slides && promo_slides.coupon && (
              <Link to="explore">
                <div className=" px-5 pt-20">
                  <img
                    style={{ width: "100%" }}
                    src={"https://app.snakyz.com/" + promo_slides.coupon.image}
                  />
                </div>
              </Link>
            )}
            <React.Fragment>
              {promo_slides &&
                promo_slides.banners &&
                promo_slides.banners.length > 0 && (
                  <PromoSlider slides={promo_slides.banners} />
                )}


            </React.Fragment>

            {promo_slides &&
              promo_slides.items &&
              promo_slides.items.length > 0 && (
                <SuggestedItems promo_slides={promo_slides} />
              )} 

            {promo_slides &&
            promo_slides.stores &&
            promo_slides.stores.length > 0 ? (
              <React.Fragment>
                <div className="d-flex align-items-center justify-content-between">
                  <div
                    className="ml-10 mt-10"
                    style={{ fontSize: "1.2em", fontWeight: "600" }}
                  >
                    Restaurants Near You
                  </div>
                </div>
                {stores.map((restaurant) => (
                  <div className="d-flex align-items-center ml-10 ">
                    <NavLink
                      to={"stores/" + restaurant.slug}
                      key={restaurant.id}
                      style={{ position: "relative" }}
                    >
                      <div className="d-flex align-items-center mt-20">
                        <div className="">
                          <LazyLoad>
                            <img
                              src={WEBSITE_URL + restaurant.image}
                              placeholder={
                                "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"
                              }
                              // alt={restaurant.name}
                              style={{
                                height: "140px",
                                width: "115px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                              className={`${!restaurant.is_active &&
                                "restaurant-not-active"}`}
                            />
                          </LazyLoad>
                        </div>
                        <div className="d-flex flex-column align-items-start ml-20">
                          <div className="nearby-name">{restaurant.name}</div>
                          <div className="nearby-desc mt-5">
                            {restaurant.description}
                          </div>
                          <div className="nearby-address mt-5">
                            {restaurant.address}
                          </div>
                          <hr className="hr-nearby " />

                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{
                              width: "50vw",
                              color: "#000",
                              fontWeight: 600,
                              fontSize: "11px",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div>
                                <Rater total={1} rating={1} />
                              </div>
                              <div className="ml-5">
                                4.5
                                {/* {restaurant.avgRating} */}
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="mt-1">
                                <TimeCircle
                                  style={{ marginRight: "1px" }}
                                  size={12}
                                />
                              </div>
                              <div className="ml-5">
                                {restaurant.delivery_time} Mins
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="mt-1">
                                <Location
                                  style={{ marginRight: "1px" }}
                                  primaryColor={"#FF0000"}
                                  set={"bold"}
                                  size={12}
                                />
                              </div>
                              <div className="ml-5">
                                {parseFloat(restaurant.distance).toFixed(2)} Km
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-around">
                            {restaurant.coupons &&
                              restaurant.coupons.length !== 0 &&
                              restaurant.coupons.slice(0, 2).map((coupon) => (
                                <div className="d-flex align-items-center nearby-coupons mr-10">
                                  {coupon.code}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <Ink duration="500" hasTouch={true} />
                    </NavLink>
                  </div>
                ))}

                {/* <div
                  className="d-flex m-0"
                  style={{
                    flexWrap: "wrap",
                    margin: "5px",
                    padding: "10px",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                  }}
                >
                  {stores.map((restaurant) => (
                    <div className="store-block p-10 d-flex justify-content-center">
                      <NavLink
                        to={"stores/" + restaurant.slug}
                        key={restaurant.id}
                        style={{ position: "relative" }}
                      >
                        <LazyLoad>
                          <img
                            src={WEBSITE_URL + restaurant.image}
                            placeholder={
                              "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"
                            }
                            // alt={restaurant.name}
                            style={{
                              height: "80px",
                              width: "36vw",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                            className={`${!restaurant.is_active &&
                              "restaurant-not-active"}`}
                          />
                        </LazyLoad>
                        <div
                          className="mt-5"
                          style={{
                            maxWidth: "36vw",
                            overflow: "hidden",
                            fontWeight: "bolder",
                          }}
                        >
                          {restaurant.name}
                        </div>
                        {!restaurant.is_active && (
                          <div className="restaurant-not-active-msg">
                            Not Accepting Any Orders
                          </div>
                        )}
                        <div
                          style={{
                            maxWidth: "110px",
                            overflow: "hidden",
                            color: "#7E7E7E",
                            fontSize: "10px",
                          }}
                        >
                          {restaurant.description}
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            justifyContent: "space-between",
                            color: "#7E7E7E",
                            fontSize: "9px",
                          }}
                        >
                          <div>
                            <Rater total={5} rating={restaurant.avgRating} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TimeCircle
                              style={{ marginRight: "1px" }}
                              size={10}
                            />
                            <span> {restaurant.delivery_time} mins</span>
                          </div>
                        </div>
                        {restaurant.featured_description && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className="mr-1">
                              <img
                                src="https://app.snakyz.com/assets/discount.png"
                                style={{ height: "1rem" }}
                              />
                            </div>
                            <div
                              style={{
                                maxWidth: "110px",
                                overflow: "hidden",
                                color: "#7E7E7E",
                                fontSize: "10px",
                              }}
                            >
                              {restaurant.featured_description}
                            </div>
                          </div>
                        )}
                        <Ink duration="500" hasTouch={true} />
                      </NavLink>
                    </div>
                  ))}
                </div> */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <img
                  src={`${WEBSITE_URL}/assets/34799-restaurant-locations.gif`}
                  style={{
                    width: "50vw",
                    marginLeft: "25vw",
                    opacity: "0.5",
                    marginTop: "10vh",
                    marginBottom: "2vh",
                  }}
                />
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "5vh",
                    opacity: "0.5",
                    textAlign: "center",
                  }}
                >
                  We are Not Operational at this Location
                </div>
              </React.Fragment>
            )}

            {/* {promo_slides && promo_slides.categories && (
              <NavLink
                to={"/category-stores/" + 1}
                style={{ position: "relative" }}
              >
                <div className="view-more text-center ml-15 mr-15 mb-100 pt-10 pb-10">
                  View More Restaurants
                </div>
                <Ink duration="500" hasTouch={true} />
              </NavLink>
            )} */}
            <div style={{height:'100px'}}/>
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

export default connect(mapStateToProps, {
  getPromoSlides,
  resetInfo,
  resetItems,
  resetBackup,
})(Home);
