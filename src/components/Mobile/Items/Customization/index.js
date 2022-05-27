import React, { Component } from "react";

import Ink from "react-ink";

import Modal from "react-responsive-modal";
import { connect } from "react-redux";

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
		const { product, cartProducts } = this.props;
		return (
			<React.Fragment>
				
				{cartProducts.find((cp) => cp.id === product.id) ===
					undefined && (
					<React.Fragment>
						<button
							type="button"
							className="btn btn-success"
							style={{position: 'relative', backgroundColor:'white', borderRadius: '0.5rem' ,  borderColor: 'gray', color: 'black',"height":"3rem !important","fontSize":"1rem !important","width":"70px",fontWeight:"500"}}

							onClick={this.handlePopupOpen}
						>
							<div className="" style={{color:'#000000', fontWeight:'bold'}}>ADD</div>
							<Ink duration="500" />
						</button>
					</React.Fragment>
				)}

				{cartProducts.find((cp) => cp.id === product.id) !==
					undefined && (
					<React.Fragment>
						<button
							type="button"
							className="btn btn-add-remove"
							style={{
								color: localStorage.getItem("cartColor-bg"),
								width:'30px'
							}}
							onClick={this.handlePopupOpen}
						>
							<div className="btn-dec  pb-1" style={{color:'#000000', backgroundColor:'#fffffff', borderRadius:'0.5rem',fontWeight:'500',fontSize:'15px'}}>+</div>
							<Ink duration="500" />
						</button>
					</React.Fragment>
				)}

				<Modal open={this.state.open} onClose={this.handlePopupClose} closeIconSize={20}>
					<div>
						<h3 className="mb-2">{localStorage.getItem("customizationHeading")}</h3>
						<hr className="mb-30 mt-10" style={{ borderColor: "#ccc" }} />
						{product.addon_categories.map((addon_category) => (
							<div key={addon_category.id}>
								<React.Fragment>
									<p className="addon-category-name mb-2">{addon_category.name}</p>
									{addon_category.addons.length && (
										<React.Fragment>
											{addon_category.addons.map((addon, index) => (
												<React.Fragment key={addon.id}>
													<div className="form-group addon-list">
														<input
															type={
																addon_category.type === "SINGLE" ? "radio" : "checkbox"
															}
															className={
																addon_category.type === "SINGLE"
																	? "magic-radio"
																	: "magic-checkbox"
															}
															name={addon_category.name}
															data-addon-id={addon.id}
															data-addon-name={addon.name}
															value={addon.price}
															defaultChecked={
																addon_category.type === "SINGLE" && index === 0 && true
															}
														/>
														{addon_category.type === "SINGLE" && (
															<label htmlFor={addon.name} />
														)}

														<label className="text addon-label" htmlFor={addon.name}>
															{addon.name}{" "}
															<span className="addon-label-price ml-1">
																{localStorage.getItem("hidePriceWhenZero") === "true" &&
																addon.price === "0.00" ? null : (
																	<React.Fragment>
																		{localStorage.getItem("currencySymbolAlign") ===
																			"left" &&
																			localStorage.getItem("currencyFormat")}
																		{addon.price}{" "}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"right" &&
																			localStorage.getItem("currencyFormat")}
																	</React.Fragment>
																)}
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
								this._processAddons(product);
								this.handlePopupClose();
							}}
							style={{
								backgroundColor: '#fc8019',
								color: localStorage.getItem("cartColorText"),
							}}
						>
							{localStorage.getItem("customizationDoneBtnText")}
						</button>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
});

export default connect(
	mapStateToProps,
)(Customization);
