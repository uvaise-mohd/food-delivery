import React, { Component } from 'react';
import { WEBSITE_URL } from "../../../../configs/website";
import DelayLink from "../../../helpers/delayLink";

class StoreCategories extends Component {

    render() {
        const {promo_slides} = this.props
        return (
            <React.Fragment>
            <div
              className="mt-20 ml-10"
              style={{
                display: "flex",
                overflowX: "auto",
              }}
            >
              {promo_slides.categories.map((category) => (
                <DelayLink
                  to={"/category-stores/" + category.id}
                  key={category.id}
                >
                  <div style={{ textAlign: "-webkit-center" }}>
                    <div className="d-flex align-items-center justify-content-center category-block">
                      <img
                        style={{
                          height: "65px",
                          width: "65px",
                          objectFit: "cover",
                          borderRadius: "100px",
                        }}
                        src={WEBSITE_URL + category.image}
                        alt="name"
                      />
                    </div>
                    <div
                      className="mt-1"
                      style={{ fontSize: "13px", fontWeight: "400" }}
                    >
                      {category.name}
                    </div>
                  </div>
                </DelayLink>
              ))}
            </div>
          </React.Fragment>
        );
    }
}

export default StoreCategories;