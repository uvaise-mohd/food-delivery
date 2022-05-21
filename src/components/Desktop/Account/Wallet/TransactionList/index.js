import React, { Component } from "react";

import Moment from "react-moment";

class TransactionList extends Component {
	render() {
		const { transaction } = this.props;
		return (
			<React.Fragment>
				<div className="p-20 mt-20" style={{ borderRadius: '0.8rem', boxShadow: 'rgb(136 136 136) 0px 0px 10px -6px' }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<div className="font-w600">
							<span className="rupees-symbol">₹</span>{transaction.amount / 100}
						</div>
						<div>
							{transaction.type === "deposit" && (
								<span style={{ fontWeight: '900', color: '#1ABE30' }}>Credited</span>
							)}
							{transaction.type === "withdraw" && (
								<span style={{ fontWeight: '900', color: '#FE0B15' }}>Debited</span>
							)}
						</div>
					</div>
					<hr style={{ borderTop: '1px dashed #D4D5D7' }} />
					{transaction.meta &&
						<div>{transaction.meta["description"]}</div>
					}
					<div style={{ display: 'flex', justifyContent: 'end' }}>
						<Moment fromNow>{transaction.created_at}</Moment>
					</div>
					{/* <div className="mr-4 font-w700">
							{localStorage.getItem("currencySymbolAlign") === "left" &&
								localStorage.getItem("currencyFormat")}
							{transaction.amount / 100}
							{localStorage.getItem("currencySymbolAlign") === "right" &&
								localStorage.getItem("currencyFormat")}
						</div>
						{transaction.meta &&
							<div className="mr-4">{transaction.meta["description"]}</div>
						}
						<div className="mr-4">
							{localStorage.getItem("showFromNowDate") === "true" ? (
								<Moment fromNow>{transaction.created_at}</Moment>
							) : (
								<Moment format="DD/MM/YYYY hh:mma">{transaction.created_at}</Moment>
							)}
						</div> */}
				</div>
			</React.Fragment>
		);
	}
}

export default TransactionList;
