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
                <Collapsible trigger={category} open={true}>
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
                            {item.is_suggested ? (
                              <span>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='69'
                                  height='10'
                                  fill='none'
                                  viewBox='0 0 69 10'>
                                  <path
                                    fill='#F8C246'
                                    d='M16.364 4.716c.448.08.828.316 1.14.708.312.392.468.836.468 1.332 0 .424-.112.808-.336 1.152-.216.336-.532.604-.948.804-.416.192-.9.288-1.452.288H11.9V.66h3.18c.568 0 1.056.096 1.464.288.408.192.716.452.924.78.208.32.312.68.312 1.08 0 .48-.128.88-.384 1.2-.256.32-.6.556-1.032.708Zm-3.096-.552h1.692c.448 0 .796-.1 1.044-.3.256-.208.384-.504.384-.888 0-.376-.128-.668-.384-.876-.248-.216-.596-.324-1.044-.324h-1.692v2.388Zm1.848 3.72c.464 0 .828-.112 1.092-.336.264-.224.396-.536.396-.936 0-.408-.14-.732-.42-.972-.28-.24-.652-.36-1.116-.36h-1.8v2.604h1.848Zm10.403-2.352c0 .248-.016.472-.048.672h-5.052c.04.528.236.952.588 1.272.352.32.784.48 1.296.48.736 0 1.256-.308 1.56-.924h1.476a2.998 2.998 0 0 1-1.092 1.5c-.52.384-1.168.576-1.944.576-.632 0-1.2-.14-1.704-.42a3.139 3.139 0 0 1-1.176-1.2c-.28-.52-.42-1.12-.42-1.8 0-.68.136-1.276.408-1.788.28-.52.668-.92 1.164-1.2.504-.28 1.08-.42 1.728-.42.624 0 1.18.136 1.668.408.488.272.868.656 1.14 1.152.272.488.408 1.052.408 1.692ZM24.09 5.1c-.008-.504-.188-.908-.54-1.212-.352-.304-.788-.456-1.308-.456-.472 0-.876.152-1.212.456-.336.296-.536.7-.6 1.212h3.66Zm5.175 4.008c-.52 0-.988-.092-1.404-.276a2.536 2.536 0 0 1-.972-.768 1.943 1.943 0 0 1-.384-1.092h1.416a.99.99 0 0 0 .396.708c.248.184.556.276.924.276.384 0 .68-.072.888-.216.216-.152.324-.344.324-.576 0-.248-.12-.432-.36-.552-.232-.12-.604-.252-1.116-.396a10.83 10.83 0 0 1-1.212-.396 2.176 2.176 0 0 1-.816-.588c-.224-.264-.336-.612-.336-1.044 0-.352.104-.672.312-.96.208-.296.504-.528.888-.696.392-.168.84-.252 1.344-.252.752 0 1.356.192 1.812.576.464.376.712.892.744 1.548h-1.368a.974.974 0 0 0-.36-.708c-.216-.176-.508-.264-.876-.264-.36 0-.636.068-.828.204a.632.632 0 0 0-.288.54c0 .176.064.324.192.444s.284.216.468.288c.184.064.456.148.816.252.48.128.872.26 1.176.396.312.128.58.32.804.576.224.256.34.596.348 1.02 0 .376-.104.712-.312 1.008-.208.296-.504.528-.888.696-.376.168-.82.252-1.332.252Zm5.606-5.604v3.66c0 .248.056.428.168.54.12.104.32.156.6.156h.84V9h-1.08c-.616 0-1.088-.144-1.416-.432-.328-.288-.492-.756-.492-1.404v-3.66h-.78V2.388h.78V.744h1.38v1.644h1.608v1.116h-1.608Zm5.269 5.604c-.52 0-.988-.092-1.404-.276a2.536 2.536 0 0 1-.972-.768 1.943 1.943 0 0 1-.384-1.092h1.416a.99.99 0 0 0 .396.708c.248.184.556.276.924.276.384 0 .68-.072.888-.216.216-.152.324-.344.324-.576 0-.248-.12-.432-.36-.552-.232-.12-.604-.252-1.116-.396a10.83 10.83 0 0 1-1.212-.396 2.176 2.176 0 0 1-.816-.588c-.224-.264-.336-.612-.336-1.044 0-.352.104-.672.312-.96.208-.296.504-.528.888-.696.392-.168.84-.252 1.344-.252.752 0 1.356.192 1.812.576.464.376.712.892.744 1.548H41.22a.974.974 0 0 0-.36-.708c-.216-.176-.508-.264-.876-.264-.36 0-.636.068-.828.204a.632.632 0 0 0-.288.54c0 .176.064.324.192.444s.284.216.468.288c.184.064.456.148.816.252.48.128.872.26 1.176.396.312.128.58.32.804.576.224.256.34.596.348 1.02 0 .376-.104.712-.312 1.008-.208.296-.504.528-.888.696-.376.168-.82.252-1.332.252Zm10.07-3.576c0 .248-.016.472-.048.672H45.11c.04.528.236.952.588 1.272.352.32.784.48 1.296.48.736 0 1.256-.308 1.56-.924h1.476a2.998 2.998 0 0 1-1.092 1.5c-.52.384-1.168.576-1.944.576-.632 0-1.2-.14-1.704-.42a3.139 3.139 0 0 1-1.176-1.2c-.28-.52-.42-1.12-.42-1.8 0-.68.136-1.276.408-1.788.28-.52.668-.92 1.164-1.2.504-.28 1.08-.42 1.728-.42.624 0 1.18.136 1.668.408.488.272.868.656 1.14 1.152.272.488.408 1.052.408 1.692ZM48.782 5.1c-.008-.504-.188-.908-.54-1.212-.352-.304-.788-.456-1.308-.456-.472 0-.876.152-1.212.456-.336.296-.536.7-.6 1.212h3.66ZM52.924.12V9h-1.368V.12h1.368Zm3.164 0V9H54.72V.12h1.368Zm7.856 5.412c0 .248-.016.472-.048.672h-5.052c.04.528.236.952.588 1.272.352.32.784.48 1.296.48.736 0 1.256-.308 1.56-.924h1.476a2.998 2.998 0 0 1-1.092 1.5c-.52.384-1.168.576-1.944.576-.632 0-1.2-.14-1.704-.42a3.139 3.139 0 0 1-1.176-1.2c-.28-.52-.42-1.12-.42-1.8 0-.68.136-1.276.408-1.788.28-.52.668-.92 1.164-1.2.504-.28 1.08-.42 1.728-.42.624 0 1.18.136 1.668.408.488.272.868.656 1.14 1.152.272.488.408 1.052.408 1.692ZM62.516 5.1c-.008-.504-.188-.908-.54-1.212-.352-.304-.788-.456-1.308-.456-.472 0-.876.152-1.212.456-.336.296-.536.7-.6 1.212h3.66Zm4.143-1.752c.2-.336.464-.596.792-.78.336-.192.732-.288 1.188-.288v1.416h-.348c-.536 0-.944.136-1.224.408-.272.272-.408.744-.408 1.416V9H65.29V2.388h1.368v.96Z'
                                  />
                                  <path
                                    fill='#F6BC01'
                                    d='M4.5 7.43 7.281 9l-.738-2.96L9 4.05l-3.236-.262L4.5 1 3.236 3.787 0 4.05l2.453 1.99L1.719 9 4.5 7.43Z'
                                  />
                                </svg>
                              </span>
                            ) : null}
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
