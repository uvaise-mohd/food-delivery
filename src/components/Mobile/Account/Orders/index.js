import React, { Component } from "react";
import { cancelOrder, getOrders } from "../../../../services/orders/actions";

import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import OrderList from "./OrderList";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { ChevronLeft } from "react-iconly";

class Orders extends Component {
  state = {
    no_orders: false,
    cancelSuccess: false,
    active_tab: "HISTORY",
  };

  static contextTypes = {
    router: () => null,
  };

  componentDidMount() {
    const { user } = this.props;
    if (user.success) {
      this.props.getOrders(
        user.data.auth_token,
        user.data.id,
        this.state.active_tab
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.orders.length === 0) {
      this.setState({ no_orders: true });
    }

    if (this.props.cancel !== nextProps.cancel) {
      //call to handle afterCancellation from parent

      if (nextProps.cancel.success) {
        this.setState({ cancelSuccess: true });
        const { user } = this.props;
        if (user.success) {
          this.props.getOrders(user.data.auth_token, user.data.id);
        }
      }
    }

    this.setState({ loading: false });
  }

  render() {
    if (window.innerWidth > 768) {
      return <Redirect to='/' />;
    }
    const { user, orders } = this.props;
    if (localStorage.getItem("storeColor") === null) {
      return <Redirect to={"/"} />;
    }
    if (!user.success) {
      return <Redirect to={"/login"} />;
    }

    const activeTab = {
      background: "rgb(255, 0, 0)",
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: "600",
      color: "white",
      width: "45%",
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    const inactiveTab = {
      background: "#ecb8aa4a",
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#FF0000",
      width: "45%",
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <React.Fragment>
        <div className='bg-white'>
          {/* <div
            style={{ position: "absolute", top: "15px", left: "15px" }}
            onClick={() => this.context.router.history.push("/my-account")}>
            <ArrowLeft />
          </div> */}

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
            onClick={() => this.context.router.history.push("/my-account")}>
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
            My Orders
          </div>

          <div className='mb-4 mt-4 p-2 d-flex justify-content-around'>
            <div
              onClick={() => {
                this.setState({ active_tab: "HISTORY", loading: true });
                if (user.success) {
                  this.props.getOrders(
                    user.data.auth_token,
                    user.data.id,
                    "HISTORY"
                  );
                }
              }}
              style={
                this.state.active_tab == "HISTORY" ? activeTab : inactiveTab
              }>
              History
            </div>
            <div
              onClick={() => {
                this.setState({ active_tab: "UPCOMING", loading: true });
                if (user.success) {
                  this.props.getOrders(
                    user.data.auth_token,
                    user.data.id,
                    "UPCOMING"
                  );
                }
              }}
              style={
                this.state.active_tab == "UPCOMING" ? activeTab : inactiveTab
              }>
              Upcoming
            </div>
          </div>

          <div className='pt-20 pb-20 height-100-percent px-15'>
            {((orders.length === 0 && !this.state.no_orders) ||
              this.state.loading == true) && (
              <ContentLoader
                height={600}
                width={400}
                speed={1.2}
                primaryColor='#f3f3f3'
                secondaryColor='#ecebeb'>
                <rect x='0' y='0' rx='0' ry='0' width='75' height='22' />
                <rect x='0' y='30' rx='0' ry='0' width='350' height='18' />
                <rect x='0' y='60' rx='0' ry='0' width='300' height='18' />
                <rect x='0' y='90' rx='0' ry='0' width='100' height='18' />

                <rect x='0' y={0 + 170} rx='0' ry='0' width='75' height='22' />
                <rect
                  x='0'
                  y={30 + 170}
                  rx='0'
                  ry='0'
                  width='350'
                  height='18'
                />
                <rect
                  x='0'
                  y={60 + 170}
                  rx='0'
                  ry='0'
                  width='300'
                  height='18'
                />
                <rect
                  x='0'
                  y={90 + 170}
                  rx='0'
                  ry='0'
                  width='100'
                  height='18'
                />

                <rect x='0' y={0 + 340} rx='0' ry='0' width='75' height='22' />
                <rect
                  x='0'
                  y={30 + 340}
                  rx='0'
                  ry='0'
                  width='350'
                  height='18'
                />
                <rect
                  x='0'
                  y={60 + 340}
                  rx='0'
                  ry='0'
                  width='300'
                  height='18'
                />
                <rect
                  x='0'
                  y={90 + 340}
                  rx='0'
                  ry='0'
                  width='100'
                  height='18'
                />
              </ContentLoader>
            )}
            {orders.length === 0 && (
              <div className='text-center mt-50 text-muted'>No Orders</div>
            )}
            {orders.map((order) => (
              <OrderList
                key={order.id}
                order={order}
                user={user}
                cancelOrder={this.props.cancelOrder}
                cancel={this.props.cancel}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  orders: state.orders.orders,
  cancel: state.orders.cancel,
});

export default connect(mapStateToProps, { getOrders, cancelOrder })(Orders);
