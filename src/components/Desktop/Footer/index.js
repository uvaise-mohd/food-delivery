import React, { Component } from "react";
import FeatherIcon from 'feather-icons-react';
import { WEBSITE_URL } from "../../../configs/website";
import FreshChat from 'react-freshchat';
import { connect } from "react-redux";

class Footer extends Component {
	render() {
		return (
			<React.Fragment>
				{this.props.user.success === true &&
					<FreshChat
						token={"699dc1c8-9ea2-4ee2-9921-ce370b98ca0c"}
						host={"https://wchat.in.freshchat.com"}
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
				}

				<footer className={`section-footer border-top pt-50 ${!this.props.active_account && "mt-100"}`}>
					<div className="container">
						<section className="footer-top padding-y py-5">
							<div className="row">
								<aside className="col-md-6 footer-about">
									<article className="d-flex pb-3">
										<div><img alt="chopze" src={WEBSITE_URL + "/assets/images/chop-logo.png"} style={{ width: '10vw', marginTop: '-35px', marginRight: '10px' }} /></div>
										<div>
											<h6 className="title text-white">About Us</h6>
											<p className="text-muted">
												Order from Chopze and get great discounts and fast deliveries. We have offers for you daily.
												Order food, groceries and esssentials online and get it delivered at your doorstep.
												Find your favourite local restaurants and shops in your locality.
												Order fresh fruits and vegetables, fresh meats , daily essentials via our groceries section from top supermarkets in your locality.
												Track your order directly from the app.
											</p>
											<div className="d-flex align-items-center">
												<a className="btn btn-icon btn-outline-light mr-5 btn-sm" style={{ height: '40px' }} title="Facebook"
													target="_blank" href="https://www.facebook.com/chopze"><FeatherIcon style={{ color: 'white' }} icon="facebook" /></a>
												<a className="btn btn-icon btn-outline-light mr-5 btn-sm" style={{ height: '40px' }} title="Instagram"
													target="_blank" href="https://www.instagram.com/chopzeindia"><FeatherIcon style={{ color: 'white' }} icon="instagram" /></a>
												<a className="btn btn-icon btn-outline-light mr-5 btn-sm" style={{ height: '40px' }} title="Linkedin"
													target="_blank" href="https://www.linkedin.com/in/ceochopze"><FeatherIcon style={{ color: 'white' }} icon="linkedin" /></a>
											</div>
										</div>
									</article>
								</aside>
								<aside className="col-md-3 text-white">
									<ul className="list-unstyled hov_footer">
										<h6 className="text-white">Contact</h6>
										<div className="text-muted">
											Chopze Private Limited
											<br />
											Suruma
											<br />
											Nethaji Road, Punalur
											<br />
											691305
											<br />
											+91 6238298358
										</div>
									</ul>
								</aside>
								<aside className="col-md-3 text-white">
									<ul className="list-unstyled hov_footer">
										<h6 className="text-white">Pages</h6>
										<li> <a target="_blank" href="https://chopze.com/privacy/index.html" className="text-muted">Privacy Policy</a></li>
										<li> <a target="_blank" href="https://chopze.com/privacy/terms.html" className="text-muted">Terms and Conditions</a></li>
										<li> <a target="_blank" href="https://chopze.com/privacy/cancellation.html" className="text-muted">Cancellation Policy</a></li>
									</ul>
								</aside>
							</div>

						</section>
					</div>

					<section className="footer-copyright border-top py-3 bg-light">
						<div className="container">
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div className="mb-0 col-4"> © 2021 <span style={{ color: localStorage.getItem("storeColor"), fontWeight: 'bolder' }}>Chopze</span> All rights reserved </div>
								{/* <div className="mb-0 col-4">
									Powered By <a target="_blank" href="https://howincloud.com">
										<span style={{ color: 'black', fontSize: '12px', fontWeight: 'bolder' }}>Howin</span><span style={{ color: 'red', fontSize: '10px', fontWeight: 'bolder' }}>CLOUD</span>
									</a>
								</div> */}
								<div className="text-muted col-4 mb-0 ml-auto d-flex align-items-center">
									{/* <a href="#" className="d-block"><img alt="chopze" src={WEBSITE_URL + "/assets/appstore.png"} height="40" /></a> */}
									<a target="_blank" href="https://play.google.com/store/apps/details?id=ch.user.chopze" className="d-block ml-3"><img alt="chopze" src={WEBSITE_URL + "/assets/playmarket.png"} height="40" /></a>
								</div>
							</div>
						</div>
					</section>
				</footer>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
});

export default connect(mapStateToProps, {})(Footer);