import React, { Component } from "react";
import Items from "../../Items";

class ItemsParent extends Component {
	render() {
		return (
			<React.Fragment>
				<Items restaurant={this.props.match.params.restaurant} history={this.props.history} />
			</React.Fragment>
		);
	}
}

export default ItemsParent;
