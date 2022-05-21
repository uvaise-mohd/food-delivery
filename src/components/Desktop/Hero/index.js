import React, { Component } from "react";
import { WEBSITE_URL } from "../../../configs/website";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Location, Search } from "react-iconly";
import { Home, Heart2, Bag, User } from "react-iconly";

class Hero extends Component {

	state = {
		active_home: false,
		active_search: false,
		active_favourite: false,
		active_cart: false,
		active_account: false,
	};

	componentDidMount() {
		if (this.props.active_home === true) {
			this.setState({ active_home: true });
		}
		if (this.props.active_search === true) {
			this.setState({ active_search: true });
		}
		if (this.props.active_favourite === true) {
			this.setState({ active_favourite: true });
		}
		if (this.props.active_cart === true) {
			this.setState({ active_cart: true });
		}
		if (this.props.active_account === true) {
			this.setState({ active_account: true });
		}
	}

	render() {

		const { cartTotal, user } = this.props;

		return (
			<React.Fragment>
				<header className="section-header" style={{ position: 'sticky', top: '0px', zIndex: '9999' }}>
					<section className="header-main shadow-sm bg-white pt-2 pb-2" style={{ height: '10vh', boxShadow: 'rgb(136 136 136) 0px 0px 10px -3px' }}>
						<div className={`container ${!localStorage.getItem("userSetAddress") && "mt-2"}`}>
							<div className="row align-items-center">
								<div className="col-1">
									<img alt="chopze" style={{ height: '6vh' }} src={WEBSITE_URL + "/assets/images/Chopze.PNG"} />
								</div>
								<NavLink to="/desktop/search-location">
									<div className="col-3 d-flex align-items-center m-none">
										{localStorage.getItem("userSetAddress") && (
											<div className="dropdown mr-3">
												<div className="text-dark dropdown-toggle d-flex align-items-center py-3"
													id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
													aria-expanded="false">
													<div className="mr-2">
														<Location size={15} />
													</div>
													<div>
														<React.Fragment>
															<span>
																{JSON.parse(localStorage.getItem("userSetAddress")).tag !== null ? (
																	<strong className="text-uppercase mr-1">
																		{JSON.parse(localStorage.getItem("userSetAddress")).tag}
																	</strong>
																) : null}

																{JSON.parse(localStorage.getItem("userSetAddress")).house !==
																	null ? (
																	<span>
																		{JSON.parse(localStorage.getItem("userSetAddress")).house
																			.length > 12
																			? `${JSON.parse(
																				localStorage.getItem("userSetAddress")
																			).house.substring(0, 12)}...`
																			: JSON.parse(localStorage.getItem("userSetAddress"))
																				.house}
																	</span>
																) : (
																	<span>
																		{JSON.parse(localStorage.getItem("userSetAddress")).address
																			.length > 18
																			? `${JSON.parse(
																				localStorage.getItem("userSetAddress")
																			).address.substring(0, 18)}...`
																			: JSON.parse(localStorage.getItem("userSetAddress"))
																				.address}
																	</span>
																)}
															</span>
														</React.Fragment>
													</div>
												</div>
											</div>
										)}
									</div>
								</NavLink>

								<div className="col-8">
									<div className="d-flex align-items-center justify-content-end pr-5">

										<NavLink to="/" class={`widget-header mr-4`}>
											<div style={{ color: this.state.active_home ? '#FE0B15' : '#000000' }} className="icon d-flex align-items-center">
												{this.state.active_home ? <Home size={18} set="bold" /> : <Home size={18} />} <span className="ml-2">Home</span>
											</div>
										</NavLink>

										<NavLink to="/desktop/explore" class={`widget-header mr-4`}>
											<div style={{ color: this.state.active_search ? '#FE0B15' : '#000000' }} className="icon d-flex align-items-center">
												{this.state.active_search ? <Search size={18} set="bold" /> : <Search size={18} />} <span className="ml-2">Explore</span>
											</div>
										</NavLink>

										<NavLink to={user.success ? "/desktop/my-favorite-stores" : "/desktop/login"} class={`widget-header mr-4`}>
											<div style={{ color: this.state.active_favourite ? '#FE0B15' : '#000000' }} className="icon d-flex align-items-center">
												{this.state.active_favourite ? <Heart2 size={18} set="bold" /> : <Heart2 size={18} />} <span className="ml-2">Favourites</span>
											</div>
										</NavLink>

										<NavLink to="/desktop/cart" class={`widget-header mr-4`}>
											<div style={{ color: this.state.active_cart ? '#FE0B15' : '#000000' }} className="icon d-flex align-items-center">
												{this.state.active_cart ? <Bag size={18} set="bold" /> : <Bag size={18} />} <span className="ml-2">Cart</span>
												{!this.state.active_cart && cartTotal.productQuantity && cartTotal.productQuantity != 0 ? (
													<span className="cart-qnt-badge-desktop">{cartTotal.productQuantity}</span>
												) : (null)}
											</div>
										</NavLink>

										<NavLink to="/desktop/my-account" class={`widget-header mr-4`}>
											<div style={{ color: this.state.active_account ? '#FE0B15' : '#000000' }} className="icon d-flex align-items-center">
												{this.state.active_account ? <User size={18} set="bold" /> : <User size={18} />} <span className="ml-2">Profile</span>
											</div>
										</NavLink>

									</div>
								</div>
							</div>
						</div>
					</section>
				</header>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	cartTotal: state.total.data,
});

export default connect(
	mapStateToProps,
	{}
)(Hero);
