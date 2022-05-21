import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

class CustomCssProvider extends Component {
	render() {
		return (
			<React.Fragment>
				<Helmet>
					{/* load light mode css for delivery app */}
					{localStorage.getItem("deliveryDark") === "true" ? (
						<link rel="stylesheet" type="text/css" href="/assets/css/delivery-dark.css" />
					) : (
						<link rel="stylesheet" type="text/css" href="/assets/css/delivery-light.css" />
					)}
					{/* <style type="text/css">{localStorage.getItem("deliveryDark")}</style> */}
				</Helmet>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
});

export default connect(
	mapStateToProps,
	{}
)(CustomCssProvider);
