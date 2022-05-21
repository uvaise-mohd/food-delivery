import React, { Component } from "react";
import Ink from "react-ink";
import { ArrowLeft } from 'react-iconly';

class TopBar extends Component {

	static contextTypes = {
		router: () => null,
	};

	render() {
		return (
			<React.Fragment>
				<div className="col-12 p-0 fixed" style={{"WebkitBoxShadow":"0 1px 3px rgba(0, 0, 0, 0.05)","boxShadow":"0 1px 3px rgba(0, 0, 0, 0.05)","zIndex":"9","backgroundColor":"white"}}>
					<div className="block m-0">
						<div className="block-content p-0">
							<div className="search-box">
								{this.props.back &&
									<div className="input-group-prepend">
										<button
											type="button"
											className="btn search-navs-btns"
											style={{ position: "relative" }}
											onClick={() => {
												setTimeout(() => {
													this.context.router.history.goBack();
												}, 200);
											}}
										>
											<ArrowLeft />
											<Ink duration="500" />
										</button>
									</div>
								}
								{this.props.has_title ? (
									<p style={{"display":"flex","alignContent":"center","justifyContent":"center","marginBottom":"0px","height":"4rem","padding":"1%"}}>
										<span className="nav-page-title">{this.props.title}</span>
									</p>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default TopBar;
