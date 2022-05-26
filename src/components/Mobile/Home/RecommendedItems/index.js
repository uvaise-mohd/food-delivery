import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import LazyLoad from "react-lazyload";
import Ink from "react-ink";
import { WEBSITE_URL } from "../../../../configs/website";
import Truncate from "react-truncate";

class RecommendedItems extends Component {
  render() {
    const { promo_slides } = this.props;

    return (
      <div className="" style={{ marginTop: "30px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="ml-10"
            style={{ fontSize: "1.2em", fontWeight: "600" }}
          >
            Recommended Items
          </div>
          <div
            className="mr-10"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#FE0000",
            }}
          >
            Show all
          </div>
        </div>
        <div className="x-scroll">
          {promo_slides.items.map((item) => (
            <div className="trending-item mt-20 ml-10 mb-5 mr-5 d-flex align-items-center pl-5">
              <div>
                <NavLink
                  to={"stores/" + item.store_slug + "/" + item.id}
                  key={item.id}
                  style={{ position: "relative" }}
                >
                  <LazyLoad>
                    <img
                      className="trending-item-img"
                      src={WEBSITE_URL + "/assets/img/items/" + item.image}
                      alt={item.name}
                    />
                  </LazyLoad>
                  <Ink duration="500" hasTouch={true} />
                </NavLink>
              </div>
              <div className="ml-10">
                <div className="trending-item-name">
                  <Truncate lines={1} ellipsis={<span>...</span>}>
                    {item.name}
                  </Truncate>
                </div>

                <div className="mt-5 trending-item-desc ">
                  <Truncate lines={1} ellipsis={<span>...</span>}>
                    {item.description}
                  </Truncate>
                </div>
                <div className="mt-10 trending-item-price">
                  <div className="mr-5" style={{}}>
                    <span className="rupees-symbol">AED </span>
                    {item.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RecommendedItems;
