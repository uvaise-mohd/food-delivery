import React, { Component } from "react";
import { loginUserOtp, registerUserOtp, sendCustomOtp } from "../../../../services/user/actions";
import BackButton from "../../Elements/BackButton";
import ContentLoader from "react-content-loader";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import SocialButton from "../SocialButton";
import { connect } from "react-redux";
import { getSingleLanguageData } from "../../../../services/languages/actions";
import Loading from "../../../helpers/loading";
import DelayLink from '../../../helpers/delayLink';
import Ink from "react-ink";

class LoginOtp extends Component {
	constructor() {
		super();
		this.validator = new SimpleReactValidator({
			autoForceUpdate: this,
			messages: {
				required: localStorage.getItem("fieldValidationMsg"),
				email: localStorage.getItem("emailValidationMsg"),
				regex: localStorage.getItem("phoneValidationMsg"),
			},
		});
	}
	state = {
		loading: false,
		name: "",
		email: "",
		phone: "",
		otp: "",
		accessToken: "",
		provider: "",
		error: false,
		email_phone_already_used: false,
		invalid_otp: false,
		showResendOtp: false,
		countdownStart: false,
		countDownSeconds: 15,
		email_pass_error: false,
		user_email: ''
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
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
		this.setState({ [event.target.name]: event.target.value });
	};
	handleInputEmail = (event) => {
		this.setState({ user_email: event.target.value });
	};

	componentWillReceiveProps(nextProps) {

		const { user } = this.props;
		// console.log(nextProps.user);

		if (user !== nextProps.user) {
			this.setState({ loading: false });
		}
		if (nextProps.user.success) {
			if (nextProps.user.data.default_address !== null) {
				const userSetAddress = {
					lat: nextProps.user.data.default_address.latitude,
					lng: nextProps.user.data.default_address.longitude,
					address: nextProps.user.data.default_address.address,
					house: nextProps.user.data.default_address.house,
					tag: nextProps.user.data.default_address.tag,
				};
				localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
			}
			this.context.router.history.goBack();
		}
		if (nextProps.user.email_phone_already_used) {
			this.setState({ email_phone_already_used: true });
		}
		if (nextProps.user.otp) {
			console.log('cnn');

			this.setState({ email_phone_already_used: false, error: false });
			//otp sent, hide reg form and show otp form
			document.getElementById("loginForm").classList.add("hidden");
			document.getElementById("otpForm").classList.remove("hidden");

			//start countdown
			this.setState({ countdownStart: true });
			this.handleCountDown();
			this.validator.hideMessages();
		}

		if (nextProps.user.valid_otp) {
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

		if (nextProps.user.valid_otp === false) {
			console.log("Invalid OTP");
			this.setState({ invalid_otp: true });
		}

		if (!nextProps.user) {
			this.setState({ error: true });
		}

		//old user, proceed to login after social login
		if (nextProps.user.proceed_login) {
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

		if (nextProps.user.enter_phone_after_social_login) {
			this.validator.hideMessages();
			document.getElementById("loginForm").classList.add("hidden");
			document.getElementById("socialLoginDiv").classList.add("hidden");
			document.getElementById("phoneFormAfterSocialLogin").classList.remove("hidden");
			// populate name & email
			console.log("ask to fill the phone number and send otp process...");
		}

		if (nextProps.user.data === "DONOTMATCH") {
			//email and pass donot match
			this.setState({ error: false, email_pass_error: true });
		}

		if (nextProps.user.data === "NEWUSER") {

			this.setState({ error: false, email_pass_error: false });
			document.getElementById("otpForm").classList.add("hidden");
			document.getElementById("registerForm").classList.remove("hidden");



		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	resendOtp = () => {
		if (this.validator.fieldValid("phone")) {
			this.setState({ countDownSeconds: 15, showResendOtp: false });
			this.props.sendCustomOtp(this.state.phone).then((response) => {
				if (!response.payload.otp) {
					this.setState({ error: false });

				}
			});
		}
	};

	sendOtp = (event) => {
		this.setState({ loading: true });
		event.preventDefault();
		this.props.sendCustomOtp(this.state.phone).then((response) => {
			console.log(response);
			this.setState({ loading: false });
			if (!response.payload.otp) {
				this.setState({ error: false });
			}
		});
	};

	handleRegister = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const data = this.props.registerUserOtp(
			this.state.name,
			this.state.dob,
			this.state.user_email,
			this.state.phone,
			this.state.otp,
			JSON.parse(localStorage.getItem("userSetAddress"))
		);
		console.log(data.data);
	};

	handleVerifyOtp = (event) => {
		event.preventDefault();

		console.log("verify otp clicked");
		this.setState({ loading: true });
		this.props.loginUserOtp(
			null,
			null,
			this.state.otp,
			null,
			this.state.phone,
			null,
			JSON.parse(localStorage.getItem("userSetAddress"))
		);

	};

	handleCountDown = () => {
		setTimeout(() => {
			this.setState({ showResendOtp: true });
			clearInterval(this.intervalID);
		}, 15000 + 1000);
		this.intervalID = setInterval(() => {
			console.log("interval going on");
			this.setState({
				countDownSeconds: this.state.countDownSeconds - 1,
			});
		}, 1000);
	};

	componentWillUnmount() {
		//clear countdown
		console.log("Countdown cleared");
		clearInterval(this.intervalID);
	}
	render() {
		const { user } = this.props;
		if (user.success) {
			return (
				//redirect to account page
				<Redirect to={"/my-account"} />
			);
		}
		// const languages = JSON.parse(localStorage.getItem("state")).languages;
		// const languages = this.props.language;
		// console.log(languages);

		const languages = this.props.languages;
		return (
			<React.Fragment>
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("loginErrorMessage")}</div>
					</div>
				)}
				{this.state.email_phone_already_used && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPhoneAlreadyRegistered")}</div>
					</div>
				)}
				{this.state.invalid_otp && (
					<div className="auth-error">
						<div className="error-shake">OTP does not match</div>
					</div>
				)}
				{this.state.email_pass_error && (
					<div className="auth-error">
						<div className="error-shake">OTP does not match</div>
					</div>
				)}

				{this.state.loading && <Loading />}


				<div className="height-100-percent" style={{ backgroundColor: 'white', height: 'contain' }}>
					<div style={{
						backgroundColor: 'white',
						backgroundSize: 'contain'
					}}>
						<div className="input-group">
							<div className="input-group-prepend">
								<BackButton history={this.props.history} />
							</div>
						</div>
						<div className="px-15 pb-20" style={{
							paddingTop: '20%',
						}}>
							<div className='text-center' style={{ width: '100%', left: '0', bottom: '50px', }}>
								<img src="https://chopze.com/assets/send-otp.jpg" style={{ height: '8rem', marginLeft: '9vw' }} />
								{this.state.otp ? (
									<React.Fragment>
										<div class="mt-20" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bolder', textTransform: 'capitalize' }}>
											Let's Get Started
										</div>

										<div class="mt-20" style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '16px' }}>
											Find your favourite Food and Restaurants with Chopze
										</div>
									</React.Fragment>
								) : (
									<React.Fragment>
										<div class="mt-20" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bolder', textTransform: 'capitalize' }}>
											OTP Verification
										</div>

										<div class="mt-20" style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '16px' }}>
											We will send you One Time Password on this mobile number
										</div>
									</React.Fragment>
								)}
							</div>
						</div>
					</div>
					<div style={{ marginTop: '20%' }}>

						<form onSubmit={this.sendOtp} id="loginForm" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
							<div className="form-group px-15 pt-30">
								<label className="col-12" style={{ color: 'black' }}>

									{"Enter Mobile Number"}
									{this.validator.message("phone", this.state.phone, [
										"required",
										{ regex: ["^\\+[1-9]\\d{1,14}$"] },
										{ min: ["8"] },
									])}
								</label>

								{/* <i className="lni lni-phone" style={{ color:'white', }}></i> */}
								<input
									required
									name="phone"
									type="tel"
									placeholder="+91 Enter Your Phone Number"
									minLength={10}
									maxLength={10}
									style=
									{{
										height: ' 3.4em',
										paddingLeft: '20px',
										background: 'white',
										letterSpacing: '1px',
										color: 'black',
										margin: '0px',
										border: '1px solid #707070',
										input_focus: { border: 'none', backgroundColor: 'none' },
										boxShadow: 'none',
										fontSize: '15px',
										borderRadius: '2rem'
									}}
									onChange={this.handleInputChange}
									className="form-control edit-address-input"
								/>
							</div>
							<div className="mt-20 px-15 pt-15 button-block">
								<button
									type="submit"
									className="btn btn-main"
									style={{
										position: 'relative',
										backgroundColor: '#FE0B15',
										borderRadius: '2rem'
									}}
								>
									<h6 className="robo mb-0" style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'capitalize' }}>GET OTP </h6>
									<Ink />
								</button>
							</div>

							{/* 						
						<DelayLink to={'/'} className="text-center mt-3" style={{  textDecoration:'none',color:'white',fontStyle:'normal',}}> 
						<div className='mt-10'>
						
						<h6 style={{ color:'red',fontSize:'15px',fontWeight:'300' }}>Skip Login</h6>
						</div>
						</DelayLink> */}
						</form>

						<form onSubmit={this.handleVerifyOtp} id="otpForm" className="hidden">
							<div className="form-group px-15 pt-30">
								<label className="col-12" style={{ color: 'black' }}>
									{/* {localStorage.getItem("otpSentMsg")}  */}
									Verify OTP for : {this.state.phone}
									{/* {console.log(this.state.phone)} */}
									{this.validator.message("otp", this.state.otp, "required|numeric|min:4|max:6")}
								</label>

								<input
									onChange={this.handleInputChange}
									name="otp"
									type="tel"
									className="form-control edit-address-input"
									placeholder="Enter your OTP"
									required
									style=
									{{
										height: ' 3.4em',
										paddingLeft: '20px',
										background: 'white',
										letterSpacing: '1px',
										color: 'black',
										margin: '0px',
										border: '1px solid #707070',
										input_focus: { border: 'none', backgroundColor: 'none' },
										boxShadow: 'none',
										fontSize: '15px',
										borderRadius: '2rem'
									}}
								/>

								<div className="mt-20 px-15 pt-15 button-block">
									<button
										type="submit"
										className="btn btn-main"
										style={{
											position: 'relative',
											backgroundColor: '#FE0B15',
											borderRadius: '2rem'
										}}
									>
										<h6 className="robo mb-0" style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'capitalize' }}>GET OTP </h6>
										<Ink />
									</button>
								</div>
								<br>
								</br>
								{/* <div style={{ "display": "flex" }}>
									<input className="ml-3 mt-3" type="checkbox" id="vehicle1" name="vehicle1" value="Bike"></input>

									<h6 className="ml-3 mt-2">By accepting this I agree that I have read and accept the <strong style={{ color: '#ff7043' }}>Rules and Restrictions,</strong> the  <strong style={{ color: '#ff7043' }}>Terms of Use and the Privacy Policy.</strong></h6>
								</div> */}
								{/* <div className="col-md-12">
						<input className="mt-3 ml-2" type="checkbox" id="vehicle1" name="vehicle1" value="Bike"></input>
						<h6>By </h6>
						</div> */}

								{/* <div className="mt-30 mb-10"> */}
								{/* {this.state.showResendOtp && ( */}
								{/* <div className="resend-otp" onClick={this.resendOtp} style={{ backgroundColor: 'transparent', border: 'none' }}> */}
								{/* Click to resend OTP to {this.state.phone} */}
								{/* {localStorage.getItem("resendOtpMsg")} */}
								{/* </div> */}
								{/* )} */}

								{/* {this.state.countDownSeconds > 0 && ( */}
								{/* <div className="resend-otp countdown" style={{ backgroundColor: 'transparent', border: 'none' }}> */}
								{/* You can {localStorage.getItem("resendOtpCountdownMsg")} {this.state.countDownSeconds} seconds */}
								{/* </div> */}
								{/* )} */}
								{/* </div> */}
							</div>
						</form>

						<form onSubmit={this.handleRegister} id="registerForm" className="hidden">
							<div className="form-group px-15 pt-30">
								<label className="col-12" style={{ color: 'black' }}>
									Enter your name

								</label>
								<input
									name="name"
									type="text"
									onChange={this.handleInputChange}
									className="form-control edit-address-input"
									style=
									{{
										height: ' 3.4em',
										paddingLeft: '20px',
										background: 'white',
										letterSpacing: '1px',
										color: 'black',
										margin: '0px',
										border: '1px solid #707070',
										input_focus: { border: 'none', backgroundColor: 'none' },
										boxShadow: 'none',
										fontSize: '15px',
										borderRadius: '2rem'
									}}
								/>

							</div>
							<div className="form-group px-15 pt-30">
								<label className="col-12" style={{ color: 'black' }}>
									Enter your Email

								</label>
								<input
									name="email"
									type="email"
									onChange={this.handleInputEmail}
									className="form-control edit-address-input"
									style=
									{{
										height: ' 3.4em',
										paddingLeft: '20px',
										background: 'white',
										letterSpacing: '1px',
										color: 'black',
										margin: '0px',
										border: '1px solid #707070',
										input_focus: { border: 'none', backgroundColor: 'none' },
										boxShadow: 'none',
										fontSize: '15px',
										borderRadius: '2rem'
									}}
								/>

							</div>
							{/* <div className="form-group px-15">
								<label className="col-12 edit-address-input-label">
									Date of Birth

								</label>
								<input
									name="dob"
									type="date"
									onChange={this.handleInputChange}

									style={{
										height: ' 3.4em',
										paddingLeft: '20px',
										background: '#f3f3f3',
										letterSpacing: '1px',
										color: 'black',
										margin: '0px',
										width: '100%',
										outline: '0',
										border: '0',
										borderWidth: '0 0 2px',
										borderBottom: ' 2px solid white',
										input_focus: { border: 'none', backgroundColor: 'none' },
										boxShadow: 'none',
										fontSize: '15px',
									}}
								/>

							</div> */}
							<div className="mt-20 px-15 pt-15 button-block">
								<button
									type="submit"
									className="btn btn-main"
									style={{
										position: 'relative',
										backgroundColor: '#FE0B15',
										borderRadius: '2rem'
									}}
								>
									<h6 className="robo mb-0" style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'capitalize' }}>LET'S STARTED</h6>
									<Ink />
								</button>
							</div>

						</form>
					</div>
					<div className="mt-50 text-center">
						By continuing, you agree to our <br />
						<a href="https://chopze.com/privacy/index.html">
							<span style={{ color: '#FE0B15' }}>
								Terms of Service & Privacy Policy
							</span>
						</a>
					</div>
				</div>

			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	user: state.user.user,
	language: state.languages.language,
	languages: state.languages.languages,
});

export default connect(
	mapStateToProps,
	{
		loginUserOtp,
		registerUserOtp,
		sendCustomOtp,
	}
)(LoginOtp);