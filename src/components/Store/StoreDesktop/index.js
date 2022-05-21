import React, { Component } from "react";

class StoreDesktop extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="content-center text-center text-muted font-w600">
					<div>
						<i className="si si-screen-smartphone mb-2" style={{ fontSize: "4rem", opacity: "0.5" }} />
					</div>
					<div>Only Accessible through mobile device</div>
				</div>
			</React.Fragment>
		);
	}
}

export default StoreDesktop;
