import React, { Component } from "react";
import { ArrowLeft } from "react-iconly";
import Ink from "react-ink";
import { connect } from "react-redux";
import Meta from "../../../../helpers/meta";
import BackButton from "../../../../Mobile/Elements/BackWithSearch";
import Coupon from "../index";
import axios from "axios";

class AvailableCoupons extends Component {
  state = {
    appliedCoupon: localStorage.getItem("appliedCoupon"),
    coupons: [],
  };

  static contextTypes = {
    router: () => null,
  };

  componentDidMount() {
    axios
      .post("https://chopze.com/public/api/coupons-for-users", {
        restaurant_id: this.props.restaurant_info.id,
        token: this.props.user.data.auth_token,
        subtotal: this.props.cartTotal.totalPrice,
      })
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({ coupons: response.data });
        }
      });
  }

  updateCoupon = (code) => {
    console.log(code);
    localStorage.setItem("appliedCoupon", code);
    this.setState({ appliedCoupon: code });
		this.context.router.history.push("/cart");
  };

  render() {
    return (
      <React.Fragment>
        <Meta
          ogtype="website"
          ogurl={window.location.href}
        />

        {/* <BackButton
          boxshadow={true}
          has_title={true}
          title={"Coupons"}
          disable_search={true}
        /> */}

        <div className="bg-white" style={{ minHeight: "100vh" }}>
          <div style={{ "position": "absolute", "top": "15px", "left": "15px" }} onClick={() => this.context.router.history.goBack()}>
            <ArrowLeft />
          </div>
          <div className="text-center pt-15" style={{ "ontSize": "15px", "fontWeight": "bolder" }}>
            Coupons
          </div>

          <div className="p-20 mt-20">
            {/* <Coupon
              couponPageMode={true}
              appliedCoupon={this.state.appliedCoupon}
              applyCouponParent={this.updateCoupon}
              subtotal={this.props.cartTotal.totalPrice}
            />
            <hr /> */}

            {this.state.coupons &&
              this.state.coupons.map((coupon, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    boxShadow: "rgb(136 136 136) 0px 0px 10px -4px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="pl-3 pr-3" style={{ borderRadius: '0.5rem', color: 'white', fontWeight: 'bolder', letterSpacing: '1px', backgroundColor: '#FE0B15', height: '40px', display: 'flex', alignItems: 'center' }}>
                      {coupon.code}
                    </div>
                    <div onClick={()=> this.updateCoupon(coupon.code)} style={{ color: '#FE0B15', fontWeight: 'bolder', letterSpacing: '1px' }}>
                      {this.state.appliedCoupon != coupon.code ? (
                        <span>APPLY</span>
                      ) : (
                        <span style={{ color: "#5ca20b" }}>Applied</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2" style={{ fontWeight: 'bolder' }}>
                    {coupon.name}
                  </div>
                  <hr style={{ borderTop: '1px dashed grey' }} />
                  <div className="text-muted mb-20">
                    {coupon.description}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  restaurant_info: state.items.restaurant_info,
  user: state.user.user,
  cartTotal: state.total.data,
  cartProducts: state.cart.products,
});

export default connect(mapStateToProps)(AvailableCoupons);
