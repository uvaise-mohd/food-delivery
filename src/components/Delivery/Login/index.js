import React, { Component } from "react";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import { loginDeliveryUser } from "../../../services/Delivery/user/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import Loading from "../../helpers/loading";
import LightSpeed from "react-reveal/LightSpeed";
import { Link } from "react-router-dom";

class Login extends Component {

	state = {
		loading: false,
		email: "",
		password: "",
		error: false,
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		this.props.getSettings();

		// setTimeout(() => {
		// 	this.setState({ error: false });
		// }, 380);

	}

	handleInputEmail = (event) => {
		this.setState({ email: event.target.value });
	};

	handleInputPassword = (event) => {
		this.setState({ password: event.target.value });
	};

	handleLogin = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		this.props.loginDeliveryUser(this.state.email, this.state.password);
	};

	componentWillReceiveProps(nextProps) {
		const { delivery_user } = this.props;
		if (delivery_user !== nextProps.delivery_user) {
			this.setState({ loading: false });
			if (nextProps.delivery_user.success === false) {
				this.setState({ error: true });
			}
		}
		if (nextProps.delivery_user.success) {
			// this.context.router.push("/delivery");
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					// console.log("NEXT", nextProps.languages);
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { delivery_user } = this.props;
		if (delivery_user.success) {
			return (
				//redirect to account page
				<Redirect to={"/delivery"} />
			);
		}

		return (
			<React.Fragment>
				<Meta
					seotitle="Login"
					ogtype="website"
					ogurl={window.location.href}
				/>
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">Email & Password do not match.</div>
					</div>
				)}
				{this.state.loading && <Loading />}
				<div className="bg-white" style={{ height: '100vh' }}>
					<div className="text-center">
						<img
							src="https://chopze.com/assets/images/chop-logo2.png"
							className="login-image"
							alt="login-header"
						/>
					</div>

					<form onSubmit={this.handleLogin}>
						<div className="form-group px-15 pt-30">
							<label className="col-12 edit-address-input-label">
								Email
							</label>
							<div className="col-md-9 pb-5">
								<input
									type="text"
									name="email"
									onChange={this.handleInputEmail}
									className="form-control edit-address-input"
									placeholder="Enter your Email"
								/>
							</div>
							<label className="col-12 edit-address-input-label">
								Password
							</label>
							<div className="col-md-9">
								<input
									type="password"
									name="password"
									onChange={this.handleInputPassword}
									className="form-control edit-address-input"
									placeholder="Enter your password"
								/>
							</div>
						</div>
						<div className="mt-20 px-15 pt-15 text-center">
							<button
								type="submit"
								className="btn"
								style={{ "backgroundColor":"white","border":"1px solid #FE0B15","color":"#FE0B15","fontWeight":"700","fontSize":"16px","paddingLeft":"50px","paddingRight":"49px","paddingTop":"10px","paddingBottom":"10px","height":"40px","borderRadius":"5px" }}
							>
								LOGIN
							</button>
						</div>
					</form>
					
					<div className="text-center" style={{ marginTop: '8vh' }}>
						<div style={{ fontWeight: '700', fontSize: '15px' }}>
							Don't have account ? <span style={{ color: '#FE0B15' }}>
								<Link to="/delivery/register">
									Register here
								</Link>
							</span>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ loginDeliveryUser, getSettings, getSingleLanguageData }
)(Login);
