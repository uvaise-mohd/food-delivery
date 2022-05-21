import React, { Component } from "react";
import Meta from "../../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateStoreUserInfo } from "../../../../services/Store/user/actions";
import Axios from "axios";
import 'react-dragswitch/dist/index.css';
import TopBar from "../TopBar";
import { TickSquare } from 'react-iconly';
import { TimeCircle } from 'react-iconly';
import { Chart } from 'react-iconly';
import EarningChart from "../EarningChart";

class Payout extends Component {

    state = {
        completed_payout: 0,
        pending_payout: 0,
        chart: []
    };

    componentDidMount(){
		this._fetchPayout();
    }

    _fetchPayout(){
        Axios 
		.post('https://chopze.com/public/api/store/fetch-payout-data', {
            token: this.props.user.auth_token,
		})
		.then((response) => {
                const data = response;
                // console.log(data.data.data.completed_payout)
                if(data.data.success){
                    this.setState({
                        completed_payout: data.data.data.completed_payout,
                        pending_payout: data.data.data.pending_payout,
                        chart: data.data.data.chart,
                    });
                }else{
                    this.setState({
                        completed_payout: 0,
                        pending_payout: 0,
                        chart: []
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

		return (
			<React.Fragment>
				<Meta
					ogtype="website"
					ogurl={window.location.href}
				/>
				<TopBar
					back={true}
				/>
                <React.Fragment>
                    <div style={{ height: '102vh' }} className="bg-grey pt-50">
                        <div className="bg-white mt-20 ml-15 mr-15 p-10" style={{ borderRadius: '8px', display: 'flex', height: '75px' }}>
                            <div className="col-10">
                                <div>Completed Payouts</div>
                                <div className="mt-10">₹ {this.state.completed_payout}</div>
                            </div>
                            <div className="col-2 mt-15"> <TickSquare /> </div>
                        </div>

                        <div className="bg-white mt-20 ml-15 mr-15 p-10" style={{ borderRadius: '8px', display: 'flex', height: '75px' }}>
                            <div className="col-10">
                                <div>Pending Payouts</div>
                                <div className="mt-10">₹ {this.state.pending_payout}</div>
                            </div>
                            <div className="col-2 mt-15"> <TimeCircle /> </div>
                        </div>

                        <div className="pr-5 bg-white mt-20" style={{
							position: 'relative',
							width: '92%',
							marginLeft: '4%',
							borderRadius: '1%',
							marginBottom: '3vh',
							borderRadius: '8px'
                        }}>
                            <div className="ml-15 pt-10" style={{ fontSize: '15px', fontWeight: '500', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="col-10">Sales Growth</div>
                                <div className="col-2"><Chart /></div>
                            </div>
                            <EarningChart data={this.state.chart} />
                        </div>
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
)(Payout);
