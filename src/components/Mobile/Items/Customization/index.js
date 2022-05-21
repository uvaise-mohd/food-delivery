import React, { Component } from "react";

import Ink from "react-ink";

import Modal from "react-responsive-modal";

class Customization extends Component {
	state = {
		open: false,
	};

	_processAddons = (product) => {
		let addons = [];
		addons["selectedaddons"] = [];

		let radio = document.querySelectorAll("input[type=radio]:checked");
		for (let i = 0; i < radio.length; i++) {
			addons["selectedaddons"].push({
				addon_category_name: radio[i].name,
				addon_id: radio[i].getAttribute("data-addon-id"),
				addon_name: radio[i].getAttribute("data-addon-name"),
				price: radio[i].value,
			});
		}

		let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
		for (let i = 0; i < checkboxes.length; i++) {
			addons["selectedaddons"].push({
				addon_category_name: checkboxes[i].name,
				addon_id: checkboxes[i].getAttribute("data-addon-id"),
				addon_name: checkboxes[i].getAttribute("data-addon-name"),
				price: checkboxes[i].value,
			});
		}

		this.props.addProduct(Object.assign(addons, product));
	};

	handlePopupOpen = () => {
		this.setState({ open: true });
	};
	handlePopupClose = () => {
		this.setState({ open: false });
		this.props.forceUpdate();
	};
	render() {
		const { product } = this.props;
		// console.log(product)
		return (
			<React.Fragment>
				<button
					type="button"
					style={{"position":"relative","border":"1px solid rgb(255, 72, 72)","color":"rgb(255, 72, 72)","width":"70px","backgroundColor":"rgb(255, 255, 255)","letterSpacing":"0.8px","fontWeight":"bolder","padding":"4px","borderRadius":"0.8rem"}}
					onClick={this.handlePopupOpen}
				>
						ADD
					<Ink duration="500" />
				</button>
				<Modal open={this.state.open} onClose={this.handlePopupClose} closeIconSize={32}>
					<div
						style={{
							marginTop: "5rem",
							textAlign: "left",
						}}
					>
						<h4 className="mb-2">Customizations</h4>
						<hr className="mb-30 mt-10" style={{ borderTop: '1px dashed black' }} />
						{product.addon_categories.map((addon_category) => (
							<div key={addon_category.id} className="addon-category-block">
								<React.Fragment>
									<p className="addon-category-name mb-2">{addon_category.name}</p>
									{addon_category.addons.length && (
										<React.Fragment>
											{addon_category.addons.map((addon, index) => (
												<React.Fragment key={addon.id}>
													<div className="form-group addon-list">
														<input
															type={
																addon_category.type === "Single" ? "radio" : "checkbox"
															}
															className={
																addon_category.type === "Single"
																	? "magic-radio"
																	: "magic-checkbox"
															}
															name={addon_category.name}
															data-addon-id={addon.id}
															data-addon-name={addon.name}
															value={addon.price}
															defaultChecked={
																addon_category.type === "Single" && index === 0 && true
															}
														/>
														{addon_category.type === "Single" && (
															<label htmlFor={addon.name} />
														)}

														<label className="text addon-label" htmlFor={addon.name}>
															{addon.name}{" "}
															<span className="ml-1 font-w600">
																<span className="rupees-symbol">₹</span> {addon.price}
															</span>
														</label>
													</div>
												</React.Fragment>
											))}
										</React.Fragment>
									)}
									<hr />
								</React.Fragment>
							</div>
						))}
						<button
							className="btn btn-lg btn-customization-done"
							onClick={() => {
								product.quantity = 1;
								this._processAddons(product);
								this.handlePopupClose();
							}}
							style={{
								backgroundColor: '#FE0B15',
								color: 'white',
								fontWeight: 'bolder',
								borderRadius: '2rem'
							}}
						>
							ADD TO CART
						</button>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Customization;
