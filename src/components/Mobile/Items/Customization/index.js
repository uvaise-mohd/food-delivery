import React, { Component } from "react";

import Ink from "react-ink";

import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import ProgressiveImage from "react-progressive-image";
import { WEBSITE_URL } from "../../../../configs/website";

class Customization extends Component {
  state = {
    open: false,
  };

  _processAddons = (product) => {
    let addons = [];
    addons["selectedaddons"] = [];

    let radio = document.querySelectorAll("input[type=radio]:checked");
    for (let i = 0; i < radio.length; i++) {
      addons["selectedaddons"].push({
        addon_category_name: radio[i].name,
        addon_id: radio[i].getAttribute("data-addon-id"),
        addon_name: radio[i].getAttribute("data-addon-name"),
        price: radio[i].value,
      });
    }

    let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

    for (let i = 0; i < checkboxes.length; i++) {
      addons["selectedaddons"].push({
        addon_category_name: checkboxes[i].name,
        addon_id: checkboxes[i].getAttribute("data-addon-id"),
        addon_name: checkboxes[i].getAttribute("data-addon-name"),
        price: checkboxes[i].value,
      });
    }

    this.props.addProduct(Object.assign(addons, product));
  };

  handlePopupOpen = () => {
    this.setState({ open: true });
  };
  handlePopupClose = () => {
    this.setState({ open: false });
    this.props.forceUpdate();
  };
  render() {
    const { product, cartProducts } = this.props;
    return (
      <React.Fragment>
        {cartProducts.find((cp) => cp.id === product.id) === undefined && (
          <React.Fragment>
            <button
              type='button'
              className='btn btn-add-remove'
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
              onClick={this.handlePopupOpen}>
              <div
                style={{
                  fontSize: "1.2rem",
                  lineHeight: "14px",
                  color: "white",
                  fontWeight: "500",
                }}>
                +
              </div>
              {/* <Ink duration='500' /> */}
            </button>
          </React.Fragment>
        )}

        {cartProducts.find((cp) => cp.id === product.id) !== undefined && (
          <React.Fragment>
            <button
              type='button'
              className='btn btn-add-remove'
              style={{
                color: localStorage.getItem("cartColor-bg"),
                width: "30px",
                backgroundColor: "rgb(254, 0, 0)",
              }}
              onClick={this.handlePopupOpen}>
              <div
                className='btn-dec  pb-1'
                style={{
                  color: "white",
                  backgroundColor: "rgb(254, 0, 0)",
                  borderRadius: "0.5rem",
                  fontWeight: "500",
                  fontSize: "15px",
                }}>
                +
              </div>
              <Ink duration='500' />
            </button>
          </React.Fragment>
        )}

        <BottomSheet open={this.state.open} onDismiss={this.handlePopupClose}>
          <div className='p-4'>
            <div className='d-flex'>
              {product.image !== "" && (
                <div>
                  <React.Fragment>
                    <ProgressiveImage
                      src={WEBSITE_URL + "/assets/img/items/" + product.image}
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
                            alt={product.name}
                            className='flex-item-image '
                          />
                        </>
                      )}
                    </ProgressiveImage>
                  </React.Fragment>
                </div>
              )}
              <div>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "16px",
                    lineHeight: "140%",
                    color: "#1F272D",
                    marginTop: "10px",
                  }}>
                  {product.name}
                </div>
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "140%",
                    color: "#A5A9AB",
                  }}>
                  {product.description}
                </div>
              </div>
            </div>
            {product.addon_categories.map((addon_category) => (
              <div key={addon_category.id}>
                <React.Fragment>
                  <p className='addon-category-name mb-2'>
                    {addon_category.name}
                  </p>
                  {addon_category.addons.length && (
                    <React.Fragment>
                      {addon_category.addons.map((addon, index) => (
                        <React.Fragment key={addon.id}>
                          <div className='form-group addon-list'>
                            <input
                              type={
                                addon_category.type === "SINGLE"
                                  ? "radio"
                                  : "checkbox"
                              }
                              className={
                                addon_category.type === "SINGLE"
                                  ? "magic-radio"
                                  : "magic-checkbox"
                              }
                              name={addon_category.name}
                              data-addon-id={addon.id}
                              data-addon-name={addon.name}
                              value={addon.price}
                              defaultChecked={
                                addon_category.type === "SINGLE" &&
                                index === 0 &&
                                true
                              }
                            />
                            {addon_category.type === "SINGLE" && (
                              <label htmlFor={addon.name} />
                            )}

                            <label
                              className='text addon-label'
                              htmlFor={addon.name}>
                              {addon.name}{" "}
                              <span className='addon-label-price ml-1'>
                                {localStorage.getItem("hidePriceWhenZero") ===
                                  "true" && addon.price === "0.00" ? null : (
                                  <React.Fragment>
                                    {localStorage.getItem(
                                      "currencySymbolAlign"
                                    ) === "left" &&
                                      localStorage.getItem("currencyFormat")}
                                    {addon.price}{" "}
                                    {localStorage.getItem(
                                      "currencySymbolAlign"
                                    ) === "right" &&
                                      localStorage.getItem("currencyFormat")}
                                  </React.Fragment>
                                )}
                              </span>
                            </label>
                          </div>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  )}
                  <hr />
                </React.Fragment>
              </div>
            ))}
            <button
              className='btn'
              onClick={() => {
                this._processAddons(product);
                this.handlePopupClose();
              }}
              style={{
                backgroundColor: "rgb(233 51 35)",
                color: "white",
                zIndex: "999999",
                width: "100%",
                borderRadius: "12px",
                height: "46px",
                fontSize: "17px",
              }}>
              ADD TO CART
            </button>
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </BottomSheet>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  cartProducts: state.cart.products,
});

export default connect(mapStateToProps)(Customization);
