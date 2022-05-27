import React, { Component } from "react";
import {
  addProduct,
  removeProduct,
} from "../../../../../services/cart/actions";

import Customization from "../../Customization";
import Fade from "react-reveal/Fade";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";
import { WEBSITE_URL } from "../../../../../configs/website";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Star } from "react-iconly";

class RecommendedItems extends Component {
  static contextTypes = {
    router: () => null,
  };

  forceStateUpdate = () => {
    setTimeout(() => {
      this.forceUpdate();
      this.props.update();
    }, 100);
  };

  render() {
    const {
      addProduct,
      removeProduct,
      product,
      cartProducts,
      restaurant,
    } = this.props;
    product.quantity = 1;
    // console.log(product);
    return (
      <React.Fragment>
        <div key={product.id} className="product-slider-item bg-white ">
          <LazyLoad>
            <div style={{ position: "relative" }}>
              <Link to={restaurant.slug + "/" + product.id}>
                <img
                  src={WEBSITE_URL + "/assets/img/items/" + product.image}
                  alt={product.name}
                  className="recommended-item-image"
                />
                {localStorage.getItem("showVegNonVegBadge") === "true" &&
                  product.is_veg !== null && (
                    <React.Fragment>
                      {product.is_veg ? (
                        <img
                          src="https://kekadelivery.in/assets/img/various/veg.png"
                          alt="Veg"
                          style={{
                            width: "1rem",
                            position: "absolute",
                            left: "5px",
                            backgroundColor: "white",
                            borderRadius: "3px",
                            top: "3px",
                          }}
                          className="mr-1"
                        />
                      ) : (
                        <img
                          src="https://kekadelivery.in/assets/img/various/non-veg.png"
                          alt="Non-Veg"
                          style={{
                            width: "1rem",
                            position: "absolute",
                            left: "5px",
                            backgroundColor: "white",
                            borderRadius: "3px",
                            top: "3px",
                          }}
                          className="mr-1"
                        />
                      )}
                    </React.Fragment>
                  )}
              </Link>
            </div>
            <div className="">
              <div
                className="pt-3 mb-0 pb-0 text-center"
                style={{ width: "100%", fontSize: "16px" }}
              >
                <p
                  style={{
                    maxWidth: "170px",
                    textOverflow: "ellipsis",
                    overflowWrap: "break-word",
                    overflowX: "hidden",
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                  className="mb-0 pb-0 ml-2"
                >
                  {" "}
                  {product.name}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-center">
              <div
                className="d-flex"
                style={{ fontWeight: 400, color: "#6C727F", fontSize: "12px" }}
              >
                24min{" "}
              </div>
              &nbsp;&nbsp;
              <div
                className="d-flex"
                style={{ fontWeight: 900, color: "#6C727F" }}
              >
                .
              </div>
              &nbsp;&nbsp;
              <div className="d-flex">
                <div>
                  <Star
                    size="small"
                    set={"bold"}
                    style={{ marginLeft: "5px" }}
                    primaryColor={"#FF7A28"}
                  />
                </div>
                <div
                  className="ml-2"
                  style={{
                    fontWeight: 400,
                    color: "#6C727F",
                    fontSize: "12px",
                  }}
                >
                  4.1
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between ml-20 mr-20 ">
              <div className="text-center ">
                <div>
                  {product.addon_categories.length <= 0 ? (
                    <React.Fragment>
                      <div
                        className="d-flex align-items-center mr-5"
                        style={{ fontWeight: "600",fontSize:'14px' }}
                      >
                        <div>AED</div>
                        <div className="ml-2">{product.price}</div>
                      </div>

                      {/* {product.old_price > 0 ? (
                        <span
                          className=" text-right"
                          style={{
                            color: "red",
                            fontSize: "1em",
                            textDecorationLine: "line-through",
                            bottom: 0,
                          }}
                        >
                          {" "}
                          {localStorage.getItem("currencySymbolAlign") ===
                            "left" &&
                            localStorage.getItem("currencyFormat")}{" "}
                          {product.old_price}
                          {localStorage.getItem("currencySymbolAlign") ===
                            "right" && localStorage.getItem("currencyFormat")}
                        </span>
                      ) : null} */}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span
                        className="badge badge-success  badge-sm "
                        style={{
                          color: "#ffff",
                          backgroundColor: "green",
                          marginLeft: "1.5rem",
                          padddingTop: "-2rem",
                        }}
                      >
                        {localStorage.getItem("customizableItemText")}
                      </span>
                      <br />
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="mt-2 mb-2">
                {cartProducts.find((cp) => cp.id === product.id) !==
                  undefined && (
                  <React.Fragment>
                    <div className="item-actions text-center ">
                      <div
                        className="btn-group btn-group-sm   "
                        role="group"
                        aria-label="btnGroupIcons1"
                        style={{ borderRadius: "1rem" }}
                      >
                        <React.Fragment>
                          {product.addon_categories.length ? (
                            <button
                              disabled
                              type="button"
                              className="btn btn-add-remove"
                              style={{
                              }}
                            >
                              <div
                                className="btn-dec"
                                style={{ color: "#fff" }}
                              >
                                -{" "}
                              </div>
                              <Ink duration="500" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-add-remove"
                              style={{
                                borderRight: "none",
								backgroundColor:'#fe0000',
                              }}
                              onClick={() => {
                                product.quantity = 1;
                                removeProduct(product);
                                this.forceStateUpdate();
                              }}
                            >
                              <span class="btn-dec" style={{color:'#fff'}}>-</span>
                              <Ink duration="500" />
                            </button>
                          )}

                          <span
                            className="btn btn-quantity"
                            style={{
                              borderRight: "none",
                              borderLeft: "none",
                              backgroundColor: "#fff",
                            }}
                          >
                            <React.Fragment>
                              {
                                cartProducts.find((cp) => cp.id === product.id)
                                  .quantity
                              }
                            </React.Fragment>
                          </span>

                          {product.addon_categories.length ? (
                            <Customization
                              product={product}
                              addProduct={addProduct}
                              forceUpdate={this.forceStateUpdate}
                            />
                          ) : (
                            <button
                              type="button"
                              className="btn btn-add-remove"
                              style={{
								backgroundColor:'#fe0000',

                              }}
                              onClick={() => {
                                addProduct(product);
                                this.forceStateUpdate();
                              }}
                            >
                              <span className="btn-inc-cart" style={{color:'#fff'}}>+</span>
                              <Ink duration="500" />
                            </button>
                          )}
                        </React.Fragment>
                      </div>
                    </div>
                  </React.Fragment>
                )}

                {cartProducts.find((cp) => cp.id === product.id) ===
                  undefined && (
                  <React.Fragment>
                    <div className="item-actions text-center ">
                      {product.is_active ? (
                        <React.Fragment>
                          {product.addon_categories.length ? (
                            <Customization
                              product={product}
                              addProduct={addProduct}
                              forceUpdate={this.forceStateUpdate}
                            />
                          ) : (
                            <div
                              style={{
                                position: "relative",
                                backgroundColor: "#fe0000",
                                borderRadius: "10px",
                                border: "none",
                                color: "#fff",
                                fontWeight: "500",
                                height: "30px",
                                width: "30px",
                              }}
                              onClick={() => {
                                addProduct(product);
                                this.forceStateUpdate();
                              }}
                            >
                              <div
                                className=""
                                style={{ fontWeight: "400", fontSize: "20px" }}
                              >
                                +
                              </div>

                              <Ink duration="500" />
                            </div>
                          )}
                        </React.Fragment>
                      ) : (
                        <div className="text-danger text-item-not-available">
                          {localStorage.getItem("cartItemNotAvailable")}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </LazyLoad>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  cartProducts: state.cart.products,
});

export default connect(mapStateToProps, { addProduct, removeProduct })(
  RecommendedItems
);
