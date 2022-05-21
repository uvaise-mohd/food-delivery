import React, { Component } from "react";

import Desktop from "../../components/Desktop";
import Mobile from "../../components/Mobile";
import { connect } from "react-redux";
import { getSettings } from "../../services/settings/actions";
import { Redirect } from "react-router";

class App extends Component {
	componentDidMount() {
		this.props.getSettings();

		if (localStorage.getItem("forceReload") != "false") {
			localStorage.setItem("forceReload", "false");

			setTimeout(() => {
				window.location.reload(true);
			}, 1000);
		}
	}

	render() {
		// return <Redirect to={"/delivery/login"} />;
		return (
			<React.Fragment>
				{window.innerWidth <= 768 ? (
					<Mobile languages={this.props.languages} />
				) : (
					<Desktop languages={this.props.languages} />
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
	user: state.user.user,
	notification_token: state.notification_token.notification_token,
	languages: state.languages.languages,
});

export default connect(
	mapStateToProps,
	{ getSettings }
)(App);
