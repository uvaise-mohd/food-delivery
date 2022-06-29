import React, { Component } from "react";

import DelayLink from "../../../../helpers/delayLink";
import Ink from "react-ink";
import Moment from "react-moment";
import {
  TickSquare,
  ShieldDone,
  ShieldFail,
  TimeSquare,
  Bag2,
} from "react-iconly";
import { formatPrice } from "../../../../helpers/formatPrice";
import OrderCancelPopup from "./OrderCancelPopup";
import { addProduct, loadCart } from "../../../../../services/cart/actions";
import { getSingleItem } from "../../../../../services/items/actions";
import { updateCart } from "../../../../../services/total/actions";
import { connect } from "react-redux";
import { ChevronDown } from "react-iconly";

class OrderList extends Component {
  static contextTypes = {
    router: () => null,
  };

  componentDidMount() {
    document.getElementsByTagName("body")[0].classList.add("bg-white");
  }

  _getTotalItemCost = (item) => {
    let itemCost = parseFloat(item.price) * item.quantity;
    if (item.order_item_addons.length) {
      item.order_item_addons.map((addon) => {
        itemCost += parseFloat(addon.addon_price) * item.quantity;
        return itemCost;
      });
    }
    return formatPrice(itemCost);
  };

  //   addProducts = (order) => {
  //     const { addProduct } = this.props;
  //     console.log(order.orderitems);

  //     order.orderitems.forEach((item) => {
  //       this.props.getSingleItem(item.item_id).then((response) => {
  //         if (response) {
  //           response.payload.quantity = 1;
  //           addProduct(response.payload);
  //         }
  //       });
  //     });

  //     setTimeout(() => {
  //       this.context.router.history.push("/cart");
  //     }, 1000);
  //   };

  componentWillUnmount() {
    document.getElementsByTagName("body")[0].classList.remove("bg-grey");
  }

  retryOrder = (order) => {
    this.props.setLoading(true);
    // console.log(order.orderitems);

    order.orderitems.forEach((item) => {
      this.props.getSingleItem(item.item_id).then((response) => {
        if (response) {
          let addons = [];
          addons["selectedaddons"] = [];

          response.payload.quantity = item.quantity;
          if (item.order_item_addons.length > 0) {
            item.order_item_addons.forEach((addon) => {
              addons["selectedaddons"].push({
                addon_category_name: addon.addon_category_name,
                addon_id: addon.id,
                addon_name: addon.addon_name,
                price: addon.addon_price,
              });
            });
            response.payload.selectedaddons = addons["selectedaddons"];
          }
          // console.log(response.payload);
          this.addProduct(response.payload);
        }
      });
    });

    // this.props.loadCart();

    setTimeout(() => {
      this.props.history.push("/cart");
    }, 1000);
  };

  addProduct = (product) => {
    const { cartProducts, updateCart } = this.props;

    //get restaurant id and save to localStorage as active restaurant
    localStorage.setItem("activeRestaurant", product.restaurant_id);

    let productAlreadyInCart = false;
    cartProducts.forEach((cp) => {
      // first check if the restaurent id matches with items in cart
      // if restaurant id doesn't match, then remove all products from cart
      // then continue to add the new product to cart
      if (cp.restaurant_id === product.restaurant_id) {
        // then add the item to cart or increment count
        if (cp.id === product.id) {
          //check if product has customizations, and if the customization matches with any
          if (
            JSON.stringify(cp.selectedaddons) ===
            JSON.stringify(product.selectedaddons)
          ) {
            // increment the item quantity by 1
            cp.quantity += 1;
            productAlreadyInCart = true;
          }
        }
      } else {
        // else if restaurant id doesn't match, then remove all products from cart

        cartProducts.splice(0, cartProducts.length);
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }
    // veCoupon();
    // console.log(cartProducts);
    updateCart(cartProducts);
    //   this.openFloatCart();
  };

  render() {
    const { order, user, cancelOrder } = this.props;
    return (
      <React.Fragment>
        <div className='mb-4'>
          <div
            className='p-3'
            style={{
              background: "#FBFBFB",
              border: "1px solid #F5F5F8",
              borderRadius: "16px",
            }}>
            <div className={`d-flex `}>
              {order.orderitems.slice(0, 4).map((item) => (
                <div style={{ marginLeft: "10px" }}>
                  <img
                    style={{
                      width: "4rem",
                      height: "4rem",
                      background: "rgba(227, 85, 63, 0.15)",
                      borderRadius: "10px",
                    }}
                    src={`https://app.snakyz.com/assets/img/items/${item.item.image}`}
                  />
                </div>
              ))}
              {order.orderitems.length > 4 && (
                <div style={{ marginLeft: "10px" }}>
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      background: "rgba(227, 85, 63, 0.15)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "17px",
                      color: "#FF0000",
                    }}>
                    + {parseFloat(order.orderitems.length) - 4}
                  </div>
                </div>
              )}
            </div>
            <div className='mt-4 d-flex justify-content-between'>
              <div
                style={{
                  fontWeight: "400",
                  color: order.orderstatus.color_code,
                }}>
                <span
                  style={{
                    background: order.orderstatus.color_code,
                    borderRadius: "3px",
                    color: "white",
                    padding: "0px 1px",
                  }}>
                  <ChevronDown
                    size={"small"}
                    style={{ marginBottom: "-3px" }}
                  />
                </span>{" "}
                {order.orderstatus.name}
              </div>
              <div>
                #
                {order.unique_order_id.substring(
                  order.unique_order_id.length - 8
                )}
              </div>
              <div>
                <Moment format='MMM DD, hh:mm A'>{order.created_at}</Moment>
              </div>
              
            </div>

            <div className='mb-2 mt-4 d-flex justify-content-between'>
              <div
                onClick={() => this.retryOrder(order)}
                style={{
                  background: "rgb(255, 0, 0)",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "400",
                  color: "white",
                  width: "45%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                Re-Order
              </div>
              <DelayLink
                to={`/view-order/${order.unique_order_id}`}
                style={{
                  background: "#ecb8aa4a",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "400",
                  color: "#FF0000",
                  width: "45%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                Details
              </DelayLink>
            </div>
            {/* <DelayLink
              to={`/view-order/${order.unique_order_id}`}
              // delay={250}
              style={{ position: "relative" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <div style={{ fontWeight: "bolder", fontSize: "15px" }}>
                    {order.stores.name}
                  </div>
                  {order.order_status_id === 1 && (
                    <div
                      style={{
                        color: "#0960BD",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <span>
                        <TickSquare className='mr-1' size={14} />
                      </span>
                      <span>Order Placed</span>
                    </div>
                  )}
                  {order.order_status_id === 5 && (
                    <div
                      style={{
                        color: "#1ABE30",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <span>
                        <ShieldDone className='mr-1' size={14} />
                      </span>
                      <span>Delivered</span>
                    </div>
                  )}
                  {order.order_status_id === 6 && (
                    <div
                      style={{
                        color: "#FF0000",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <span>
                        <ShieldFail className='mr-1' size={14} />
                      </span>
                      <span>Cancelled</span>
                    </div>
                  )}
                  {order.order_status_id === 9 && (
                    <div
                      style={{
                        color: "#FF0000",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <span>
                        <ShieldFail className='mr-1' size={14} />
                      </span>
                      <span>Transaction Failed</span>
                    </div>
                  )}
                  {order.order_status_id === 10 && (
                    <div
                      style={{
                        color: "#8B8B8B",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <span>
                        <TickSquare className='mr-1' size={14} />
                      </span>
                      <span>Transaction Pending</span>
                    </div>
                  )}
                  {order.order_status_id === 11 && (
                    <div
                      style={{
                        color: "#FE0B15",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <span>
                        <Bag2 className='mr-1' size={14} />
                      </span>
                      <span>Self Pick Up</span>
                    </div>
                  )}
                  {order.order_status_id != 1 &&
                    order.order_status_id != 5 &&
                    order.order_status_id != 6 &&
                    order.order_status_id != 9 &&
                    order.order_status_id != 10 &&
                    order.order_status_id != 11 && (
                      <div
                        style={{
                          color: "#0960BD",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <span>
                          <TimeSquare className='mr-1' size={14} />
                        </span>
                        <span>On Going</span>
                      </div>
                    )}
                </div>
                <div className='text-muted mt-2'>{order.stores.address}</div>
                <div className='text-muted mt-2 font-w600'>
                  <span className='rupees-symbol'>₹</span>
                  {order.total}
                </div>

                <hr style={{ borderTop: "1px dashed grey" }} />
                {order.orderitems.map((item) => (
                  <div className='mb-2'>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                      <div>{item.name}</div>
                      <div className='font-w600'>x {item.quantity}</div>
                    </div>
                    {item.order_item_addons.map((addon) => (
                      <div className='text-muted ml-4'>{addon.addon_name}</div>
                    ))}
                  </div>
                ))}
                <div className='text-muted' style={{ fontSize: "11px" }}>
                  <Moment format='MMM DD, hh:mm A'>{order.created_at}</Moment>
                </div>
              </div>
            </DelayLink> */}

            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}>
              {order.can_cancel && order.order_status_id == 1 && (
                <OrderCancelPopup
                  order={order}
                  user={user}
                  cancelOrder={cancelOrder}
                />
              )}
            </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.user.user,
  cancel: state.orders.cancel,
  cartProducts: state.cart.products,
});

export default connect(mapStateToProps, {
  getSingleItem,
  addProduct,
  updateCart,
})(OrderList);
