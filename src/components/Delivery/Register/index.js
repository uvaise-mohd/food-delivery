import React, { Component } from "react";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import { loginDeliveryUser } from "../../../services/Delivery/user/actions";
import { getAllLanguages } from "../../../services/languages/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import Loading from "../../helpers/loading";
import Ink from "react-ink";
import { ArrowLeft } from 'react-iconly';
import Axios from "axios";
import axios from "axios";

class Register extends Component {

    static contextTypes = {
		router: () => null,
	};

	state = {
		loading: false,
		cities: [],
		name: "",
		email: "",
		phone: "",
		city: "",
		age: "",
		licence_number: "",
		licence: "",
		aadhar_number: "",
		aadhar: "",
		vehicle_number: "",
		error: false,
        successSnack: false
	};

	componentDidMount(){
        this.fetchDeliveryCities();
	}

	fetchDeliveryCities(){
        axios
		.post('https://app.snakyz.com/public/api/delivery/get-cities')
		.then((response) => {
			const data = response.data.data;
            // console.log(data);
			if (data) {
                this.setState({ loading: false })
				this.setState({
					cities: data.cities,
				});

			} else {
				this.setState({
					cities: [],
				});
			}
		});
    };

	static contextTypes = {
		router: () => null,
	};

    handleInputName = (event) => {
		this.setState({ name: event.target.value });
	};

	handleInputEmail = (event) => {
		this.setState({ email: event.target.value });
	};

    handleInputPhone = (event) => {
		this.setState({ phone: event.target.value });
	};

    handleInputCity = (event) => {
		this.setState({ city: event.target.value });
	};

	handleInputAge = (event) => {
		this.setState({ age: event.target.value });
	};

    handleInputLicence = (event) => {
		this.setState({ licence_number: event.target.value });
	};

	handleInputAadhar = (event) => {
		this.setState({ aadhar_number: event.target.value });
	};

	onLicenceChange = event => {
        this.setState({ licence: event.target.files[0] });
    };

	onAadharChange = event => {
        this.setState({ aadhar: event.target.files[0] });
    };

	handleInputVehicleNumber = (event) => {
		this.setState({ vehicle_number: event.target.value });
	};

    handleRegister = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

        const formData = new FormData();
        formData.append("name", this.state.name);
        formData.append("email", this.state.email);
        formData.append("phone", this.state.phone);
        formData.append("city", this.state.city);
        formData.append("age", this.state.age);
        formData.append("licence_number", this.state.licence_number);
        formData.append("licence", this.state.licence);
        formData.append("aadhar_number", this.state.aadhar_number);
        formData.append("aadhar", this.state.aadhar);
        formData.append("vehicle_number", this.state.vehicle_number);

        Axios.post("https://app.snakyz.com/public/api/register/delivery", formData)
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
		const { delivery_user } = this.props;
		if (delivery_user !== nextProps.delivery_user) {
			this.setState({ loading: false });
			if (nextProps.delivery_user.success === false) {
				this.setState({ error: true });
			}
		}
		// if (nextProps.delivery_user.success) {
			// this.context.router.push("/delivery");
		// }
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { delivery_user } = this.props;
		if (delivery_user.success) {
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
                        <div className="error">Partner Registration Succesfull</div>
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
							src="https://app.snakyz.com/assets/images/chop-logo2.png"
							alt="login-header"
                            style={{ maxHeight: '8rem' }}
						/>
					</div>

					<form onSubmit={this.handleRegister}>
						<div className="form-group px-15 pt-30">
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Name
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="name"
									onChange={this.handleInputName}
									className="form-control"
									placeholder="Enter Your Name"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Email
							</label>
							<div className="col-md-9">
								<input required
									type="email"
									name="email"
									onChange={this.handleInputEmail}
									className="form-control"
									placeholder="Enter Your Email"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
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
							<div className="mt-5 ml-15 mr-15">
								<label style={{ fontWeight: '600' }}>City</label>
								<div>
									<select name="city"
										onChange={this.handleInputCity}
										style={{ height: '3em', border: '1px solid #D9D9D9', borderRadius: '4px', width: '100%', paddingLeft: '20px', background: 'white', marginBottom: '12px' }}
										className="text-muted"
									>
										<option selected disabled>-Selcet-</option>
										{this.state.cities && this.state.cities.map((city) => (
											<option value={city.id}> {city.city_name} </option>
										))}
									</select>
								</div>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Age
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="tel"
									name="age"
									onChange={this.handleInputAge}
									className="form-control"
									placeholder="Enter Your Age"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Licence Number
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="licence_number"
									onChange={this.handleInputLicence}
									className="form-control"
									placeholder="Enter Your Licence Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Licence Document
							</label>
							<div className="col-md-9 pb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
								<input required
									type="file"
									name="lecence"
									onChange={(e) => this.onLicenceChange(e)}
									className="form-control"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderTopLeftRadius":"5px","borderBottomLeftRadius":"5px","fontFamily":"poppins !important","width":"60vw"}}
								/>
                                <div className="text-center pt-3" style={{ fontWeight: '600', color: 'white', backgroundColor: '#FE0B15', borderRadius: '5px', height: '40px', width: '30vw' }}>Choose File</div>
							</div>
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Aadhar Number
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="aadhar_number"
									onChange={this.handleInputAadhar}
									className="form-control"
									placeholder="Enter Your Aadhar Number"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderRadius":"5px","fontFamily":"poppins !important"}}
								/>
							</div>
							<label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Aadhar Document
							</label>
							<div className="col-md-9 pb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
								<input required
									type="file"
									name="aadhar"
									onChange={(e) => this.onAadharChange(e)}
									className="form-control"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderTopLeftRadius":"5px","borderBottomLeftRadius":"5px","fontFamily":"poppins !important","width":"60vw"}}
								/>
                                <div className="text-center pt-3" style={{ fontWeight: '600', color: 'white', backgroundColor: '#FE0B15', borderRadius: '5px', height: '40px', width: '30vw' }}>Choose File</div>
							</div>
                            <label className="col-12" style={{"color":"black","fontSize":"13px","fontWeight":"600","letterSpacing":"1px"}}>
								Vehicle Number
							</label>
							<div className="col-md-9 pb-5">
								<input required
									type="text"
									name="vehicle_number"
									onChange={this.handleInputVehicleNumber}
									className="form-control"
									placeholder="Enter Yor Vehicle Number"
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
	delivery_user: state.delivery_user.delivery_user,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ loginDeliveryUser, getSettings, getAllLanguages, getSingleLanguageData }
)(Register);
