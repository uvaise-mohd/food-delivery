import React, { Component } from "react";
import AvatarSelector from "./AvatarSelector";
import { connect } from "react-redux";
import { changeAvatar } from "../../../../services/user/actions";
import Loading from "../../../helpers/loading";
import { EditSquare } from "react-iconly";
import Ink from "react-ink";
import Fade from 'react-reveal/Fade';
import { event } from "react-ga";
import axios from "axios";

class UserInfo extends Component {
	state = {
		avatarPopupOpen: false,
		loading: false,
		edit_profile: false,
		view_name: this.props.user_info.name,
		view_email: this.props.user_info.email,
		view_phone: this.props.user_info.phone,
		name: this.props.user_info.name,
		email: this.props.user_info.email,
		phone: this.props.user_info.phone
	};

	handlePopupOpen = (content) => {
		this.setState({ edit_profile: true });
	};

	handlePopupClose = () => {
		this.setState({ edit_profile: false });
	};

	openAvatarPopup = () => {
		this.setState({ avatarPopupOpen: true });
	};

	handleName = (event) => {
		this.setState({ name: event.target.value });
	}

	handlePhone = (event) => {
		this.setState({ phone: event.target.value });
	}

	handleEmail = (event) => {
		this.setState({ email: event.target.value });
	}

	updateProfile = () => {
		this.setState({ loading: true });
		axios
			.post('https://chopze.com/public/api/update-user', {
				token: this.props.user_info.auth_token,
				name: this.state.name,
				phone: this.state.phone,
				email: this.state.email,
			})
			.then((response) => {
				this.setState({
					loading: false,
					view_name: this.state.name,
					view_phone: this.state.phone,
					view_email: this.state.email,
					edit_profile: false
				});
				this.props.updateUserInfo();
			});
	}

	handleAvatarChange = (e) => {
		this.setState({ loading: true });
		this.props
			.changeAvatar(this.props.user_info.auth_token, e.target.getAttribute("data-name"))
			.then((response) => {
				if (response && response.success) {
					this.props.updateUserInfo();
					this.setState({ loading: false });
					// this.setState({ avatarPopupOpen: false });
				}
			});
	};

	componentWillReceiveProps(nextProps) {
		this.setState({ avatarPopupOpen: nextProps.avatarPopup });
	}

	render() {
		// const { user_info } = this.props;
		return (
			<React.Fragment>
				{this.state.loading && <Loading />}
				{/* <AvatarSelector
					avatarPopupOpen={this.state.avatarPopupOpen}
					handleAvatarChange={this.handleAvatarChange}
				/> */}

				{this.state.edit_profile == true && (
					<React.Fragment>
						<div style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
							<Fade bottom>
								<div className="bg-white" style={{ height: 'auto', left: '0', width: '100%', paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '100px', bottom: '40px', position: 'fixed', zIndex: '9999', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
									<div className="d-flex justify-content-end"><span onClick={this.handlePopupClose}>Close</span></div>
									<div className="font-w600">Name</div>
									<input onChange={this.handleName} value={this.state.name} style={{ height: '45px', width: '90vw', padding: '10px', paddingLeft: '5vw' }} placeholder="Name" className="mt-2 react-date-picker__wrapper" />

									<div className="font-w600 mt-10">Phone</div>
									<input onChange={this.handlePhone} value={this.state.phone} style={{ height: '45px', width: '90vw', padding: '10px', paddingLeft: '5vw' }} placeholder="Phone" className="mt-2 react-date-picker__wrapper" />

									<div className="font-w600 mt-10">Email</div>
									<input onChange={this.handleEmail} value={this.state.email} style={{ height: '45px', width: '90vw', padding: '10px', paddingLeft: '5vw' }} placeholder="Email" className="mt-2 react-date-picker__wrapper" />

									<div
										onClick={this.updateProfile}
										className="btn btn-lg" 
										style={{
											backgroundColor: localStorage.getItem("storeColor"),
											
											
											marginBottom: '15px',
											"borderRadius":"2rem",
											"height":"4rem",
											"fontSize":"1.1rem",
											"fontWeight":"700",
											"display":"block",
											"color":"#fff",
											"textAlign":"center",
											"lineHeight":"2.7rem",
											"bottom":"10px",
											"position":"fixed",
											"left":"5vw",
											"width":"90vw",
											"letterSpacing":"1px"
										}}
									>
										Update
										<Ink duration={400} />
									</div>
								</div>
							</Fade>
						</div>
					</React.Fragment>
				)}

				<div className="bg-white">
					<div className="text-center pt-15" style={{ "ontSize": "15px", "fontWeight": "bolder" }}>
						Profile
					</div>
					<div className="text-center m-20 p-20" style={{ border: '1px solid #B9B9B9', borderRadius: '1.5rem' }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontSize: '15px', fontWeight: 'bolder' }}>{this.state.view_name}</div>
								<div>{this.state.view_phone}</div>
								<div>{this.state.view_email}</div>
							</div>
							<div onClick={() => this.handlePopupOpen()}>
								<EditSquare />
							</div>
						</div>
						{/* <div>
							{user_info.avatar == null ? (
								<img
									src="/assets/img/various/avatars/user2.gif"
									alt={user_info.name}
									style={{ width: "100px" }}
									onClick={this.openAvatarPopup}
								/>
							) : (
								<img
									src={`/assets/img/various/avatars/${user_info.avatar}.gif`}
									alt={user_info.name}
									style={{ width: "100px" }}
									onClick={this.openAvatarPopup}
								/>
							)}
						</div> */}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(
	mapStateToProps,
	{ changeAvatar }
)(UserInfo);
