import React, { Component } from "react";
import Ink from "react-ink";
import { ChevronLeft } from "react-iconly";

class UserBan extends Component {

	static contextTypes = {
		router: () => null,
	};

	render() {
		return (
			<React.Fragment>
				<div className="bg-white" style={{ minHeight: '100vh' }}>
					<button
						type="button"
						className="btn search-navs-btns"
						style={{ "position": "absolute", "borderRadius": "50%", "height": "3rem", "top": "2vh", "width": "3rem", "left": "2vh" }}
						onClick={() => this.context.router.history.push('/')}
					>
						<ChevronLeft size="medium" style={{ marginLeft: '-0.5rem' }} />
						<Ink duration="500" />
					</button>
					<div className="d-flex justify-content-center pt-200 mb-50">
						<img
							className="offline-mode-img text-center"
							src="/assets/img/various/user-ban.png"
							alt="user-ban"
						/>
					</div>

					<div className="text-center">
						<h5>You can not place this order at the moment</h5>
						<h6>Please connect with the support team for further information...</h6>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default UserBan;
