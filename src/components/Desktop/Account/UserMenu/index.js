import React, { Component } from "react";
import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import { Buy, Location, Logout, Wallet } from "react-iconly";
import Flip from "react-reveal/Flip";
import { Icon } from '@iconify/react';

class UserMenu extends Component {
	state = {
		open: false,
	};
	handleVATNumber = () => {
		this.setState({ open: !this.state.open });
	};

	render() {
		const { pages } = this.props;
		return (
			<React.Fragment>
				<div className="bg-white">
					<h6 className="mx-20 mt-3 text-muted" style={{ fontWeight: 'bolder', opacity: '0.3' }}>Menu</h6>

					<div className="ml-20 my-3">
						<DelayLink to={"/desktop/my-orders"} delay={200}>
							<div className="mb-20" style={{ display: 'flex', alignItems: 'center' }}>
								<div className="my-account-menu-item">
									<Buy />
								</div>
								<div className="ml-2 font-w600">My Orders</div>
							</div>
							{/* <Ink duration="500" /> */}
						</DelayLink>

						<DelayLink to={"/desktop/my-wallet"} delay={200}>
							<div className="mb-20" style={{ display: 'flex', alignItems: 'center' }}>
								<div className="my-account-menu-item">
									<Wallet />
								</div>
								<div className="ml-2 font-w600">Wallet</div>
							</div>
							{/* <Ink duration="500" /> */}
						</DelayLink>

						<DelayLink to={"/desktop/search-location"} delay={200}>
							<div className="mb-20" style={{ display: 'flex', alignItems: 'center' }}>
								<div className="my-account-menu-item">
									<Location />
								</div>
								<div className="ml-2 font-w600">Manage Addresses</div>
							</div>
							{/* <Ink duration="500" /> */}
						</DelayLink>

						<a href="mailto:help@chopze.com">
							<div className="mb-20" style={{ display: 'flex', alignItems: 'center' }}>
								<div className="my-account-menu-item">
									<Icon icon="ic:outline-support-agent" width="25" />
								</div>
								<div className="ml-2 font-w600">Help & Support</div>
							</div>
							{/* <Ink duration="500" /> */}
						</a>
					</div>

					{/* <div className="mx-15 my-3">
						<h6>{localStorage.getItem("accountHelpFaq")}</h6>
						<div className="account-pages">
							{pages.map((page) => (
								<div key={page.id}>
									<PagePopup page={page} />
								</div>
							))}
						</div>
					</div> */}
				</div>
			</React.Fragment>
		);
	}
}

export default UserMenu;
