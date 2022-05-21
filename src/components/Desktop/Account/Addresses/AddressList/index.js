import React, { Component } from "react";

import Ink from "react-ink";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Zoom from "@material-ui/core/Zoom";
import { Delete } from "react-iconly";

class AddressList extends Component {
	state = {
		dropdownItem: null,
	};

	handleSetDefaultAddress = (e, address) => {
		if (!e.target.classList.contains("si")) {
			this.props.handleSetDefaultAddress(address.id, address);
		}
	};

	handleDropdown = (event) => {
		this.setState({ dropdownItem: event.currentTarget });
	};

	handleDropdownClose = () => {
		this.setState({ dropdownItem: null });
	};

	render() {
		const { user, address } = this.props;
		return (
			<React.Fragment>
				<div
					className={
						!address.is_operational && this.props.fromCartPage
							? "bg-white single-address-card-desktop p-15 d-flex no-click"
							: "bg-white single-address-card-desktop p-15 d-flex"
					}
					onClick={(e) => this.handleSetDefaultAddress(e, address)}
					style={{ position: "relative", borderRadius: '10px', boxShadow: '0px 0px 3px 2px rgb(0 0 0 / 5%)' }}
				>
					<div
						className={
							!address.is_operational && this.props.fromCartPage ? "address-not-usable w-100" : "w-100"
						}
					>
						{user.data.default_address_id === address.id ? (
							<button
								className="btn btn-sm pull-right btn-address-default p-0 m-0"
								style={{ border: "0", right: "0px", fontSize: "1.3rem", position: 'relative', zIndex: '999' }}
							>
								<Delete size="small"
									style={{
										color: '#FF4848',
									}}
								/>
								<Ink duration={200} />
							</button>
						) : (
							<React.Fragment>
								{this.props.fromCartPage && (
									<React.Fragment>
										{!address.is_operational && (
											<span className="text-danger text-uppercase font-w600 text-sm08">
												{" "}
												<i className="si si-close" />{" "}
												{localStorage.getItem("addressDoesnotDeliverToText")}
											</span>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						)}

						{address.tag !== null && (
							<h6 className="m-0 text-uppercase">
								<strong>{address.tag}</strong>
							</h6>
						)}
						<div>
							{address.house !== null && (
								<p className="m-0 text-capitalize">
									{address.tag === null ? (
										<strong>{address.house}</strong>
									) : (
										<span>{address.house}</span>
									)}
								</p>
							)}
							<p className="m-0 text-capitalize text-sm08">{address.address}</p>
						</div>
					</div>

					<div>
						{!this.props.fromCartPage && this.props.deleteButton && (
							<React.Fragment>
								{user.data.default_address_id !== address.id && (
									<button
										className="btn btn-sm pull-right btn-address-default p-0 m-0 btn-delete-address"
										style={{ border: "0", right: "0px", fontSize: "1.3rem", zIndex: 2 }}
									>
										<i
											className="si si-trash"
											style={{ fontSize: "1.3rem" }}
											onClick={this.handleDropdown}
										/>
									</button>
								)}
							</React.Fragment>
						)}
					</div>
					<Ink duration={500} hasTouch={true} />
				</div>
				<Menu
					id="simple-menu"
					keepMounted
					anchorEl={this.state.dropdownItem}
					open={Boolean(this.state.dropdownItem)}
					onClose={this.handleDropdownClose}
					TransitionComponent={Zoom}
					MenuListProps={{ disablePadding: true }}
					elevation={3}
					getContentAnchorEl={null}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					<MenuItem
						onClick={() => {
							this.props.handleDeleteAddress(address.id);
							this.handleDropdownClose();
						}}
					>
						{localStorage.getItem("deleteAddressText")}
					</MenuItem>
				</Menu>
			</React.Fragment>
		);
	}
}

export default AddressList;
