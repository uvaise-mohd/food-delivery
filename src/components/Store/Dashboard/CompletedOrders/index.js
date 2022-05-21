import React, { Component } from "react";
import Meta from "../../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateStoreUserInfo } from "../../../../services/Store/user/actions";
import Axios from "axios";
import 'react-dragswitch/dist/index.css';
import TopBar from "../TopBar";
import ContentLoader from "react-content-loader";
import Moment from "react-moment";
import DelayLink from "../../../helpers/delayLink";
import { ArrowRight } from 'react-iconly';
import { formatPrice } from "../../../helpers/formatPrice";
import Loading from "../../../helpers/loading";
import {saveAs} from 'file-saver';

class CompletedOrders extends Component {

    state = {
        from: localStorage.getItem('com_from'),
        to: localStorage.getItem('com_to'),
        orders: [],
		loading: false,
    };

	componentDidMount() {
		if (this.state.from && this.state.to) {
			if (this.state.from && this.state.to) {
				this.setState({ loading: true });
				Axios
				.post('https://chopze.com/public/api/store/get-completed-orders', {
					token: this.props.user.auth_token,
					from: this.state.from,
					to: this.state.to
				})
				.then((response) => {
					const orders = response.data.orders;
					this.setState({ loading: false });
					if (orders) {
						this.setState({
							orders: orders
						});
					} else {
						this.setState({
							orders: []
						});
					}
				});
			}
		}
	}

    getOrders = () => {
		if (this.state.from && this.state.to) {
			this.setState({ loading: true });
            Axios
            .post('https://chopze.com/public/api/store/get-completed-orders', {
                token: this.props.user.auth_token,
                from: this.state.from,
                to: this.state.to
            })
            .then((response) => {
                const orders = response.data.orders;
				this.setState({ loading: false });
                if (orders) {
                    this.setState({
                        orders: orders
                    });
                } else {
                    this.setState({
                        orders: []
                    });
                }
            });
        }
    };

    onChangeFrom = (event) => {
		this.setState({ from: event.target.value });
		localStorage.setItem("com_from", event.target.value)
	}

	onChangeTo = (event) => {
		this.setState({ to: event.target.value });
		localStorage.setItem("com_to", event.target.value)
	}

    getTotal(order)
	{
		var total = 0;
		var tax = 0;

		if (order.tax && order.tax > 0) {
			tax = order.tax;
		} else {
			tax = 0;
		}

		total = parseFloat(tax) +parseFloat(order.restaurant_total);

		return formatPrice(total);
	}

	getOrdersTotal()
	{
		let total = 0;

		this.state.orders.forEach(order => {
			total += parseFloat(order.restaurant_total);
			// if (order.tax) {
			// 	total += parseFloat(order.tax);
			// }
			// console.log(order);
		});

		return formatPrice(total);
	}

	render() {

        const { user } = this.props;
        // console.log(user);
        if (!user) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/store/login"} />
			);
		}

		const url = 'https://chopze.com/public/api/store/datewise-order/export?from=' + this.state.from + '&to=' + this.state.to + '&token=' + user.auth_token;

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<TopBar
					back={true}
				/>
				{this.state.loading && <Loading />}
                <React.Fragment>
                    <div className="bg-grey pt-50 pb-20" style={{ minHeight: '100vh' }}>
                        <div className="bg-white ml-15 mr-15 mt-20 p-20" style={{ borderRadius: '8px', height: '190px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>From Date</div>
                                <input value={this.state.from} onChange={this.onChangeFrom} type="date" className="p-5" style={{ color: '#B8B8B8', border: '1px solid #B8B8B8', borderRadius: '8px', width: '155px', backgroundColor: 'white' }} />
                            </div>
                            <div className="mt-20" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>To Date</div>
                                <input value={this.state.to} onChange={this.onChangeTo} type="date" className="p-5" style={{ color: '#B8B8B8', border: '1px solid #B8B8B8', borderRadius: '8px', width: '155px', backgroundColor: 'white' }} />
                            </div>
                            <div className="text-center mt-20">
                                <button onClick={this.getOrders} className="pl-20 pr-20 pt-5 pb-5" style={{ border: '1px solid #FE0B15', borderRadius: '5px', backgroundColor: 'white', color: '#FE0B15' }}>View Orders</button>
                            </div>
                        </div>

                        {this.state.orders.length === 0 ? (
							<div className="text-center text-muted mt-100">
								No Orders For This Date
							</div>
						):(
							<React.Fragment>
								<div className="mt-20" style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div className="ml-15 mt-1" style={{ fontSize: '14px', fontWeight: 'bolder' }}>
										Total Orders: {this.state.orders.length} <br />
										Total Order Value: ₹ {this.getOrdersTotal()}
									</div>
									<a href={url}>
										<button className="pl-20 mt-10 pr-20 pt-5 pb-5 mr-15" style={{ border: '1px solid #00C127', borderRadius: '5px', backgroundColor: 'white', color: '#00C127' }}>Export Orders</button>
									</a>
								</div>
								{this.state.orders.map((order, index) => (
									<React.Fragment key={order.id}>
										<div className="bg-white ml-15 mr-15 mt-15" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #D9D9D9' }}>
											<DelayLink delay={200} to={'/store/order/view/'+ order.unique_order_id}>
												<div className="clearfix text-black" style={{ position: 'relative' }}>
													<div className="row">
														<div className="col-4">
															<div style={{ fontSize: '15px', fontWeight: '500' }}> #{order.unique_order_id.slice(-7)} </div>
															<br />
															<div style={{ fontSize: '13px', fontWeight: '400' }}> <Moment format="hh:mm A">{order.created_at}</Moment> </div>
														</div>
														<div className="col-4">
															<div style={{ fontSize: '12px', fontWeight: '400' }}> Order Value </div>
															<br />
															<div style={{ fontSize: '12px', fontWeight: '400' }}> ₹ {order.restaurant_total} </div>
														</div>
														<div className="col-4" style={{ "textAlignLast":"center" }}>
															<br />
															<ArrowRight icon="home" />
														</div>
													</div>
												</div>
											</DelayLink>
										</div>
									</React.Fragment>
								))}
							</React.Fragment>
						)}
                    </div>
                </React.Fragment>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.store_user.store_user.data,
});

export default connect(
	mapStateToProps,
	{  updateStoreUserInfo }
)(CompletedOrders);
