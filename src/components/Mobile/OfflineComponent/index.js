import React, { Component } from "react";

class OfflineComponent extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="bg-white" style={{ height: '100vh' }}>
					<div className="d-flex justify-content-center pt-100 mb-20">
						<img
							className="offline-mode-img text-center"
							src="/assets/img/various/offline.gif"
						/>
					</div>
					<h3 className="text-center font-w700 mb-3">You are Offline</h3>
					<h6 className="text-muted text-center font-size-md">
						Please Connect To The Internet
					</h6>
				</div>
			</React.Fragment>
		);
	}
}

export default OfflineComponent;
