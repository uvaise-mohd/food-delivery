import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";
import {
  getRestaurantInfo,
  getRestaurantItems,
  getSingleItem,
  resetInfo,
  resetItems,
} from "../../../../services/items/actions";
import { ChevronLeft } from "react-iconly";

import Customization from "../Customization";
import Fade from "react-reveal/Fade";
import FloatCart from "../../FloatCart";
import Ink from "react-ink";
import ItemBadge from "../ItemList/ItemBadge";
import LazyLoad from "react-lazyload";

import { Redirect } from "react-router";
import RestaurantInfo from "../RestaurantInfo";

import { connect } from "react-redux";
import ContentLoader from "react-content-loader";

import { getSettings } from "../../../../services/settings/actions";

import {
  getAllLanguages,
  getSingleLanguageData,
} from "../../../../services/languages/actions";
import Background from "./Background";
class SingleItem extends Component {
  static contextTypes = {
    router: () => null,
  };
  state = {
    update: true,
    is_active: 1,
    loading: true,
    item_loading: true,
  };
  forceStateUpdate = () => {
    setTimeout(() => {
      this.forceUpdate();
      if (this.state.update) {
        this.setState({ update: false });
      } else {
        this.setState({ update: true });
      }
    }, 100);
  };

  componentDidMount() {
    this.props.getSettings();
    this.props.getAllLanguages();

    this.props.getRestaurantInfo(this.props.restaurant);

    this.props.getSingleItem(this.props.itemId).then((response) => {
      if (response) {
        // console.log(response.payload.id)
        if (response.payload.id) {
          this.setState({ item_loading: false });
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.restaurant_info.is_active === "undefined") {
      this.setState({ loading: true });
    }
    if (
      nextProps.restaurant_info.is_active === 1 ||
      nextProps.restaurant_info.is_active === 0
    ) {
      this.setState({ loading: false });
      this.setState({ is_active: nextProps.restaurant_info.is_active });
    }
    if (!this.state.is_active) {
      document.getElementsByTagName("html")[0].classList.add("page-inactive");
    }

    if (this.props.languages !== nextProps.languages) {
      if (localStorage.getItem("userPreferedLanguage")) {
        this.props.getSingleLanguageData(
          localStorage.getItem("userPreferedLanguage")
        );
      } else {
        if (nextProps.languages.length) {
          // console.log("Fetching Translation Data...");
          const id = nextProps.languages.filter(
            (lang) => lang.is_default === 1
          )[0].id;
          this.props.getSingleLanguageData(id);
        }
      }
    }
  }

  componentWillUnmount() {
    document.getElementsByTagName("html")[0].classList.remove("page-inactive");
  }

  render() {
    if (window.innerWidth > 1024) {
      return <Redirect to='/' />;
    }
    const { addProduct, removeProduct, cartProducts, single_item } = this.props;

    const product = single_item;

    return (
      <div className='bg-white'>
        {this.props.restaurant_info && (
          <React.Fragment>
            <Background />
            <div
              className='d-flex align-items-center justify-content-center p-2'
              style={{
                border: "1px solid #BBBDC1",
                borderRadius: "8px",
                minHeight: "40px",
                minWidth: "40px",
                position: "absolute",
                top: "15px",
                left: "15px",
              }}
              onClick={() => this.context.router.history.goBack()}>
              <ChevronLeft primaryColor='#BBBDC1' />
            </div>
            <div
              className='text-center pt-15'
              style={{
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "40px",
                textAlign: "center",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#111A2C",
              }}>
              Details
            </div>
            {single_item && single_item.id && (
              <div className='single-item px-15  pb-100'>
                <span className='hidden'>{(single_item.quantity = 1)}</span>
                <div
                  className='category-list-item single-item-img'
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  {this.state.item_loading ? (
                    <ContentLoader
                      height={400}
                      width={window.innerWidth}
                      speed={1.2}
                      primaryColor='#f3f3f3'
                      secondaryColor='#ecebeb'>
                      <rect
                        x='0'
                        y='0'
                        rx='4'
                        ry='4'
                        width={window.innerWidth}
                        height='290'
                      />
                      <rect
                        x='0'
                        y='300'
                        rx='0'
                        ry='0'
                        width='115'
                        height='20'
                      />
                      <rect
                        x='0'
                        y='325'
                        rx='0'
                        ry='0'
                        width='75'
                        height='16'
                      />

                      <rect
                        x={window.innerWidth - 100}
                        y='300'
                        rx='4'
                        ry='4'
                        width='115'
                        height='35'
                      />
                      <rect
                        x={window.innerWidth - 50}
                        y='300'
                        rx='4'
                        ry='4'
                        width='115'
                        height='35'
                      />
                    </ContentLoader>
                  ) : (
                    <React.Fragment>
                      {single_item.image !== "" && (
                        <LazyLoad>
                          <img
                            className='single-item-image'
                            src={
                              "https://app.snakyz.com/assets/img/items/" +
                              single_item.image
                            }
                            alt={single_item.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              padding: "6%",
                            }}
                          />

                          {localStorage.getItem("showVegNonVegBadge") ===
                            "true" &&
                            single_item.is_veg !== null && (
                              <React.Fragment>
                                {single_item.is_veg ? (
                                  <img
                                    src={
                                      "https://app.snakyz.com/assets/img/various/veg.png"
                                    }
                                    alt='veg'
                                    style={{ width: "1rem" }}
                                    className='item-veg'
                                  />
                                ) : (
                                  <img
                                    src={
                                      "https://app.snakyz.com/assets/img/various/non-veg.png"
                                    }
                                    alt='non-veg'
                                    style={{ width: "1rem" }}
                                    className='item-nonVeg'
                                  />
                                )}
                              </React.Fragment>
                            )}

                          {/* <React.Fragment>
                            {cartProducts.find(
                              (cp) => cp.id === single_item.id
                            ) !== undefined && (
                              <Fade duration={150}>
                                <div
                                  className='quantity-badge-list'
                                  style={{
                                    backgroundColor: "#fc8019",
                                  }}>
                                  <span>
                                    {single_item.addon_categories.length ? (
                                      <React.Fragment>
                                        <i
                                          className='si si-check'
                                          style={{
                                            lineHeight: "1.3rem",
                                          }}
                                        />
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {
                                          cartProducts.find(
                                            (cp) => cp.id === single_item.id
                                          ).quantity
                                        }
                                      </React.Fragment>
                                    )}
                                  </span>
                                </div>
                              </Fade>
                            )}
                          </React.Fragment> */}
                        </LazyLoad>
                      )}
                      <div className='single-item-meta d-flex justify-content-between align-items-center'>
                        <div
                          className='item-name  font-w500 mt-2'
                          style={{
                            fontFamily: "'Poppins'",
                            fontStyle: "normal",
                            fontWeight: "500",
                            fontSize: "18px",
                            lineHeight: "36px",
                          }}>
                          {single_item.name}
                        </div>
                        <div
                          className='item-price'
                          style={{
                            fontFamily: "Poppins",
                            fontStyle: "normal",
                            fontWeight: "500",
                            fontSize: "18px",
                            lineHeight: "36px",
                          }}>
                          {localStorage.getItem("hidePriceWhenZero") ===
                            "true" && single_item.price === "0.00" ? null : (
                            <React.Fragment>
                              {single_item.old_price > 0 && (
                                <span className='strike-text mr-1'>
                                  AED {single_item.old_price}
                                </span>
                              )}

                              <span className='price-text font-size-lg ml-2'>
                                AED {single_item.price}
                              </span>

                              {single_item.old_price > 0 &&
                                localStorage.getItem(
                                  "showPercentageDiscount"
                                ) === "true" && (
                                  <React.Fragment>
                                    <br></br>
                                    <span
                                      className='badge badge-danger price-percentage-discount mb-0 ml-2'
                                      style={{
                                        color: "white",
                                      }}>
                                      {parseFloat(
                                        ((parseFloat(single_item.old_price) -
                                          parseFloat(single_item.price)) /
                                          parseFloat(single_item.old_price)) *
                                          100
                                      ).toFixed(0)}
                                      {localStorage.getItem(
                                        "itemPercentageDiscountText"
                                      )}
                                    </span>
                                  </React.Fragment>
                                )}
                            </React.Fragment>
                          )}

                          {/* {single_item.addon_categories.length > 0 && (
                            <span
                              className='ml-1 badge badge-warning customizable-item-text'
                              style={{
                                color: "white",
                              }}>
                              Customizable
                            </span>
                          )} */}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "Poppins",
                          fontStyle: "normal",
                          fontWeight: "400",
                          fontSize: "16px",
                          lineHeight: "18px",
                          color: "#525C67",
                          marginTop: "10px",
                        }}>
                        {single_item.description}
                      </div>

                      <div
                        className='mt-4 mb-3 d-flex'
                        style={{ justifyContent: "flex-end" }}>
                        {cartProducts.find((cp) => cp.id === product.id) !==
                          undefined && (
                          <React.Fragment>
                            <div className='item-actions text-center '>
                              <div
                                className='btn-group btn-group-sm   '
                                role='group'
                                aria-label='btnGroupIcons1'
                                style={{
                                  borderRadius: "8px",
                                  height: "15vw",
                                  width: "33vw",
                                  backgroundColor: "rgb(245, 245, 248)",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}>
                                <React.Fragment>
                                  {product.addon_categories.length ? (
                                    <button
                                      disabled
                                      type='button'
                                      className='btn btn-add-remove'
                                      style={{}}>
                                      <div
                                        className='btn-dec'
                                        style={{ color: "#fff" }}>
                                        -{" "}
                                      </div>
                                      {/* <Ink duration='500' /> */}
                                    </button>
                                  ) : (
                                    <button
                                      type='button'
                                      className='btn btn-add-remove'
                                      style={{
                                        borderRight: "none",
                                        backgroundColor: "#f0f8ff00",
                                      }}
                                      onClick={() => {
                                        product.quantity = 1;
                                        removeProduct(product);
                                        this.forceStateUpdate();
                                      }}>
                                      <span
                                        class='btn-dec'
                                        style={{
                                          fontWeight: "300",

                                          fontSize: "35px",
                                          color: "#898B9A",
                                        }}>
                                        -
                                      </span>
                                      {/* <Ink duration='500' /> */}
                                    </button>
                                  )}

                                  <span
                                    className='btn '
                                    style={{
                                      borderRight: "none",
                                      borderLeft: "none",
                                      backgroundColor: "rgb(255 255 255 / 0%)",
                                      fontSize: "16px",
                                    }}>
                                    <React.Fragment>
                                      {
                                        cartProducts.find(
                                          (cp) => cp.id === product.id
                                        ).quantity
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
                                      type='button'
                                      className='btn '
                                      style={{
                                        backgroundColor: "#f0f8ff00",
                                      }}
                                      onClick={() => {
                                        addProduct(product);
                                        this.forceStateUpdate();
                                      }}>
                                      <span
                                        className='btn-inc-cart'
                                        style={{
                                          fontWeight: "300",
                                          fontSize: "30px",
                                          color: "red",
                                        }}>
                                        +
                                      </span>
                                      {/* <Ink duration='500' /> */}
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
                            <div
                              className='item-actions text-center'
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                              }}>
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
                                        backgroundColor: "rgb(254, 0, 0)",
                                        borderRadius: "10px",
                                        border: "none",
                                        color: "rgb(255, 255, 255)",
                                        fontWeight: "500",
                                        height: "15vw",
                                        fontSize: "10px",
                                        display: "flex",
                                        width: "85%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                      onClick={() => {
                                        addProduct(product);
                                        this.forceStateUpdate();
                                      }}>
                                      <div
                                        className=''
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "15px",
                                        }}>
                                        Add to Cart +
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              ) : (
                                <div className='text-danger text-item-not-available'>
                                  {localStorage.getItem("cartItemNotAvailable")}
                                </div>
                              )}
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            )}
            {!this.state.loading && (
              <React.Fragment>
                {this.state.is_active ? (
                  <FloatCart />
                ) : (
                  <div className='auth-error no-click'>
                    <div className='error-shake'>
                      {localStorage.getItem("notAcceptingOrdersMsg")}
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  restaurant_info: state.items.restaurant_info,
  cartProducts: state.cart.products,
  single_item: state.items.single_item,
  settings: state.settings.settings,
  languages: state.languages.languages,
  language: state.languages.language,
});

export default connect(mapStateToProps, {
  getRestaurantInfo,
  getRestaurantItems,
  resetItems,
  resetInfo,
  getSingleItem,
  addProduct,
  removeProduct,
  getSettings,
  getAllLanguages,
  getSingleLanguageData,
})(SingleItem);
