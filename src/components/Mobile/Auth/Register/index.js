import React, { Component } from "react";
import { loginUser, registerUser, sendOtp, verifyOtp } from "../../../../services/user/actions";

import BackButton from "../../Elements/BackButton";
import ContentLoader from "react-content-loader";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import SocialButton from "../SocialButton";
import { connect } from "react-redux";
import Loading from "../../../helpers/loading";

class Register extends Component {
	constructor() {
		super();
		this.validator = new SimpleReactValidator({
			autoForceUpdate: this,
			messages: {
				required: localStorage.getItem("fieldValidationMsg"),
				string: localStorage.getItem("nameValidationMsg"),
				email: localStorage.getItem("emailValidationMsg"),
				regex: localStorage.getItem("phoneValidationMsg"),
				min: localStorage.getItem("minimumLengthValidationMessage"),
			},
		});
	}

	state = {
		loading: false,
		name: "",
		email: "",
		phone: "",
		password: "",
		otp: "",
		accessToken: "",
		provider: "",
		error: false,
		email_phone_already_used: false,
		invalid_otp: false,
		showResendOtp: false,
		countdownStart: false,
		countDownSeconds: 15,
		enSOV: "",
		errorMessage: "",
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		const enSOV = this.props.settings && this.props.settings.find((data) => data.key === "enSOV");
		this.setState({ enSOV: enSOV.value });

		if (
			localStorage.getItem("enableFacebookLogin") === "false" &&
			localStorage.getItem("enableGoogleLogin") === "false"
		) {
			if (document.getElementById("socialLoginDiv")) {
				document.getElementById("socialLoginDiv").classList.add("hidden");
			}
		}

		if (
			localStorage.getItem("enableFacebookLogin") === "true" ||
			localStorage.getItem("enableGoogleLogin") === "true"
		) {
			setTimeout(() => {
				if (this.refs.socialLogin) {
					this.refs.socialLogin.classList.remove("hidden");
				}
				if (this.refs.socialLoginLoader) {
					this.refs.socialLoginLoader.classList.add("hidden");
				}
			}, 0.5 * 1000);
		}
	}

	handleInputChange = (event) => {
		if (event.target.name === "phone") {
			this.setState({ phone: localStorage.getItem("phoneCountryCode") + event.target.value });
		} else {
			this.setState({ [event.target.name]: event.target.value });
		}
	};

	handleRegister = (event) => {
		event.preventDefault();

		if (
			this.validator.fieldValid("name") &&
			this.validator.fieldValid("email") &&
			this.validator.fieldValid("phone") &&
			this.validator.fieldValid("password")
		) {
			this.setState({ loading: true });
			if (this.state.enSOV === "true") {
				//sending email and phone, first verify if not exists, then send OTP from the server
				this.props.sendOtp(this.state.email, this.state.phone, null).then((response) => {
					if (!response.payload.otp) {
						this.setState({ error: true, errorMessage: response.payload.message });
					}
				});
			} else {
				this.props.registerUser(
					this.state.name,
					this.state.email,
					this.state.phone,
					this.state.password,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			}
		} else {
			console.log("Validation Failed");
			this.validator.showMessages();
		}
	};

	handleRegisterAfterSocialLogin = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		if (this.validator.fieldValid("phone")) {
			if (this.state.enSOV === "true") {
				//sending email and phone, first verify if not exists, then send OTP from the server
				this.props.sendOtp(this.state.email, this.state.phone, null).then((response) => {
					if (!response.payload.otp) {
						this.setState({ error: true });
					}
				});
			} else {
				this.props.loginUser(
					this.state.name,
					this.state.email,
					null,
					this.state.accessToken,
					this.state.phone,
					this.state.provider,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			}
		} else {
			this.setState({ loading: false });
			console.log("Validation Failed");
			this.validator.showMessages();
		}
	};

	resendOtp = () => {
		if (this.validator.fieldValid("phone")) {
			this.setState({ countDownSeconds: 15, showResendOtp: false });
			this.props.sendOtp(this.state.email, this.state.phone, null).then((response) => {
				if (!response.payload.otp) {
					this.setState({ error: true });
				}
			});
		}
	};

	handleVerifyOtp = (event) => {
		event.preventDefault();
		console.log("verify otp clicked");
		if (this.validator.fieldValid("otp")) {
			this.setState({ loading: true });
			this.props.verifyOtp(this.state.phone, this.state.otp);
		}
	};

	componentWillReceiveProps(newProps) {
		const { user } = this.props;

		if (user !== newProps.user) {
			this.setState({ loading: false });
		}

		if (newProps.user.success) {
			if (newProps.user.data.default_address !== null) {
				const userSetAddress = {
					lat: newProps.user.data.default_address.latitude,
					lng: newProps.user.data.default_address.longitude,
					address: newProps.user.data.default_address.address,
					house: newProps.user.data.default_address.house,
					tag: newProps.user.data.default_address.tag,
				};
				localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
			}

			// if (localStorage.getItem("fromCartToLogin") === "1") {
			// 	localStorage.removeItem("fromCartToLogin");
			// 	console.log("HERE1");
			// 	//redirect to cart page
			// 	this.context.router.history.push("/cart");
			// }
			// } else {
			// 	//goback
			// 	this.context.router.history.goBack();
			// }
		}

		if (newProps.user.email_phone_already_used) {
			this.setState({ email_phone_already_used: true });
		}
		if (newProps.user.otp) {
			this.setState({ email_phone_already_used: false, error: false });
			//otp sent, hide reg form and show otp form
			document.getElementById("registerForm").classList.add("hidden");
			document.getElementById("socialLoginDiv").classList.add("hidden");
			document.getElementById("phoneFormAfterSocialLogin").classList.add("hidden");
			document.getElementById("otpForm").classList.remove("hidden");

			//start countdown
			this.setState({ countdownStart: true });
			this.handleCountDown();
			this.validator.hideMessages();
		}

		if (newProps.user.valid_otp) {
			this.setState({ invalid_otp: false, error: false, loading: true });
			// register user
			if (this.state.social_login) {
				this.props.loginUser(
					this.state.name,
					this.state.email,
					null,
					this.state.accessToken,
					this.state.phone,
					this.state.provider,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			} else {
				this.props.registerUser(
					this.state.name,
					this.state.email,
					this.state.phone,
					this.state.password,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			}

			console.log("VALID OTP, REG USER NOW");
			// this.setState({ loading: false });
		}

		if (newProps.user.valid_otp === false) {
			console.log("Invalid OTP");
			this.setState({ invalid_otp: true });
		}

		if (!newProps.user) {
			this.setState({ error: true });
		}

		//old user, proceed to login after social login
		if (newProps.user.proceed_login) {
			console.log("From Social : user already exists");
			this.props.loginUser(
				this.state.name,
				this.state.email,
				null,
				this.state.accessToken,
				null,
				this.state.provider,
				JSON.parse(localStorage.getItem("userSetAddress"))
			);
		}

		if (newProps.user.enter_phone_after_social_login) {
			this.validator.hideMessages();
			document.getElementById("registerForm").classList.add("hidden");
			document.getElementById("socialLoginDiv").classList.add("hidden");
			document.getElementById("phoneFormAfterSocialLogin").classList.remove("hidden");
			// populate name & email
			console.log("ask to fill the phone number and send otp process...");
		}
	}

	handleSocialLogin = (user) => {
		//if otp verification is enabled
		if (this.state.enSOV === "true") {
			//save user data in state
			this.setState({
				name: user._profile.name,
				email: user._profile.email,
				accessToken: user._token.accessToken,
				provider: user._provider,
				social_login: true,
			});
			//request for OTP, send accessToken, if email exists in db, user will login
			this.props.sendOtp(user._profile.email, null, user._token.accessToken, user._provider).then((response) => {
				if (!response.payload.otp) {
					this.setState({ error: true });
				}
			});
		} else {
			//call to new api to check if phone number present

			//if record phone number present, then login,

			//else show enter phone number
			this.setState({
				name: user._profile.name,
				email: user._profile.email,
				accessToken: user._token.accessToken,
				provider: user._provider,
				social_login: true,
			});
			this.props.loginUser(
				user._profile.name,
				user._profile.email,
				null,
				user._token.accessToken,
				null,
				user._provider,
				JSON.parse(localStorage.getItem("userSetAddress"))
			);
		}
	};

	handleSocialLoginFailure = (err) => {
		this.setState({ error: true });
	};

	handleCountDown = () => {
		setTimeout(() => {
			this.setState({ showResendOtp: true });
			clearInterval(this.intervalID);
		}, 15000 + 1000);
		this.intervalID = setInterval(() => {
			console.log("interval going on");
			this.setState({ countDownSeconds: this.state.countDownSeconds - 1 });
		}, 1000);
	};

	componentWillUnmount() {
		//clear countdown
		console.log("Countdown cleared");
		clearInterval(this.intervalID);
	}

	render() {
		console.log(this.state.name, this.state.email, this.state.phone, this.state.password);
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user } = this.props;
		if (user.success) {
			if (localStorage.getItem("fromCartToLogin") === "1") {
				localStorage.removeItem("fromCartToLogin");
				return (
					//redirect to cart page
					<Redirect to={"/cart"} />
				);
			} else {
				return (
					//redirect to account page
					<Redirect to={"/my-account"} />
				);
			}
		}

		return (
			<React.Fragment>
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">
							{this.state.errorMessage !== ""
								? this.state.errorMessage
								: localStorage.getItem("loginErrorMessage")}
						</div>
					</div>
				)}
				{this.state.email_phone_already_used && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPhoneAlreadyRegistered")}</div>
					</div>
				)}
				{this.state.invalid_otp && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("invalidOtpMsg")}</div>
					</div>
				)}
				{this.state.loading && <Loading />}
				<div className="cust-auth-header">
					<div className="input-group">
						<div className="input-group-prepend">
							<BackButton history={this.props.history} />
						</div>
					</div>
					<img
						src="/assets/img/various/login-illustration.png"
						className="login-image pull-right"
						alt="login-header"
					/>
					<div className="login-texts px-15 mt-30 pb-20">
						<span className="login-title">{localStorage.getItem("registerRegisterTitle")}</span>
						<br />
						<span className="login-subtitle">{localStorage.getItem("registerRegisterSubTitle")}</span>
					</div>
				</div>

				<div className="bg-white">
					<form onSubmit={this.handleRegister} id="registerForm">
						<div className="form-group px-15 pt-30">
							<div className="col-md-9 pb-5">
								<input
									type="text"
									name="name"
									onChange={this.handleInputChange}
									className="form-control auth-input"
									placeholder={localStorage.getItem("loginLoginNameLabel")}
								/>
								{this.validator.message("name", this.state.name, "required|string")}
							</div>

							<div className="col-md-9 pb-5">
								<input
									type="text"
									name="email"
									onChange={this.handleInputChange}
									className="form-control auth-input"
									placeholder={localStorage.getItem("loginLoginEmailLabel")}
								/>
								{this.validator.message("email", this.state.email, "required|email")}
							</div>
							<div className="col-md-9 pb-5">
								<div>
									<span className="country-code">
										{localStorage.getItem("phoneCountryCode") === null
											? ""
											: localStorage.getItem("phoneCountryCode")}
									</span>
									<span>
										<input
											name="phone"
											type="tel"
											onChange={this.handleInputChange}
											className="form-control phone-number-country-code auth-input"
											placeholder={localStorage.getItem("loginLoginPhoneLabel")}
										/>
										{this.validator.message("phone", this.state.phone, [
											"required",
											{ regex: ["^\\+[1-9]\\d{1,14}$"] },
											{ min: ["8"] },
										])}
									</span>
								</div>
							</div>
							<div className="col-md-9">
								<input
									type="password"
									name="password"
									onChange={this.handleInputChange}
									className="form-control auth-input"
									placeholder={localStorage.getItem("loginLoginPasswordLabel")}
								/>
								{this.validator.message("password", this.state.password, "required|min:8")}
							</div>
						</div>
						<div className="mt-20 mx-15 d-flex justify-content-center">
							<button
								type="submit"
								className="btn btn-main"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
									width: "90%",
									borderRadius: "4px",
								}}
							>
								{localStorage.getItem("firstScreenRegisterBtn")}
							</button>
						</div>
					</form>

					<form onSubmit={this.handleVerifyOtp} id="otpForm" className="hidden">
						<div className="form-group px-15 pt-30">
							<label className="col-12 auth-input-label">
								{localStorage.getItem("otpSentMsg")} {this.state.phone}
								{this.validator.message("otp", this.state.otp, "required|numeric|min:4|max:6")}
							</label>
							<div className="col-md-9">
								<input
									name="otp"
									type="tel"
									onChange={this.handleInputChange}
									className="form-control auth-input"
									required
								/>
							</div>

							<button
								type="submit"
								className="btn btn-main"
								style={{ backgroundColor: localStorage.getItem("storeColor") }}
							>
								{localStorage.getItem("verifyOtpBtnText")}
							</button>

							<div className="mt-30 mb-10">
								{this.state.showResendOtp && (
									<div className="resend-otp" onClick={this.resendOtp}>
										{localStorage.getItem("resendOtpMsg")} {this.state.phone}
									</div>
								)}

								{this.state.countDownSeconds > 0 && (
									<div className="resend-otp countdown">
										{localStorage.getItem("resendOtpCountdownMsg")} {this.state.countDownSeconds}
									</div>
								)}
							</div>
						</div>
					</form>

					<form
						onSubmit={this.handleRegisterAfterSocialLogin}
						id="phoneFormAfterSocialLogin"
						className="hidden"
					>
						<div className="form-group px-15 pt-30">
							<label className="col-12 auth-input-label">
								{localStorage.getItem("socialWelcomeText")} {this.state.name},
							</label>
							<label className="col-12 auth-input-label">
								{localStorage.getItem("enterPhoneToVerify")}{" "}
							</label>
							<div className="col-md-9 pb-5">
								<div>
									<span className="country-code">
										{localStorage.getItem("phoneCountryCode") === null
											? ""
											: localStorage.getItem("phoneCountryCode")}
									</span>
									<span>
										<input
											name="phone"
											type="tel"
											onChange={this.handleInputChange}
											className="form-control phone-number-country-code auth-input"
										/>

										{this.validator.message("phone", this.state.phone, [
											"required",
											{ regex: ["^\\+[1-9]\\d{1,14}$"] },
											{ min: ["8"] },
										])}
									</span>
								</div>
							</div>
							<button
								type="submit"
								className="btn btn-main"
								style={{ backgroundColor: localStorage.getItem("storeColor") }}
							>
								{localStorage.getItem("registerRegisterTitle")}
							</button>
						</div>
					</form>

					<div className="text-center mt-3 mb-20" id="socialLoginDiv">
						<p className="login-or mt-2">OR</p>
						<div ref="socialLoginLoader">
							<ContentLoader
								height={60}
								width={400}
								speed={1.2}
								primaryColor="#f3f3f3"
								secondaryColor="#ecebeb"
							>
								<rect x="28" y="0" rx="0" ry="0" width="165" height="45" />
								<rect x="210" y="0" rx="0" ry="0" width="165" height="45" />
							</ContentLoader>
						</div>
						<div ref="socialLogin" className="hidden">
							{localStorage.getItem("enableFacebookLogin") === "true" && (
								<SocialButton
									provider="facebook"
									appId={localStorage.getItem("facebookAppId")}
									onLoginSuccess={this.handleSocialLogin}
									onLoginFailure={() => console.log("Failed didn't get time to init or login failed")}
									className="facebook-login-button mr-2"
								>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<img
												src="/assets/img/various/facebook.png"
												alt="Facebook Login"
												className="img-fluid"
												style={{ width: "18px", marginRight: "10px" }}
											/>
										</div>
										<div style={{ fontSize: "14px" }}>
											{localStorage.getItem("facebookLoginButtonText")}
										</div>
									</div>
								</SocialButton>
							)}
							{localStorage.getItem("enableGoogleLogin") === "true" && (
								<SocialButton
									provider="google"
									appId={localStorage.getItem("googleAppId")}
									onLoginSuccess={this.handleSocialLogin}
									onLoginFailure={() => console.log("Failed didn't get time to init or login failed")}
									className="google-login-button"
								>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<img
												src="/assets/img/various/google.png"
												alt="Google"
												className="img-fluid"
												style={{ width: "18px", marginRight: "10px" }}
											/>
										</div>
										<div>{localStorage.getItem("googleLoginButtonText")}</div>
									</div>
								</SocialButton>
							)}
						</div>
					</div>
					<div>
						<div className="wave-container login-bottom-wave">
							<svg viewBox="0 0 120 28" className="wave-svg">
								<defs>
									<filter id="goo">
										<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
										<feColorMatrix
											in="blur"
											mode="matrix"
											values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 13 -9"
											result="goo"
										/>
										<xfeBlend in="SourceGraphic" in2="goo" />
									</filter>
									<path
										id="wave"
										d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"
									/>
								</defs>

								<use id="wave3" className="wave" xlinkHref="#wave" x="0" y="-2" />
								<use id="wave2" className="wave" xlinkHref="#wave" x="0" y="0" />
							</svg>
						</div>
					</div>

					<div className="text-center mt-50 mb-100">
						{localStorage.getItem("regsiterAlreadyHaveAccount")}{" "}
						<NavLink to="/login" style={{ color: localStorage.getItem("storeColor") }}>
							{localStorage.getItem("firstScreenLoginBtn")}
						</NavLink>
					</div>

					{localStorage.getItem("registrationPolicyMessage") !== "null" && (
						<div
							className="mt-20 mb-20 d-flex align-items-center justify-content-center"
							dangerouslySetInnerHTML={{
								__html: localStorage.getItem("registrationPolicyMessage"),
							}}
						/>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	settings: state.settings.settings,
});

export default connect(
	mapStateToProps,
	{ registerUser, loginUser, sendOtp, verifyOtp }
)(Register);
