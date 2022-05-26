import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import LazyLoad from "react-lazyload";
import Ink from "react-ink";
import { WEBSITE_URL } from "../../../../configs/website";
import Truncate from "react-truncate";

class SuggestedItems extends Component {
  render() {
    const { promo_slides } = this.props;

    return (
      <div className="" >
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="ml-10"
            style={{ fontSize: "1.2em", fontWeight: "600" }}
          >
            Suggestions For You
          </div>
        </div>
        <div
          className="d-flex mt-10"
          style={{
            display: "flex",
            overflowX: "auto",
          }}
        >
          {promo_slides.suggested_items.map((item) => (
            <div className="popular-store-block p-10 d-flex flex-column justify-content-center align-items-center">
              <NavLink
                to={"stores/" + item.slug}
                key={item.id}
                style={{ position: "relative" }}
              >
                <div>
                  <LazyLoad>
                    <img
                      src={WEBSITE_URL + "/assets/img/items/" + item.image}
                      placeholder={
                        "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"
                      }
                      // alt={item.name}
                      style={{
                        height: "120px",
                        width: "120px",
                        borderRadius: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </LazyLoad>
                </div>
                <div
                  className="mt-1"
                  style={{
                    overflow: "hidden",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    color: "#757D85",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  {item.description}
                </div>
                <div className="mt-10 trending-item-price text-center">
                  <div className="mr-5" style={{}}>
                    <span className="rupees-symbol">AED </span>
                    {item.price}
                  </div>
                </div>
                <Ink duration="500" hasTouch={true} />
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default SuggestedItems;
