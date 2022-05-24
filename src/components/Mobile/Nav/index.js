import React, { Component } from "react";
import { connect } from "react-redux";
import Ink from "react-ink";
import PWAInstallation from "../PWAInstallation";
import LocationIcon from "@material-ui/icons/Place";
import FreshChat from "react-freshchat";

class Nav extends Component {
  static contextTypes = {
    router: () => null,
  };

  render() {
    return (
      <React.Fragment>
        <div className="mt-10">
          <div className="block m-0">
            <div className="block-content p-0">
              <div className="input-group">
                <div className="input-group-append">
                  <PWAInstallation type={"header"} />
                  <div className="d-flex flex-column ">
                    <div
                      className="btn"
                      style={{
                        position: "relative",
                        maxWidth: window.innerWidth - 130,
                        color: "#fe0000",
                        display: "flex",
                        backgroundColor: "#fff",
                        textTransform: "uppercase",
                      }}
                    >
                      Delivery To
                    </div>
                    <div>
                      <div
                        className="btn"
                        style={{
                          position: "relative",
                          maxWidth: window.innerWidth - 130,
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#fff",
                          marginLeft: "-5px",
                          marginTop: "-5px",
                        }}
                        onClick={() => {
                          this.context.router.history.push("/search-location");
                          // this.props.loggedin
                          // 	? this.context.router.history.push("/my-addresses")
                          // 	: this.context.router.history.push("/search-location");
                        }}
                      >
					  <img src="assets/img/home-loc-icon.png" className="mr-10 ml-5"/>
                        {localStorage.getItem("userSetAddress") && (
                          <React.Fragment>
                            <span>
                              {JSON.parse(
                                localStorage.getItem("userSetAddress")
                              ).address.length > 18
                                ? `${JSON.parse(
                                    localStorage.getItem("userSetAddress")
                                  ).address.substring(0, 38)}...`
                                : JSON.parse(
                                    localStorage.getItem("userSetAddress")
                                  ).address}
                            </span>
                          </React.Fragment>
                        )}
                        <Ink duration="500" />
                      </div>
                    </div>
                  </div>

                  {/* {this.props.user.success === true &&
										<FreshChat
											token={"699dc1c8-9ea2-4ee2-9921-ce370b98ca0c"}
											host= {"https://wchat.in.freshchat.com"}
											config={
												{
													cssNames: {
														widget: 'chat-adjust-class'
													}
												}
											}
											onInit={widget => {
												// widget.hide();
												window.widget = widget;
												widget.user.setProperties({
													firstName: this.props.user.data.name,
													phone: this.props.user.data.phone,
													externalId: this.props.user.data.id
												})

											}}
										/>
									} */}
                </div>
                {!this.props.disable_back_button && (
                  <div className="input-group-prepend">
                    <button
                      type="button"
                      className="btn search-navs-btns"
                      style={{ position: "relative" }}
                    >
                      <i className="si si-arrow-left" />
                      <Ink duration="500" />
                    </button>
                  </div>
                )}
                {/* <p className="form-control search-input">
									{this.props.logo &&
										(this.props.logoLink ? (
											<Link to="/">
												<img
													src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
													alt={localStorage.getItem("storeName")}
													className="store-logo"
												/>
											</Link>
										) : (
											<img
												src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
												alt={localStorage.getItem("storeName")}
												className="store-logo"
											/>
										))}
								</p> */}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, {})(Nav);
