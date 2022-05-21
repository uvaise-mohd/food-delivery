import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../services/Store/user/actions";
import { connect } from "react-redux";
import Footer from "./Footer";
import TopBar from "./TopBar";
import Loading from "../../helpers/loading";
import EarningChart from "./EarningChart";
import Axios from "axios";
import { ToggleSwitch } from 'react-dragswitch';
import 'react-dragswitch/dist/index.css';
import { Buy } from 'react-iconly';
import { Calendar, Message } from 'react-iconly';

class Dashboard extends Component {
	state = {
		show_orderhistory: true,
		show_earnings: false,
        stores: [],
		order_count: 0,
		sale_amount: null,
		current_date_type: 'today',
		message: null,
		loading: true,

	};

	componentDidMount() {
		const { store_user } = this.props;
		//update delivery guy info
		this.props.updateStoreUserInfo(store_user.data.id, store_user.data.auth_token);
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		this._fetchRestaurantsOwned();
		this._fetchOrderData();
	}

	_fetchRestaurantsOwned(){
        Axios 
		.post('https://app.snakyz.com/public/api/store/fetch-owned-stores', {
            token: this.props.store_user.data.auth_token,
		})
		.then((response) => {
            const data = response.data;
			this.setState({ loading: false });
            if(data.stores.length > 0){
				// console.log(data.stores);
                this.setState({
                    stores: data.stores,
                });
            }else{
                this.setState({
                    stores: []
                });
            }
		});
	};

	_fetchOrderData = () => {
		Axios
		.post('https://app.snakyz.com/public/api/store/get-report-data', {
            token: this.props.store_user.data.auth_token,

		})
		.then((response) => {
				this.setState({
					order_count: response.data.order_count,
					sale_amount: response.data.sale_amount,
					message: response.data.message,
				});
		});
	}

	__toggleActiveScheduleOff(restaurant_id){
		this.setState({ loading: true });
        Axios
		.post('https://app.snakyz.com/public/api/store/off', {
            token: this.props.store_user.data.auth_token,
            store_id: restaurant_id
		})
		.then((response) => {
			// add new
			this._fetchRestaurantsOwned();
			this.setState({ loading: false });
		});
    };

	__toggleActiveTakeawayOff(restaurant_id){
		this.setState({ loading: true });
        Axios
		.post('https://app.snakyz.com/public/api/store/takeaway-off', {
            token: this.props.store_user.data.auth_token,
            store_id: restaurant_id
		})
		.then((response) => {
			// add new
			this._fetchRestaurantsOwned();
			this.setState({ loading: false });
		});
    };

	render() {

		const { store_user } = this.props;
		// console.log(this.props.store_user);

		return (
			<React.Fragment>
				<TopBar
					has_title={true}
					title="Dashboard"
				/>
				{this.state.loading && <Loading />}
				<div className="pt-50">
					<div className="mt-10">
						{this.state.stores.length > 0 && this.state.stores.map((random_restaurant, index) => (
							<div style={{position: "relative", borderRadius: "8px"}} className="mt-20 block ml-15 mr-15">
								<div className="block-content block-content-full clearfix text-black">
									<div>
										<h5 className="mb-0" style={{ fontWeight: '900' }}>{random_restaurant.name}</h5>
									</div>
									<div className="row mt-10">
										<div className="col-9">
											<h5 className="mb-0" style={{ fontWeight: '500' }}>ON/OFF</h5>
										</div>
										<div  className="col-3">
										<ToggleSwitch checked={random_restaurant.store_active} onChange={() => this.__toggleActiveScheduleOff(random_restaurant.id) } />
										</div>
									</div>
									<div className="row mt-5">
										<div className="col-9">
											<h5 className="mb-0" style={{ fontWeight: '500' }}>Take Away</h5>
										</div>
										<div  className="col-3">
											<ToggleSwitch checked={random_restaurant.self_pickup} onChange={() => this.__toggleActiveTakeawayOff(random_restaurant.id) } />
										</div>
									</div>
								</div>
							</div>
						))}

						<div className="mt-20 ml-15 mr-15" style={{ display: 'flex',  }}>
							<div style={{ height: '80px', backgroundColor: 'white', width: '50vw', borderRadius: "8px" }}>
								<div className="pt-15 pl-15 pr-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ fontSize: '12px' }}> Today Sales </div>
									<div style={{ color: '#fe0b15' }}> <Buy icon="user" /> </div>
								</div>
								<div className="pl-15"> ₹ {this.state.order_count} </div>
							</div>
							<div className="ml-10" style={{ height: '80px', backgroundColor: 'white', width: '50vw', borderRadius: "8px" }}>
								<div className="pt-15 pl-15 pr-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ fontSize: '12px' }}> Total Sales </div>
									<div style={{ color: '#fe0b15' }}> <Calendar icon="user" /> </div>
								</div>
								<div className="pl-15"> ₹ {this.state.sale_amount} </div>
							</div>
						</div>

						{this.state.message &&
							<div style={{position: "relative", borderRadius: "8px"}} className="mt-20 block ml-15 mr-15">
								<div className="block-content block-content-full clearfix text-black">
									<div style={{ display: 'flex' }}>
										<Message />
										<span className="ml-2 mt-1" style={{ fontWeight: 'bolder' }}>Message</span>
									</div>
									<div className="mt-2">
										{this.state.message.message}
									</div>
								</div>
							</div>
						}

						{store_user.chart &&
							<div className="pr-5 bg-white mt-20" style={{
									position: 'relative',
									width: '92%',
									marginLeft: '4%',
									borderRadius: '1%',
									marginBottom: '12vh',
									borderRadius: '8px'
							}}>
								<div className="ml-15 pt-10" style={{ fontSize: '15px', fontWeight: '500' }}>Order Analysis</div>
								<EarningChart data={store_user.chart} />
							</div>
						}
					</div>
				</div>

				<Footer active_home={true} />
            </React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
	order_history: state.store_user.order_history,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo }
)(Dashboard);
