import React, { Component } from "react";
import Modal from "react-responsive-modal";
import Ink from "react-ink";
import { formatPrice } from "../../../../../helpers/formatPrice";
import { InfoCircle } from "react-iconly";

class OrderCancelPopup extends Component {
  state = {
    open: false,
  };
  handlePopupOpen = () => {
    this.setState({ open: true });
  };
  handlePopupClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { order, user, cancelOrder } = this.props;

    return (
      <React.Fragment>
        <button
          className='btn  btn-outline-secondary mb-10 pl-2 pr-2 order-cancel-button mt-2'
          style={{
            position: "relative",
            width: "94%",
            borderRadius: "17px",
            height: "4rem",
            fontWeight: "800",
            fontSize: "15px",
          }}
          onClick={this.handlePopupOpen}>
          Cancel Order
          <Ink duration='500' />
        </button>
        <Modal
          open={this.state.open}
          onClose={this.handlePopupClose}
          closeIconSize={32}>
          <div className='text-center mt-100'>
            <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>
              <InfoCircle
                size={50}
                style={{ color: localStorage.getItem("storeColor") }}
              />
              <p>{order.unique_order_id}</p>
              <p>Do you want to cancel this order?</p>
              {order.order_status_id === 1 ? (
                <React.Fragment>
                  {order.payment_mode !== "COD" && (
                    <p className='text-muted font-w400'>
                      <span className='rupees-symbol'>₹</span>
                      {order.total}
                    </p>
                  )}
                  {order.payment_mode === "COD" &&
                    order.total - order.payable !== 0 && (
                      <p className='text-muted font-w400'>
                        <span className='rupees-symbol'>₹</span>
                        {formatPrice(order.total - order.payable)}
                      </p>
                    )}
                </React.Fragment>
              ) : (
                <p className='text-muted font-w400'>
                  No Refund will be made to your wallet as the restaurant has
                  already prepared the order.
                </p>
              )}
            </div>
            <div>
              <button
                className='btn btn-lg btn-danger mr-3'
                onClick={() =>
                  cancelOrder(user.data.auth_token, user.data.id, order.id)
                }
                style={{
                  border: "0",
                  borderRadius: "0.5rem",
                  backgroundColor: localStorage.getItem("storeColor"),
                }}>
                Yes, Cancel Order
              </button>
              <button
                onClick={this.handlePopupClose}
                className='btn btn-lg'
                style={{ border: "0", borderRadius: "0.5rem" }}>
                Go back
              </button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default OrderCancelPopup;
