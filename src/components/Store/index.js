import * as firebase from "firebase/app";

import React, { Component } from "react";

import Meta from "../helpers/meta";

import { Redirect } from "react-router";
import { connect } from "react-redux";
import  Dashboard  from "./Dashboard";
import StoreDesktop from "./StoreDesktop";

class Store extends Component {
	async componentDidMount() {
		if (document.querySelector("#mainManifest")) {
			document.querySelector("#mainManifest").setAttribute("href", "/delivery-manifest.json");
		}
		if (document.getElementsByTagName("body")) {
			document.getElementsByTagName("body")[0].classList.add("bg-white");
		}

		const { store_user } = this.props;

		
		
	}

	render() {
		if (window.innerWidth > 768) {
			return <StoreDesktop />;
		}
		const { store_user } = this.props;

		if (!store_user.success) {
			return <Redirect to={"/store/login"} />;
		}
		return (
			<React.Fragment>
				<Meta
					seotitle="Store Dashboard"
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				
				<Dashboard />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
});

export default connect(
	mapStateToProps,
)(Store);
