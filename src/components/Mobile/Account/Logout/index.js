import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../../../services/user/actions";
import ConfirmLogout from "./ConfirmLogout";
import Ink from "react-ink";
import { Upload } from 'react-iconly';

class Logout extends Component {
	state = {
		confirmLogoutPopupOpen: false,
	};

	openConfirmLogout = () => {
		this.setState({ confirmLogoutPopupOpen: true });
	};

	handleLogout = () => {
		this.props.logoutUser();
	};

	render() {
		return (
			<React.Fragment>
				<ConfirmLogout
					confirmLogoutOpen={this.state.confirmLogoutPopupOpen}
					handleLogout={() => this.handleLogout()}
				/>
				<div className="position-relative" onClick={this.openConfirmLogout}>
					<div className="mb-20 ml-20" style={{ display: 'flex', alignItems: 'center' }}>
						<div className="my-account-menu-item">
							<Upload style={{ color: '#FF0036' }} />
						</div>
						<div className="ml-2 font-w600">Logout</div>
					</div>
					<Ink duration="500" />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(
	mapStateToProps,
	{ logoutUser }
)(Logout);
