import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";

import Collapsible from "react-collapsible";
import ContentLoader from "react-content-loader";
import Customization from "../Customization";

import Ink from "react-ink";
import ItemBadge from "./ItemBadge";
import { Link } from "react-router-dom";

import RecommendedItems from "./RecommendedItems";
import ShowMore from "react-show-more";

import { connect } from "react-redux";
import { searchItem, clearSearch } from "../../../../services/items/actions";

import ProgressiveImage from "react-progressive-image";
import LazyLoad from "react-lazyload";
import { WEBSITE_URL } from "../../../../configs/website";
import { Star } from "react-iconly";

class ItemList extends Component {
  state = {
    update: true,
    items_backup: [],
    searching: false,
    data: [],
    filterText: null,
    filter_items: [],
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
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

  searchItem = (event) => {
    if (event.target.value.length > 0) {
      this.setState({ filterText: event.target.value });
      this.props.searchItem(
        this.state.filter_items,
        event.target.value,
        localStorage.getItem("itemSearchText"),
        localStorage.getItem("itemSearchNoResultText")
      );
      this.setState({ searching: true });
    }
    if (event.target.value.length === 0) {
      this.setState({ filterText: null });
      // console.log("Cleared");

      this.props.clearSearch(this.state.items_backup);
      this.setState({ searching: false });
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      if (state.filterText !== null) {
        return {
          data: props.data,
        };
      } else {
        return {
          items_backup: props.data,
          data: props.data,
          filter_items: props.data.items,
        };
      }
    }
    return null;
  }

  inputFocus = () => {
    this.refs.searchGroup.classList.add("search-shadow-light");
  };
  handleClickOutside = (event) => {
    if (
      this.refs.searchGroup &&
      !this.refs.searchGroup.contains(event.target)
    ) {
      this.refs.searchGroup.classList.remove("search-shadow-light");
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  render() {
    const { addProduct, removeProduct, cartProducts, restaurant } = this.props;
    const { data } = this.state;
    return (
      <React.Fragment>
        <div
          className={`bg-grey-light mt-10 pt-5  ${
            restaurant && !restaurant.certificate ? "mb-100" : null
          }`}>
          {!this.state.searching && (
            <div className='px-5'>
              {!data.recommended ? (
                <ContentLoader
                  height={480}
                  width={400}
                  speed={1.2}
                  primaryColor='#f3f3f3'
                  secondaryColor='#ecebeb'>
                  <rect x='10' y='22' rx='4' ry='4' width='185' height='137' />
                  <rect x='10' y='168' rx='0' ry='0' width='119' height='18' />
                  <rect x='10' y='193' rx='0' ry='0' width='79' height='18' />

                  <rect x='212' y='22' rx='4' ry='4' width='185' height='137' />
                  <rect x='212' y='168' rx='0' ry='0' width='119' height='18' />
                  <rect x='212' y='193' rx='0' ry='0' width='79' height='18' />

                  <rect x='10' y='272' rx='4' ry='4' width='185' height='137' />
                  <rect x='10' y='418' rx='0' ry='0' width='119' height='18' />
                  <rect x='10' y='443' rx='0' ry='0' width='79' height='18' />

                  <rect
                    x='212'
                    y='272'
                    rx='4'
                    ry='4'
                    width='185'
                    height='137'
                  />
                  <rect x='212' y='418' rx='0' ry='0' width='119' height='18' />
                  <rect x='212' y='443' rx='0' ry='0' width='79' height='18' />
                </ContentLoader>
              ) : null}
              {data.recommended && data.recommended.length > 0 && (
                <div className='d-flex align-items-center justify-content-between'>
                  <div
                    className='ml-10'
                    style={{ fontSize: "1.2em", fontWeight: "600" }}>
                    Recommended Items
                  </div>
                </div>
              )}

              <div
                style={{
                  overflowX: "scroll",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                  MsOverflowStyle: "none",
                  overflow: "-moz-scrollbars-none",
                  scrollBehavior: "smooth",
                  marginTop: "10px",
                }}>
                {!data.recommended
                  ? null
                  : data.recommended.map((item) => (
                      <RecommendedItems
                        restaurant={restaurant}
                        shouldUpdate={this.state.update}
                        update={this.forceStateUpdate}
                        product={item}
                        addProduct={addProduct}
                        removeProduct={removeProduct}
                        key={item.id}
                      />
                    ))}
              </div>
            </div>
          )}
          {data.items &&
            Object.keys(data.items).map((category, index) => (
              <div key={category} id={category + index}>
                {/* <Collapsible trigger={category} open={true}> */}
                <Collapsible
                  trigger={category}
                  open={
                    index === 0
                      ? true
                      : localStorage.getItem("expandAllItemMenu") === "true"
                      ? true
                      : this.props.menuClicked
                  }>
                  {data.items[category].map((item) => (
                    <React.Fragment key={item.id}>
                      <span className='hidden'>{(item.quantity = 1)}</span>
                      <div
                        className='category-list-item'
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          position: "relative",
                        }}>
                        <div
                          className={
                            item.image !== ""
                              ? "flex-item-name ml-3"
                              : "flex-item-name ml-3 ml-0"
                          }>
                          <div>
                            {localStorage.getItem("showVegNonVegBadge") ===
                              "true" &&
                              item.is_veg !== null && (
                                <React.Fragment>
                                  {item.is_veg ? (
                                    <img
                                      src='https://kekadelivery.in/assets/img/various/veg.png'
                                      alt='Veg'
                                      style={{
                                        width: "1rem",
                                        backgroundColor: "white",
                                        borderRadius: "3px",
                                      }}
                                      className='mr-1'
                                    />
                                  ) : (
                                    <img
                                      src='https://kekadelivery.in/assets/img/various/non-veg.png'
                                      alt='Non-Veg'
                                      style={{
                                        width: "1rem",
                                        backgroundColor: "white",
                                        borderRadius: "3px",
                                      }}
                                      className='mr-1'
                                    />
                                  )}
                                </React.Fragment>
                              )}
                            <span>
                              <Star
                                size='small'
                                set={"bold"}
                                style={{
                                  marginLeft: "2px",
                                  marginBottom: "-5px",
                                }}
                                primaryColor={"#F8C246"}
                              />
                            </span>
                          </div>
                          <span
                            className='item-name '
                            style={{ fontSize: "14px" }}>
                            {item.name}
                          </span>{" "}
                          {item.description !== null ? (
                            <React.Fragment>
                              <br />

                              <div
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  color: "#777777",
                                }}>
                                {item.description}
                              </div>
                            </React.Fragment>
                          ) : (
                            <br />
                          )}
                          <span
                            className='item-price '
                            style={{
                              fontStyle: "normal",
                              fontWeight: "400",
                              fontSize: "16px",
                              lineHeight: "24px",
                              textAlign: "center",
                              color: "#000000",
                            }}>
                            {localStorage.getItem("hidePriceWhenZero") ===
                              "true" && item.price === "0.00" ? null : (
                              <React.Fragment>
                                {item.old_price > 0 && (
                                  <span className='strike-text mr-1'>
                                    AED {item.old_price}
                                  </span>
                                )}

                                <span>AED {item.price}</span>

                                {item.old_price > 0 &&
                                localStorage.getItem(
                                  "showPercentageDiscount"
                                ) === "true" ? (
                                  <React.Fragment>
                                    <p
                                      className='price-percentage-discount mb-0'
                                      style={{
                                        color: localStorage.getItem(
                                          "cartColorBg"
                                        ),
                                      }}>
                                      {parseFloat(
                                        ((parseFloat(item.old_price) -
                                          parseFloat(item.price)) /
                                          parseFloat(item.old_price)) *
                                          100
                                      ).toFixed(0)}
                                      {localStorage.getItem(
                                        "itemPercentageDiscountText"
                                      )}
                                    </p>
                                  </React.Fragment>
                                ) : (
                                  <br />
                                )}
                              </React.Fragment>
                            )}
                            {item.addon_categories.length > 0 && (
                              <React.Fragment>
                                <span
                                  className=' badge badge-warning customizable-item-text mb-1'
                                  style={{
                                    color: "#ffff",
                                  }}>
                                  {localStorage.getItem("customizableItemText")}
                                </span>
                                <br />
                              </React.Fragment>
                            )}
                          </span>
                          {/* <ItemBadge item={item} /> */}
                        </div>

                        {item.image !== "" && (
                          <React.Fragment>
                            <Link to={restaurant.slug + "/" + item.id}>
                              <React.Fragment>
                                <LazyLoad>
                                  <ProgressiveImage
                                    src={
                                      WEBSITE_URL +
                                      "/assets/img/items/" +
                                      item.image
                                    }
                                    placeholder='/assets/img/various/blank-white.jpg'>
                                    {(src, loading) => (
                                      <>
                                        <img
                                          style={{
                                            opacity: loading ? "0.5" : "1",
                                            width: "120px",
                                            height: "100px",
                                          }}
                                          src={src}
                                          alt={item.name}
                                          className='flex-item-image '
                                        />
                                      </>
                                    )}
                                  </ProgressiveImage>
                                </LazyLoad>
                              </React.Fragment>
                            </Link>
                          </React.Fragment>
                        )}

                        <div
                          className='d-flex'
                          style={{
                            position: "absolute",
                            right: "0%",
                            bottom: "14%",
                            width: "33%",
                            justifyContent: "center",
                          }}>
                          {cartProducts.find((cp) => cp.id === item.id) !==
                            undefined && (
                            <React.Fragment>
                              <div className=' item-actions text-center'>
                                <div
                                  className='btn-group btn-group-sm'
                                  role='group'
                                  aria-label='btnGroupIcons1'
                                  style={{ borderRadius: "0.5rem" }}>
                                  {item.is_active ? (
                                    <React.Fragment>
                                      {item.addon_categories.length ? (
                                        <button
                                          disabled
                                          type='button'
                                          className='btn btn-add-remove'
                                          style={{
                                            color: localStorage.getItem(
                                              "cartColor-bg"
                                            ),
                                            width: "30px",
                                          }}>
                                          <div
                                            className='btn-dec  pb-2'
                                            style={{ color: "#00000" }}>
                                            -
                                          </div>
                                          <Ink duration='500' />
                                        </button>
                                      ) : (
                                        <button
                                          type='button'
                                          className='btn btn-add-remove'
                                          style={{
                                            color: "white",
                                            borderRight: "none",
                                            width: "30px",
                                            backgroundColor: "#fe0000",
                                          }}
                                          onClick={() => {
                                            item.quantity = 1;
                                            removeProduct(item);
                                            this.forceStateUpdate();
                                          }}>
                                          <span class='btn-dec'>-</span>
                                          <Ink duration='500' />
                                        </button>
                                      )}

                                      <span
                                        className='pt-2 pl-2 pr-2 btn '
                                        style={{
                                          borderRight: "none",
                                          borderLeft: "none",
                                          backgroundColor: "#F4F2FF",
                                        }}>
                                        <React.Fragment>
                                          {
                                            cartProducts.find(
                                              (cp) => cp.id === item.id
                                            ).quantity
                                          }
                                        </React.Fragment>
                                      </span>

                                      {item.addon_categories.length ? (
                                        <Customization
                                          product={item}
                                          addProduct={addProduct}
                                          forceUpdate={this.forceStateUpdate}
                                        />
                                      ) : (
                                        <button
                                          type='button'
                                          className='btn btn-add-remove robo'
                                          style={{
                                            color: "white",
                                            width: "30px",
                                            backgroundColor: "#fe0000",
                                          }}
                                          onClick={() => {
                                            addProduct(item);
                                            this.forceStateUpdate();
                                          }}>
                                          <span
                                            className='robo'
                                            style={{
                                              fontSize: "1.2rem",
                                              lineHeight: "14px",
                                              color: "white",
                                              fontWeight: "500",
                                            }}>
                                            +
                                          </span>
                                          <Ink duration='500' />
                                        </button>
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    <div className='robo text-danger text-item-not-available'>
                                      {localStorage.getItem(
                                        "cartItemNotAvailable"
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </React.Fragment>
                          )}

                          {cartProducts.find((cp) => cp.id === item.id) ===
                            undefined && (
                            <React.Fragment>
                              <div className='item-actions pull-right'>
                                {item.is_active ? (
                                  <React.Fragment>
                                    {item.addon_categories.length ? (
                                      <Customization
                                        product={item}
                                        addProduct={addProduct}
                                        forceUpdate={this.forceStateUpdate}
                                      />
                                    ) : (
                                      <button
                                        type='button'
                                        className='robo btn btn-success'
                                        style={{
                                          position: "relative",
                                          backgroundColor: "rgb(254, 0, 0)",
                                          borderRadius: "13px",
                                          borderColor: "rgb(254, 0, 0)",
                                          color: "white",
                                          width: "40px",
                                          fontWeight: "200",
                                          fontSize: "20px",
                                        }}
                                        onClick={() => {
                                          addProduct(item);
                                          this.forceStateUpdate();
                                        }}>
                                        <span
                                          style={{
                                            position: "relative",
                                            left: "-15%",
                                          }}>
                                          +
                                        </span>
                                        {/* <Ink duration='500' /> */}
                                      </button>
                                    )}
                                  </React.Fragment>
                                ) : (
                                  <div className='robo text-danger text-item-not-available'>
                                    {localStorage.getItem(
                                      "cartItemNotAvailable"
                                    )}
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </Collapsible>
              </div>
            ))}
          <div className='mb-50' />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  cartProducts: state.cart.products,
});

export default connect(mapStateToProps, {
  addProduct,
  removeProduct,
  searchItem,
  clearSearch,
})(ItemList);
