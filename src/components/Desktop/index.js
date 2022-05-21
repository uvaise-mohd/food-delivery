import React, { Component } from "react";

import Meta from "../helpers/meta";
import { connect } from "react-redux";
import { getSettings } from "../../services/settings/actions";
import Home from "./Home";

class Desktop extends Component {

	render() {
		return (
			<React.Fragment>
				<Home />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
});

export default connect(
	mapStateToProps,
	{ getSettings }
)(Desktop);
