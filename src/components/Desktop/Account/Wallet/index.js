import React, { Component } from "react";
import ContentLoader from "react-content-loader";
import { Redirect } from "react-router";
import TransactionList from "./TransactionList";
import { connect } from "react-redux";
import { getWalletTransactions } from "../../../../services/user/actions";
import { ArrowLeft } from "react-iconly";
import Hero from "../../Hero";
import Footer from "../../Footer";

class Wallet extends Component {
	state = {
		no_transactions: false
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		const { user } = this.props;
		if (user.success) {
			this.props.getWalletTransactions(user.data.auth_token, user.data.id);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.wallet.transactions.length === 0) {
			this.setState({ no_transactions: true });
		}
	}

	render() {
		const { user, wallet } = this.props;

		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		if (!user.success) {
			return <Redirect to={"/desktop/login"} />;
		}
		return (
			<React.Fragment>
				<Hero />
				<div className="bg-white">
					<div className="container">
						<div className="block-content block-content-full pt-20 pb-80 height-100-percent px-15">
							<div className="mt-5 font-w600 text-center d-flex align-items-center justify-content-center mt-50" style={{ height: '40px', borderRadius: '0.8rem', boxShadow: 'rgb(136 136 136) 0px 0px 10px -6px' }}>
								Wallet Amount:{" "}
								<span className="rupees-symbol">₹ {wallet.balance}</span>
							</div>
							{wallet.transactions && wallet.transactions.length === 0 && !this.state.no_transactions && (
								<ContentLoader
									height={600}
									width={400}
									speed={1.2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
									className="mt-20"
								>
									<rect x="0" y="0" rx="0" ry="0" width="75" height="22" />
									<rect x="0" y="30" rx="0" ry="0" width="350" height="18" />
									<rect x="0" y="60" rx="0" ry="0" width="300" height="18" />
									<rect x="0" y="90" rx="0" ry="0" width="100" height="18" />

									<rect x="0" y={0 + 170} rx="0" ry="0" width="75" height="22" />
									<rect x="0" y={30 + 170} rx="0" ry="0" width="350" height="18" />
									<rect x="0" y={60 + 170} rx="0" ry="0" width="300" height="18" />
									<rect x="0" y={90 + 170} rx="0" ry="0" width="100" height="18" />

									<rect x="0" y={0 + 340} rx="0" ry="0" width="75" height="22" />
									<rect x="0" y={30 + 340} rx="0" ry="0" width="350" height="18" />
									<rect x="0" y={60 + 340} rx="0" ry="0" width="300" height="18" />
									<rect x="0" y={90 + 340} rx="0" ry="0" width="100" height="18" />
								</ContentLoader>
							)}
							{wallet.transactions && wallet.transactions.length === 0 && (
								<div className="text-center mt-50 font-w600 text-muted">
									No Transactions Yet
								</div>
							)}

							{wallet.transactions &&
								wallet.transactions.map(transaction => (
									<TransactionList key={transaction.id} transaction={transaction} />
								))}
						</div>
					</div>
				</div>
				<Footer active_account={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	wallet: state.user.wallet
});

export default connect(mapStateToProps, { getWalletTransactions })(Wallet);
