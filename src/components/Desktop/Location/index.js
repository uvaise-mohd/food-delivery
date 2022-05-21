import React, { Component } from "react";

import Flip from "react-reveal/Flip";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Meta from "../../helpers/meta";
// import PopularPlaces from "./PopularPlaces";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
// import { getPopularLocations } from "../../../services/popularLocations/actions";
import { GET_ADDRESS_FROM_COORDINATES } from "../../../configs";
import Axios from "axios";
import { ArrowLeft } from "react-iconly";
import { getAddresses, setDefaultAddress } from "../../../services/addresses/actions";
import AddressList from "../Account/Addresses/AddressList";
import Ink from "react-ink";
import LocationIcon from '@material-ui/icons/Place';
import Hero from "../Hero";
import Footer from "../Footer";
import { saveAddress } from "../../../services/addresses/actions";

class Location extends Component {

	state = {
		google_script_loaded: false,
		// loading_popular_location: true,
		gps_loading: false,
	};
	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		{
			this.props.user.success &&
				this.props.getAddresses(this.props.user.data.id, this.props.user.data.auth_token, null);
		}

		if (this.searchInput) {
			this.searchInput.focus();
		}

		// setTimeout(() => {
		// 	this.setState({ google_script_loaded: true });
		// }, 2000);

		const existingScript = document.getElementById("googleMaps");
		if (!existingScript) {
			const script = document.createElement("script");
			script.src =
				"https://maps.googleapis.com/maps/api/js?key=AIzaSyDnfMo0NnT8VY7y7U3zRdmUqkCJIWeG2SQ&libraries=places";
			script.id = "googleMaps";
			document.body.appendChild(script);
			script.onload = () => {
				this.setState({ google_script_loaded: true });
			};
		}
	}

	componentWillUnmount() {
		//remove script when component unmount
		const existingScript = document.getElementById("googleMaps");
		if (existingScript) {
			existingScript.parentNode.removeChild(existingScript);
		}
	}

	handleGeoLocationClick = (results) => {
		const { user } = this.props;

		const saveGeoLocation = new Promise((resolve) => {
			localStorage.setItem("geoLocation", JSON.stringify(results[0]));
			resolve("GeoLocation Saved");
		});
		saveGeoLocation.then(() => {
			if (user.success) {
				this.props.saveAddress(
					user.data.id,
					user.data.auth_token,
					JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lat,
					JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lng,
					JSON.parse(localStorage.getItem("geoLocation")).formatted_address,
					null,
					null,
					"get_only_default_address"
				);
			} else {
				const userSetAddress = {
					lat: JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lat,
					lng: JSON.parse(localStorage.getItem("geoLocation")).geometry.location.lng,
					address: JSON.parse(localStorage.getItem("geoLocation")).formatted_address,
					house: null,
					tag: null,
				};

				const saveUserSetAddress = new Promise((resolve) => {
					localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
					resolve("Address Saved");
				});
				saveUserSetAddress.then(() => {
					if (localStorage.getItem("fromCart") === "1") {
						localStorage.removeItem("fromCart");
						this.context.router.history.push("/cart");
					} else {
						this.context.router.history.push("/");
					}
				});
			}
			this.setState({ gps_loading: false });
			this.context.router.history.push("/my-location");
		});
	};

	getMyLocation = () => {
		const location = navigator && navigator.geolocation;
		console.log("LOCATION", location);
		this.setState({ gps_loading: true });
		if (location) {
			location.getCurrentPosition(
				(position) => {
					this.reverseLookup(position.coords.latitude, position.coords.longitude);
				},
				(error) => {
					this.setState({ gps_loading: false });
					console.log(error);
					alert(localStorage.getItem("gpsAccessNotGrantedMsg"));
				},
				{ timeout: 5000 }
			);
		}
	};

	reverseLookup = (lat, lng) => {
		Axios.post(GET_ADDRESS_FROM_COORDINATES, {
			lat: lat,
			lng: lng,
		})
			.then((response) => {
				console.log(response);
				const myLocation = [
					{
						formatted_address: response.data,
						geometry: {
							location: {
								lat: lat,
								lng: lng,
							},
						},
					},
				];
				this.handleGeoLocationClick(myLocation);
			})
			.catch(function (error) {
				console.warn(error.response.data);
			});
	};

	// componentWillReceiveProps(nextProps) {
	// 	if (this.props.popular_locations !== nextProps.popular_locations) {
	// 		this.setState({ loading_popular_location: false });
	// 	}
	// }

	handleSetDefaultAddress = (address_id, address) => {
		// console.log("Address FULL", address);
		const { user } = this.props;
		if (user.success) {
			this.props.setDefaultAddress(user.data.id, address_id, user.data.auth_token).then(() => {
				const saveUserSetAddress = new Promise((resolve) => {
					const userSetAddress = {
						lat: address.latitude,
						lng: address.longitude,
						address: address.address,
						house: address.house,
						tag: address.tag,
					};
					localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
					resolve("Address Saved");
				});
				saveUserSetAddress.then(() => {
					if (localStorage.getItem("fromCart") === "1") {
						localStorage.removeItem("fromCart");
						this.context.router.history.push("/cart");
					} else {
						this.context.router.history.push("/");
					}
				});
			});
		}
	};

	render() {
		// if (localStorage.getItem("storeColor") === null) {
		// 	return <Redirect to={"/"} />;
		// }
		const { user, addresses } = this.props;

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				{this.state.gps_loading && (
					<div className="height-100 overlay-loading ongoing-payment-spin">
						<div className="spin-load" />
					</div>
				)}
				<Hero />

				<div className="d-flex">
					<img src="https://chopze.com/assets/images/chop-logo.png" style={{ width: '9vw', position: 'absolute', top: '20vh', left: '5vw' }} />
					<div style={{ width: '50vw' }}>
						<img placeholder="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder" src="https://chopze.com/assets/login-bg.jpg" style={{ width: '50vw', height: '100vh', objectFit: 'cover' }} alt="chopze" />
					</div>
					<div className="col-12 p-0 pt-0" style={{ minHeight: '50vh' }}>
						<div style={{ width: '50vw' }}>
							<div>
								{this.state.google_script_loaded && (
									<GooglePlacesAutocomplete
										debounce={750}
										withSessionToken={true}
										loader={
											<img
												src="/assets/img/various/spinner.svg"
												className="location-loading-spinner"
												alt="loading"
											/>
										}
										renderInput={(props) => (
											<div className="input-location-icon-field">
												<div>
													<input
														{...props}
														className="form-control search-input"
														placeholder={"Search Your Location..."}
														ref={(input) => {
															this.searchInput = input;
														}}
													/>
												</div>
											</div>
										)}
										renderSuggestions={(active, suggestions, onSelectSuggestion) => (
											<div className="location-suggestions-container">
												{suggestions.map((suggestion, index) => (
													<Flip top delay={index * 50} key={suggestion.id}>
														<div
															className="location-suggestion"
															onClick={(event) => {
																onSelectSuggestion(suggestion, event);
																geocodeByPlaceId(suggestion.place_id)
																	.then((results) => this.handleGeoLocationClick(results))
																	.catch((error) => console.error(error));
															}}
														>
															<span className="location-main-name">
																{suggestion.structured_formatting.main_text}
															</span>
															<br />
															<span className="location-secondary-name">
																{suggestion.structured_formatting.secondary_text}
															</span>
														</div>
													</Flip>
												))}
											</div>
										)}
									/>
								)}
							</div>

							<button
								style={{ "color": "rgb(255, 109, 115)", "border": "none", "background": "white", "boxShadow": "0px 0px 3px 2px rgb(0 0 0 / 5%)", "marginLeft": "20px", "width": "45vw", "borderRadius": "0.5rem", "height": "3rem", "marginBottom": "2vw" }}
								onClick={this.getMyLocation}
							>
								<LocationIcon /> Use Current Location
							</button>
						</div>

						{user.success && addresses.length > 0 ? (
							<div>
								<React.Fragment>
									<div className="mx-20">
										<div className="mb-2" style={{ lineHeight: '1.6' }}>Recent Locations</div>
										{addresses.map((address) => (
											<AddressList
												handleDeleteAddress={this.handleDeleteAddress}
												deleteButton={false}
												key={address.id}
												address={address}
												user={user}
												fromCartPage={false}
												handleSetDefaultAddress={this.handleSetDefaultAddress}
											/>
										))}
									</div>
								</React.Fragment>
							</div>
						) : (
							<div className="h5 mt-100 text-center" style={{ width: '50vw' }}>
								Find Your Favourite Food and Restaurants !
							</div>
						)}
					</div>
				</div>

				<Footer active_account={true} />

				{/* <PopularPlaces
					loading={this.state.loading_popular_location}
					handleGeoLocationClick={this.handleGeoLocationClick}
					locations={popular_locations}
				/> */}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	addresses: state.addresses.addresses,
});

export default connect(
	mapStateToProps,
	{ getAddresses, setDefaultAddress, saveAddress }
)(Location);
