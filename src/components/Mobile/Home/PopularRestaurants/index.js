import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import LazyLoad from "react-lazyload";
import Ink from "react-ink";
import { WEBSITE_URL } from "../../../../configs/website";
class PopularRestaurants extends Component {

    render() {
        const {promo_slides} = this.props

        return (
            <div style={{ marginTop: "30px" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div
                      className="ml-10"
                      style={{ fontSize: "1.2em", fontWeight: "600" }}
                    >
                      Popular Restaurants Near You
                    </div>
                    <div
                      className="mr-10"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#FF6C44",
                      }}
                    >
                      Show All
                    </div>
                  </div>
                  <div
                    className="d-flex mt-20 ml-10"
                    style={{
                      display: "flex",
                      overflowX: "auto",
                    }}
                  >
                    {promo_slides.featuresStores.map((restaurant) => (
                      <div className="popular-store-block p-10 d-flex flex-column justify-content-center align-items-center">
                        <NavLink
                          to={"stores/" + restaurant.slug}
                          key={restaurant.id}
                          style={{ position: "relative" }}
                        >
                          <div>
                            <LazyLoad>
                              <img
                                src={WEBSITE_URL + restaurant.image}
                                placeholder={
                                  "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"
                                }
                                // alt={restaurant.name}
                                style={{
                                  height: "120px",
                                  width: "120px",
                                  borderRadius: "100%",
                                  objectFit: "cover",
                                }}
                                className={`${!restaurant.is_active &&
                                  "restaurant-not-active"}`}
                              />
                            </LazyLoad>
                          </div>
                          <div
                            className="mt-5"
                            style={{
                              overflow: "hidden",
                              fontWeight: "600",
                              textAlign: "center",
                            }}
                          >
                            {restaurant.name}
                          </div>
                          {!restaurant.is_active && (
                            <div className="restaurant-not-active-msg text-center">
                              Store Closed
                            </div>
                          )}

                          {restaurant.featured_description ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {/* <div className="mr-1">
                                <img
                                  src="https://app.snakyz.com/assets/discount.png"
                                  style={{ height: "1rem" }}
                                />
                              </div> */}
                              <div
                                style={{
                                  overflow: "hidden",
                                  color: "#757D85",
                                  fontSize: "10px",
                                }}
                              >
                                {restaurant.featured_description}
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                overflow: "hidden",
                                color: "#757D85",
                                fontSize: "10px",
                              }}
                            >
                              {restaurant.description}
                            </div>
                          )}
                          <Ink duration="500" hasTouch={true} />
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </div>
        );
    }
}

export default PopularRestaurants;