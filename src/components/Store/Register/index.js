import React, { Component } from "react";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import { loginStoreUser } from "../../../services/Store/user/actions";
import { getAllLanguages } from "../../../services/languages/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import Loading from "../../helpers/loading";
import Ink from "react-ink";
import { ArrowLeft } from 'react-iconly';
import Axios from "axios";

class Register extends Component {

    static contextTypes = {
		router: () => null,
	};

	state = {
		loading: false,
		store_name: "",
		owner_name: "",
		phone: "",
		email: "",
		fssai: "",
		fssai_file: null,
		licence: "",
		licence_file: null,
		gst: "",
		error: false,
        successSnack: false
	};

	static contextTypes = {
		router: () => null,
	};

    handleInputStoreName = (event) => {
		this.setState({ store_name: event.target.value });
	};

    handleInputOwnerName = (event) => {
		this.setState({ owner_name: event.target.value });
	};

    handleInputPhone = (event) => {
		this.setState({ phone: event.target.value });
	};

	handleInputEmail = (event) => {
		this.setState({ email: event.target.value });
	};

    handleInputFssai = (event) => {
		this.setState({ fssai: event.target.value });
	};

    onFssaiChange = event => {
        this.setState({ fssai_file: event.target.files[0] });
    };

    handleInputLicence = (event) => {
		this.setState({ licence: event.target.value });
	};

    onLicenceChange = event => {
        this.setState({ licence_file: event.target.files[0] });
    };

	handleInputGst = (event) => {
		this.setState({ gst: event.target.value });
	};

    handleRegister = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

        const formData = new FormData();
        formData.append("store_name", this.state.store_name);
        formData.append("owner_name", this.state.owner_name);
        formData.append("phone", this.state.phone);
        formData.append("email", this.state.email);
        formData.append("fssai", this.state.fssai);
        formData.append("fssai_file", this.state.fssai_file);
        formData.append("licence", this.state.licence);
        formData.append("licence_file", this.state.licence_file);
        formData.append("gst", this.state.gst);

        Axios.post("https://chopze.com/public/api/register/store", formData)
        .then(response => {
            const data = response.data;
            if (data.success) {
                this.setState({ successSnack: true })
                setTimeout(
                    () => {
                        this.setState({ successSnack: false})
                        window.location.reload(false);
                    }, 
                    3000
                );
            }
        });
	};

	componentWillReceiveProps(nextProps) {
		const { store_user } = this.props;
		if (store_user !== nextProps.store_user) {
			this.setState({ loading: false });
			if (nextProps.store_user.success === false) {
				this.setState({ error: true });
			}
		}
		// if (nextProps.store_user.success) {
			// this.context.router.push("/delivery");
		// }
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { store_user } = this.props;
		if (store_user.success) {
			return (
				//redirect to account page
				<Redirect to={"/store/dashboard"} />
			);
		}

		return (
			<React.Fragment>
				<Meta
					seotitle="Register"
					ogtype="website"
					ogurl={window.location.href}
				/>

                <div className="input-group-prepend" style={{ backgroundColor: 'white' }}>
					<button
						type="button"
						className="btn search-navs-btns"
						style={{ position: "relative" }}
						onClick={() => {
							setTimeout(() => {
								this.context.router.history.goBack();
							}, 200);
						}}
					>
						<ArrowLeft />
						<Ink duration="500" />
					</button>
				</div>

                {this.state.successSnack == true &&
                    <div className="no-click" style={{"position":"fixed","bottom":"0px","textAlign":"center","width":"100%","backgroundColor":"#60b246","color":"#f4f4f5","padding":"0.8rem","zIndex":"2147483647"}}>
                        <div className="error">Store Registration Succesfull</div>
                    </div>
                }

				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake"> Email & Password do not match. </div>
					</div>
				)}
				{this.state.loading && <Loading />}
				<div className="bg-white" style={{ minHeight: '100vh' }}>
					<div className="text-center">
						<img
							src="https://chopze.com/assets/images/chop-logo2.png"
							alt="login-header"
                            style={{ maxHeight: '8rem' }}
						/>
					</div>

					<form onSubmit={this.handleRegister}>
						<div className="form-group px-15 pt-30">
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								Store Name
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="store_name"
									onChange={this.handleInputStoreName}
									className="form-control"
									placeholder="Enter Store Name"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								Store Owner Name
							</label>
							<div className="col-md-9">
								<input required
									type="text"
									name="owner_name"
									onChange={this.handleInputOwnerName}
									className="form-control"
									placeholder="Enter Store Owner Name"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								Contact Number
							</label>
							<div className="col-md-9">
								<input required
									type="tel"
									name="phone"
									onChange={this.handleInputPhone}
									className="form-control"
									placeholder="Enter Contact Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								Email
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="email"
									name="email"
									onChange={this.handleInputEmail}
									className="form-control"
									placeholder="Enter Email"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								FSSAI Number
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="fssai"
									onChange={this.handleInputFssai}
									className="form-control"
									placeholder="Enter FSSAI Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								FSSAI Document
							</label>
							<div className="col-md-9 pb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
								<input required
									type="file"
									name="fssai_file"
									onChange={(e) => this.onFssaiChange(e)}
									className="form-control"
									placeholder="Enter FSSAI Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderTopLeftRadius":"5px","borderBottomLeftRadius":"5px","fontFamily":"poppins !important","width":"60vw"}}
								/>
                                <div className="text-center pt-3" style={{ fontWeight: '600', color: 'white', backgroundColor: '#FE0B15', borderRadius: '5px', height: '40px', width: '30vw' }}>Choose File</div>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								Store Licence Number
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="licence"
									onChange={this.handleInputLicence}
									className="form-control"
									placeholder="Enter Store Licence Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								Store Licence Document
							</label>
							<div className="col-md-9 pb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
								<input required
									type="file"
									name="licence_file"
									onChange={(e) => this.onLicenceChange(e)}
									className="form-control"
									placeholder="Enter Store Licence Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderTopLeftRadius":"5px","borderBottomLeftRadius":"5px","fontFamily":"poppins !important","width":"60vw"}}
								/>
                                <div className="text-center pt-3" style={{ fontWeight: '600', color: 'white', backgroundColor: '#FE0B15', borderRadius: '5px', height: '40px', width: '30vw' }}>Choose File</div>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"500","letterSpacing":"1px"}}>
								GST
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="gst"
									onChange={this.handleInputGst}
									className="form-control"
									placeholder="Enter GST"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
						</div>
						<div className="mt-20 px-15 mb-50 text-center">
							<button
								type="submit"
								className="btn"
								style={{ "backgroundColor":"white","border":"1px solid #FE0B15","color":"#FE0B15","fontWeight":"700","fontSize":"16px","paddingLeft":"50px","paddingRight":"50px","paddingTop":"10px","paddingBottom":"10px","height":"40px","borderRadius":"5px" }}
							>
								Submit To Approval
							</button>
						</div>
					</form>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ loginStoreUser, getSettings, getAllLanguages, getSingleLanguageData }
)(Register);
