import React, { Component } from "react";
import ContentLoader from "react-content-loader"
import Footer from "../Footer";
import Meta from "../../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateStoreUserInfo, logoutUser } from "../../../../services/Store/user/actions";
import Axios from "axios";
import 'react-dragswitch/dist/index.css';
import TopBar from "../TopBar";
import { Avatar } from 'evergreen-ui';
import { EditSquare } from 'react-iconly';
import { Login } from 'react-iconly';
import { PaperUpload } from 'react-iconly';
import { Calendar, User } from 'react-iconly';
import { Activity } from 'react-iconly';
import { Link } from 'react-router-dom';
import DelayLink from "../../../helpers/delayLink";

class Account extends Component {

	state = {
		stores: [],
	};

	componentDidMount() {
		this._fetchRestaurantsOwned();
	}

	_fetchRestaurantsOwned() {
		Axios
			.post('https://app.snakyz.com/public/api/store/fetch-owned-stores', {
				token: this.props.user.auth_token,
			})
			.then((response) => {
				const data = response.data;

				if (data.stores.length > 0) {
					//console.log(data.stores);
					this.setState({
						stores: data.stores,

					});
				} else {
					this.setState({
						stores: []
					});
				}
			});
	};

	render() {

		const { user } = this.props;
		if (!user) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/store/login"} />
			);
		}

		// console.log(this.state.stores);

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<TopBar
					has_title={true}
					title="Profile"
				/>
				<React.Fragment>
					<div style={{ paddingBottom: '7rem' }} className="bg-grey pt-30">
						{this.state.stores.length == 0 &&
							<ContentLoader viewBox="0 0 500 700 mt-50" height={700} width={500} >

								<circle cx="70.2" cy="73.2" r="41.3" />
								<rect x="129.9" y="29.5" width="125.5" height="17" />
								<rect x="129.9" y="64.7" width="296" height="17" />
								<rect x="129.9" y="97.8" width="253.5" height="17" />

							</ContentLoader>
						}
						<div className="mt-50">
							{this.state.stores.length > 0 && this.state.stores.map((restaurant, index) => (
								<div className="bg-white mr-15 ml-15 p-15 mb-15" style={{ borderRadius: '8px', display: 'flex' }}>
									<div className="col-3">
										<Avatar
											src={`https://app.snakyz.com/assets/img/stores/${restaurant.image}`}
											name={restaurant.name}
											size={60} />
									</div>
									<div className="col-6">
										<span style={{ fontWeight: '600' }}>{restaurant.name}</span>
										<br />
										<span style={{ color: '#B8B8B8', fontSize: '12px' }}>{restaurant.description}</span>
									</div>
									<div className="col-2 pt-20 pl-30">
										<DelayLink to={'/store/edit/' + restaurant.id}>
											<EditSquare />
										</DelayLink>
									</div>
								</div>
							))}
						</div>

						<div className="bg-white mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
							<Link to="/store/edit-user">
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										Edit Store Owner <User />
									</div>
								</div>
							</Link>
						</div>

						<div className="bg-white mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
							<Link to="/store/payout">
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										Store Payout <Activity />
									</div>
								</div>
							</Link>
						</div>

						<div className="bg-white mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
							<Link to="/store/completed-orders">
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										Completed Orders <Calendar />
									</div>
								</div>
							</Link>
						</div>

						<div className="bg-white mr-15 mt-10 ml-15 p-15" style={{ borderRadius: '8px' }}>
							<div className="" onClick={() => this.props.logoutUser(user)}>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									Logout <span style={{ color: '#FE0B15' }}><Login /></span>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
				<Footer active_account={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.store_user.store_user.data,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo, logoutUser }
)(Account);
