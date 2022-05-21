import React, { Component } from "react";
import DelayLink from "../../helpers/delayLink";
import Ink from "react-ink";
import Meta from "../../helpers/meta";
import { NavLink } from "react-router-dom";
import ProgressiveImage from "react-progressive-image";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";

class FirstScreen extends Component {

	state = {
		splashVersion: 1,
	};

	componentDidMount() {
		setTimeout(() => {
			this.removeSplashScreen();
		}, 1000);
	}

	removeSplashScreen = () => {
		if (document.getElementById("firstScreenSplash")) {
			document.getElementById("firstScreenSplash").remove();
		}
		if (document.getElementById("firstScreenMain")) {
			document.getElementById("firstScreenMain").classList.remove("hidden");
		}
	};

	render() {
		const { user } = this.props;

		if (localStorage.getItem("userSetAddress") !== null) {
			return <Redirect to="/stores" />;
		}
		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<div>
					<div className="col-12 p-0" id="firstScreenSplash">
						<div className="block m-0">
							<div className="block-content p-0">
								<img
									src={"https://app.snakyz.com/assets/splash.svg"}
									className="img-fluid"
									alt={localStorage.getItem("storeName")}
									style={{
										height: '100vh',
										width: '100vw',
										objectFit: 'cover'
									}}
								/>
							</div>
						</div>
					</div>
					<div
						className="col-12 p-0 hidden"
						id="firstScreenMain"
						style={{ height: `${window.innerHeight}px` }}
					>
						<div className="block m-0 ">
							<div className="block-content p-0">
								<ProgressiveImage
									delay={100}
									src="https://app.snakyz.com/assets/images/chop-logo2.png"
								>
									{(src, loading) => (
										<img
											src={src}
											alt={localStorage.getItem("storeName")}
											className=""
											style={{"position":"fixed","width":"35vw","left":"5vw","top":"5vw"}}
										/>
									)}
								</ProgressiveImage>

								<ProgressiveImage
									delay={100}
									src="https://app.snakyz.com/assets/img/first-screen.jpg"
								>
									{(src, loading) => (
										<img
											src={src}
											alt={localStorage.getItem("storeName")}
											className=""
											style={{
												filter: loading ? "blur(1.2px) brightness(0.9)" : "none",
												height: "75vh"
											}}
										/>
									)}
								</ProgressiveImage>
							</div>
						</div>
						<div className="block m-0">
							<div className="block-content pt-10" style={{ height: '25vh' }}>
								<h1 className="welcome-heading mt-10">Get started with Chopze</h1>
								<DelayLink
									to="/search-location"
									delay={200}
									className="btn btn-lg btn-setup-location mt-20"
									style={{
										backgroundColor: localStorage.getItem("storeColor"),
										position: "relative",
									}}
								>
									SET UP YOUR LOCATION
									<Ink duration="500" hasTouch="true" />
								</DelayLink>
								{user.success ? (
									<p className="login-block font-w600 mb-0">
										Hey, {user.data.name}
									</p>
								) : (
									<p className="login-block mb-0">
										Do you have an Account?{" "}
										<NavLink to="/login" style={{ color: localStorage.getItem("storeColor") }}>
											Login
										</NavLink>
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	settings: state.settings.settings,
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ getSettings }
)(FirstScreen);
