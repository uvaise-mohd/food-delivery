import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";
import ContentLoader from "react-content-loader";
import Customization from "../Customization";
import { Link } from "react-router-dom";
import RecommendedItems from "./RecommendedItems";
import { connect } from "react-redux";
import { searchItem, clearSearch } from "../../../../services/items/actions";
import { WEBSITE_URL } from "../../../../configs/website";
import { debounce } from "../../../helpers/debounce";
import FuzzySearch from "fuzzy-search";
import { ToggleSwitch } from 'react-dragswitch';
import 'react-dragswitch/dist/index.css';
import { TimeCircle } from "react-iconly";
import { ArrowLeft } from "react-iconly";

class ItemList extends Component {

	static contextTypes = {
		router: () => null,
	};

	state = {
		update: true,
		items_backup: [],
		searching: false,
		data: [],
		filter_items: [],
		items: [],
		all_items: [],
		queryLengthError: false,
		category_index: 0,
		category_name: null,
		is_veg: false,
		is_egg: false,
		restaurant_info: false
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
		window.addEventListener('scroll', this.listenToScroll);

		this.wrapper = React.createRef();

		if (this.props.restaurant_backup_items.items && this.props.restaurant_backup_items.items[0]) {
			this.setState({ category_name: this.props.restaurant_backup_items.items[0].category_name });
		}

		setTimeout(() => {
			if (this.props.restaurant_backup_items.items) {
				this.props.restaurant_backup_items.items.map((category, index) => {
					this[`ref${category.id}`] = React.createRef();
					this[category.id] = React.createRef();
				});
			}
		}, 2000);
	}

	listenToScroll = (e) => {
		if (this.props.restaurant_backup_items.items) {
			this.props.restaurant_backup_items.items.map((category, index) => {
				if (this[`ref${category.id}`] && this[`ref${category.id}`]['current'] && this[`ref${category.id}`]['current']['offsetTop']) {
					if (window.scrollY >= this[`ref${category.id}`]['current']['offsetTop'] - 140) {
						this.setState({
							category_index: index
						})

						if(this.wrapper){
							// console.log(this.wrapper.current);
							const el = document.querySelector('#wrapper');
							// console.log(el)
							el.scrollLeft = this[category.id].current.offsetLeft;
							// console.log(this[category.id].current.offsetLeft)
							// el.scrollRight(this[category.id].current.offsetRight);
						}
						
						
					}
				}
			});
		}

		if (window.scrollY > 50) {
			this.setState({ restaurant_info: true });
		} else {
			this.setState({ restaurant_info: false });
		}
	}

	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			if (this.state.update) {
				this.setState({ update: false });
			} else {
				this.setState({ update: true });
			}
		}, 100);
	};

	searchForItem = (e) => {
		this.searchItem(e.target.value);
	};

	searchItem = debounce((event) => {
		if (event.length >= 3) {
			const searchResultText = "Search Results For: " + event;
			const noSearchFoundText = "No results Found For: " + event;
			let foodItems = [];

			const searcher = new FuzzySearch(this.state.all_items, ["name"], {
				caseSensitive: false,
			});
			foodItems = searcher.search(event);

			if (foodItems.length > 0) {
				this.setState({ items: foodItems });
				this.setState({ category_name: searchResultText });
			} else if (foodItems.length <= 0) {
				this.setState({ items: ['empty'] });
				this.setState({ category_name: noSearchFoundText });
			}

			this.setState({ searching: true, queryLengthError: false });
		} else {
			this.setState({ queryLengthError: true });
		}
		if (event.length === 0) {
			this.setState({ filterText: null, queryLengthError: false });
			// console.log("Cleared");

			this.props.clearSearch(this.state.items_backup);
			this.setState({ searching: false });
			if (this.state.category_index == "all") {
				this.filterItemsAll();
			} else {
				this.filterItems(this.state.category_index);
			}
		}
	}, 500);

	inputFocus = () => {
		this.refs.searchGroup.classList.add("search-shadow-light");
	};

	handleClickOutside = (event) => {
		if (this.refs.searchGroup && !this.refs.searchGroup.contains(event.target)) {
			this.refs.searchGroup.classList.remove("search-shadow-light");
		}
	};

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
		window.removeEventListener('scroll', this.listenToScroll);
	}

	static getDerivedStateFromProps(props, state) {

		if (props.data !== state.data) {
			if (state.filterText !== null) {
				return {
					data: props.data,
				};
			} else if (state.filterText === null) {
				return {
					items_backup: props.data,
					data: props.data,
					filter_items: props.data.items,
				};
			}
		}
		if (props.restaurant_backup_items && state.items >= 0) {
			let arr = [];
			if (props.restaurant_backup_items.hasOwnProperty("items")) {
				Object.keys(props.restaurant_backup_items.items).forEach((keys) => {
					Object.keys(props.restaurant_backup_items.items[keys].items).forEach((item) => {
						arr.push(props.restaurant_backup_items.items[keys].items[item]);
					});
				});
			}

			return { items: arr, all_items: arr };
		}

		return null;
	}

	filterVeg = (c) => {
		this.setState({ is_veg: c, searching: true });
		if (!c && !this.state.is_egg) {
			this.setState({ searching: false });
		}
		// if (this.state.category_index == "all") {
		setTimeout(() => {
			this.filterItemsAll();
		}, 100);
		// } else {
		// 	setTimeout(() => {
		// 		this.filterItems(this.state.category_index);
		// 	}, 100);
		// }
	}

	filterEgg = (c) => {
		this.setState({ is_egg: c, searching: true });
		if (!this.state.is_veg && !c) {
			this.setState({ searching: false });
		}
		// if (this.state.category_index == "all") {
		setTimeout(() => {
			this.filterItemsAll();
		}, 100);
		// } else {
		// 	setTimeout(() => {
		// 		this.filterItems(this.state.category_index);
		// 	}, 100);
		// }
	}

	filterItems = (index) => {
		let arr = [];
		Object.keys(this.props.restaurant_backup_items.items[index].items).forEach((item) => {
			arr.push(this.props.restaurant_backup_items.items[index].items[item]);
		});

		if (arr.length) {
			if (!this.state.is_veg && !this.state.is_egg) {
				this.setState({ items: arr });
			}

			if (this.state.is_veg && this.state.is_egg) {
				let finalArr = [];
				Object.keys(arr).forEach((key) => {
					if (arr[key].is_veg == 1 && arr[key].is_egg == 1) {
						finalArr.push(arr[key]);
					}
				})
				if (finalArr.length) {
					this.setState({ items: finalArr });
				} else {
					this.setState({ items: ['empty'] });
				}
			}

			if (this.state.is_veg && !this.state.is_egg) {
				let finalArr = [];
				Object.keys(arr).forEach((key) => {
					if (arr[key].is_veg == 1 && arr[key].is_egg == 0) {
						finalArr.push(arr[key]);
					}
				})
				if (finalArr.length) {
					this.setState({ items: finalArr });
				} else {
					this.setState({ items: ['empty'] });
				}
			}

			if (!this.state.is_veg && this.state.is_egg) {
				let finalArr = [];
				Object.keys(arr).forEach((key) => {
					if (arr[key].is_veg == 0 && arr[key].is_egg == 1) {
						finalArr.push(arr[key]);
					}
				})
				if (finalArr.length) {
					this.setState({ items: finalArr });
				} else {
					this.setState({ items: ['empty'] });
				}
			}
		} else {
			this.setState({ items: ['empty'] });
		}

		this.setState({ category_index: index, category_name: this.props.restaurant_backup_items.items[index].category_name });
	};

	filterItemsAll = () => {
		let arr = [];
		Object.keys(this.props.restaurant_backup_items.items).forEach((keys) => {
			Object.keys(this.props.restaurant_backup_items.items[keys].items).forEach((item) => {
				arr.push(this.props.restaurant_backup_items.items[keys].items[item]);
			});
		});

		if (arr.length) {
			if (!this.state.is_veg && !this.state.is_egg) {
				this.setState({ items: arr });
			}

			if (this.state.is_veg && this.state.is_egg) {
				let finalArr = [];
				Object.keys(arr).forEach((key) => {
					if (arr[key].is_veg == 1 && arr[key].is_egg == 1) {
						finalArr.push(arr[key]);
					}
				})
				if (finalArr.length) {
					this.setState({ items: finalArr });
				} else {
					this.setState({ items: ['empty'] });
				}
			}

			if (this.state.is_veg && !this.state.is_egg) {
				let finalArr = [];
				Object.keys(arr).forEach((key) => {
					if (arr[key].is_veg == 1 && arr[key].is_egg == 0) {
						finalArr.push(arr[key]);
					}
				})
				if (finalArr.length) {
					this.setState({ items: finalArr });
				} else {
					this.setState({ items: ['empty'] });
				}
			}

			if (!this.state.is_veg && this.state.is_egg) {
				let finalArr = [];
				Object.keys(arr).forEach((key) => {
					if (arr[key].is_veg == 0 && arr[key].is_egg == 1) {
						finalArr.push(arr[key]);
					}
				})
				if (finalArr.length) {
					this.setState({ items: finalArr });
				} else {
					this.setState({ items: ['empty'] });
				}
			}
		} else {
			this.setState({ items: ['empty'] });
		}

		this.setState({ category_index: "all", category_name: "All" });
	};

	scrollTo(e) {
		window.scrollTo({ top: e, behavior: 'smooth' })
	}

	shouldComponentUpdate(nextProps, nextState) {

		// if (nextProps) {
		// 	this.forceStateUpdate()
		// }
		if (nextState !== this.state.data) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		const { addProduct, removeProduct, cartProducts, restaurant } = this.props;
		// const { data } = this.state;
		// console.log(data)

		return (
			<React.Fragment>
				<div className="pb-10 pt-10" style={{ position: 'sticky', top: '-50px', zIndex: '999', backgroundColor: '#ffffff' }}>
					<div className="input-group" ref="searchGroup" onClick={this.inputFocus}>
						<input
							type="text"
							className="form-control items-search-box"
							placeholder="Search Food Here"
							onChange={this.searchForItem}
						/>
					</div>
				</div>
				<div>
					{this.state.queryLengthError && (
						<div className="auth-error-desktop">
							<div className="">Enter at least 3 characters to search.</div>
						</div>
					)}
				</div>

				<div className={`mt-10 ${restaurant && !restaurant.certificate ? "mb-100" : null}`}>
					{!this.state.searching && (
						<div>
							{!this.props.restaurant_backup_items.recommended ? (
								<ContentLoader
									height={240}
									width={200}
									speed={1.2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>
									<rect x="10" y="22" rx="4" ry="4" width="185" height="137" />
									<rect x="10" y="168" rx="0" ry="0" width="119" height="18" />
									<rect x="10" y="193" rx="0" ry="0" width="79" height="18" />

									<rect x="212" y="22" rx="4" ry="4" width="185" height="137" />
									<rect x="212" y="168" rx="0" ry="0" width="119" height="18" />
									<rect x="212" y="193" rx="0" ry="0" width="79" height="18" />

									<rect x="10" y="272" rx="4" ry="4" width="185" height="137" />
									<rect x="10" y="418" rx="0" ry="0" width="119" height="18" />
									<rect x="10" y="443" rx="0" ry="0" width="79" height="18" />

									<rect x="212" y="272" rx="4" ry="4" width="185" height="137" />
									<rect x="212" y="418" rx="0" ry="0" width="119" height="18" />
									<rect x="212" y="443" rx="0" ry="0" width="79" height="18" />
								</ContentLoader>
							) : null}
							{this.props.restaurant_backup_items.recommended && this.props.restaurant_backup_items.recommended.length > 0 && (
								<h3 className="pt-10 recommended-text">
									Recommended
								</h3>
							)}

							<div
								className="mt-4 ml-15 mr-15"
								style={{
									display: "grid",
									gridTemplateRows: "auto auto",
									gridAutoFlow: "column",
									overflowX: "scroll",
									// columnGap: "20px",
									height: "auto",
									alignItems: "center",
								}}
							>
								{!this.props.restaurant_backup_items.recommended
									? null
									: this.props.restaurant_backup_items.recommended.map((item) => (
										<RecommendedItems
											restaurant={restaurant}
											shouldUpdate={this.state.update}
											update={this.forceStateUpdate}
											product={item}
											addProduct={addProduct}
											removeProduct={removeProduct}
											key={item.id}
										/>
									))}
							</div>
						</div>
					)}

					<div className="ml-20 mt-20 mb-20">
						<ToggleSwitch checked={this.state.is_veg} onChange={c => this.filterVeg(c)} />
						<span className="font-w600 ml-2">Veg</span>
						<ToggleSwitch className="ml-20" checked={this.state.is_egg} onChange={c => this.filterEgg(c)} />
						<span className="font-w600 ml-2">Egg</span>
					</div>

					{!this.state.searching && (
						<div className="pl-15 pr-15 pt-5 pb-10 slider-wrapper" id="wrapper" style={{ display: 'flex', alignItems: 'center',overflow: 'scroll',whiteSpace: 'nowrap', position: 'sticky', top: '60px', zIndex: '999', backgroundColor: '#ffffff' }}>
							{/* <div className="pt-10 pb-10 pl-20 pr-20 mr-20"
								style={{
									backgroundColor: this.state.category_index == "all" ? '#FF0036' : '#ffffff', borderRadius: '0.5rem', fontWeight: 'bolder',
									color: this.state.category_index == "all" ? '#ffffff' : '#000000', letterSpacing: '1px', boxShadow: 'rgb(136 136 136) 0px 0px 10px -4px'
								}}
								onClick={() => this.filterItemsAll()}>
								All
							</div> */}
							{this.props.restaurant_backup_items && this.props.restaurant_backup_items.items && this.props.restaurant_backup_items.items.map((category, index) =>
								<div className="pt-10 pb-10 pl-15 pr-15 mr-15"
									key={index}
									style={{
										backgroundColor: this.state.category_index == index ? '#FF0036' : '#ffffff', borderRadius: '0.5rem', fontWeight: 'bolder', fontSize: '13px',
										color: this.state.category_index == index ? '#ffffff' : '#000000', letterSpacing: '1px', boxShadow: 'rgb(136 136 136) 0px 0px 10px -4px'
									}}
									ref={this[category.id]}
									onClick={() => {
										if (this[`ref${category.id}`] && this[`ref${category.id}`]['current']) {
											this.scrollTo(this[`ref${category.id}`]['current']['offsetTop'] - 140)
										}
										this.setState({
											category_index: index
										})
									}}>
									{category.category_name}
								</div>
							)}
						</div>
					)}

					{/* <div style={{ fontWeight: 'bolder', letterSpacing: '1px' }} className="ml-20 mt-20">
						{this.state.category_name}
					</div> */}

					{(!this.state.searching && this.props.restaurant_backup_items.items && this.props.restaurant_backup_items.items.length > 0 && this.props.restaurant_backup_items.items[0] != "empty") ? (
						<div className="ml-20 mr-20">
							<React.Fragment>
								{/* <div className="ml-20 mr-20"> */}
								{this.props.restaurant_backup_items.items.map((category, index) =>
									<React.Fragment key={index}>
										<div ref={this[`ref${category.id}`]} style={{ fontWeight: 'bolder', letterSpacing: '1px', color: localStorage.getItem("storeColor") }} className="mt-20">
											{category.category_name}
										</div>

										{Object.values(category.items).map((product, index) =>
											<React.Fragment key={index}>
												<hr />
												<div style={{ display: 'flex', justifyContent: 'space-between' }}>
													<div>
														<Link to={restaurant.slug + "/" + product.id}>
															<div>
																<div>
																	{product.is_veg || product.is_egg ? (
																		<React.Fragment>
																			{product.is_veg ? (
																				<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
																			) : (
																				<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
																			)}
																		</React.Fragment>
																	) : (
																		<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
																	)}
																</div>
																<div className="font-w600 mt-2" style={{ fontSize: '15px' }}>{product.name}</div>
																<div className="text-muted">{product.description}</div>
																<div className="mt-1" style={{ display: 'flex', alignItems: 'center' }}>
																	<div className="mr-5" style={{ fontWeight: '600', fontSize: '12px' }}>
																		<span className="rupees-symbol">₹ </span>{product.price}
																	</div>
																	{product.old_price && product.old_price > 0 &&
																		<div style={{ color: 'red', textDecoration: 'line-through', fontSize: '9px' }}>
																			<span className="rupees-symbol">₹ </span>{product.old_price}
																		</div>
																	}
																</div>
																{product.addon_categories.length > 0 && (
																	<span
																		className="text-muted mt-1"
																		style={{ "fontWeight": "400", "fontSize": "0.8rem", "opacity": "0.8" }}
																	>
																		Customizable
																	</span>
																)}
															</div>
														</Link>
													</div>
													<div>
														<div className="mb-10 mr-10" key={product.id}>
															{product.image &&
																<Link to={restaurant.slug + "/" + product.id}>
																	<img style={{ height: '150px', width: '150px', objectFit: 'cover', borderRadius: '0.8rem' }} src={WEBSITE_URL + "/assets/img/items/" + product.image} alt={product.name} />
																</Link>
															}
														</div>
														<div style={{ position: 'relative', textAlign: 'center', marginTop: product.image ? '-25px' : '35px', left: '20px', width: '110px' }}>
															{cartProducts.find((cp) => cp.id === product.id) !==
																undefined && (
																	<React.Fragment>
																		<div className="item-actions mt-2">
																			<div
																				className="btn-group btn-group-sm"
																				role="group"
																				aria-label="btnGroupIcons1"
																				style={{ borderRadius: "0.5rem" }}
																			>
																				{product.is_active ? (
																					<React.Fragment>
																						{product.addon_categories.length ? (
																							null
																						) : (
																							<button
																								type="button"
																								className="btn btn-add-remove"
																								style={{ "width": "30px", "borderBottom": "1px solid #FF4848", "borderLeft": "1px solid #FF4848", "borderTop": "1px solid #FF4848", "borderTopLeftRadius": "0.8rem", "borderBottomLeftRadius": "0.8rem" }}
																								onClick={() => {
																									product.quantity = 1;
																									removeProduct(product);
																									this.forceStateUpdate();
																								}}
																							>
																								<span class="btn-dec">-</span>
																								{/* <Ink duration="500" /> */}
																							</button>
																						)}
																						{product.addon_categories.length ? null : (
																							<span
																								className="pl-2 pr-2"
																								style={{ "border": "none", "width": "10px", "color": "#FF4848", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontWeight": "600", "fontSize": "1rem", "borderTop": "1px solid #FF4848", "borderBottom": "1px solid #FF4848", "backgroundColor": "rgb(255, 255, 255)" }}
																							>
																								<React.Fragment>
																									{
																										cartProducts.find(
																											(cp) => cp.id === product.id
																										).quantity
																									}
																								</React.Fragment>
																							</span>
																						)}

																						{product.addon_categories.length ? (
																							<Customization
																								product={product}
																								addProduct={addProduct}
																								forceUpdate={this.forceStateUpdate}
																							/>
																						) : (
																							<button
																								type="button"
																								className="btn btn-add-remove"
																								style={{ "width": "30px", "color": "#FF4848", "borderTopRightRadius": "0.8rem", "borderBottomRightRadius": "0.8rem", "borderTop": "1px solid #FF4848", "borderRight": "1px solid #FF4848", "borderBottom": "1px solid #FF4848" }}
																								onClick={() => {
																									addProduct(product);
																									this.forceStateUpdate();
																								}}
																							>
																								<span class="btn-dec">+</span>
																								{/* <Ink duration="500" /> */}
																							</button>
																						)}
																					</React.Fragment>
																				) : (
																					<div className="robo text-danger text-item-not-available">
																						Item Not Available
																					</div>
																				)}
																			</div>
																		</div>
																	</React.Fragment>
																)}

															{cartProducts.find((cp) => cp.id === product.id) ===
																undefined && (
																	<React.Fragment>
																		<div className="item-actions mt-2">
																			{product.is_active ? (
																				<React.Fragment>
																					{product.addon_categories.length ? (
																						<Customization
																							product={product}
																							addProduct={addProduct}
																							forceUpdate={this.forceStateUpdate}
																						/>
																					) : (
																						<button
																							type="button"
																							style={{ "position": "relative", "border": "1px solid rgb(255, 72, 72)", "color": "rgb(255, 72, 72)", "width": "70px", "backgroundColor": "rgb(255, 255, 255)", "letterSpacing": "0.8px", "fontWeight": "bolder", "padding": "4px", "borderRadius": "0.8rem" }}
																							onClick={() => {
																								product.quantity = 1;
																								addProduct(product);
																								this.forceStateUpdate();
																							}}
																						>
																							ADD
																							{/* <Ink duration="500" /> */}
																						</button>
																					)}
																				</React.Fragment>
																			) : (
																				<div className="robo text-danger text-item-not-available">
																					Item Not Available
																				</div>
																			)}
																		</div>
																	</React.Fragment>
																)}
														</div>
													</div>
												</div>
											</React.Fragment>
										)}
									</React.Fragment>
								)}
								{/* </div> */}
							</React.Fragment>
						</div>
					) : (
						<React.Fragment>
							{!this.state.searching &&
								<div className="text-center text-muted mt-50">No Items Available</div>
							}
						</React.Fragment>
					)}

					<div className="ml-20 mr-20">
						{this.state.searching && (
							<React.Fragment>
								{this.state.items.length && this.state.items[0] != 'empty' ? (

									<React.Fragment>
										{/* {console.log( this.state.items)} */}
										{this.state.items.map((product) =>
											<React.Fragment>
												<hr />
												<div style={{ display: 'flex', justifyContent: 'space-between' }}>
													<div>
														<Link to={restaurant.slug + "/" + product.id}>
															<div>
																<div>
																	{product.is_veg || product.is_egg ? (
																		<React.Fragment>
																			{product.is_veg ? (
																				<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
																			) : (
																				<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
																			)}
																		</React.Fragment>
																	) : (
																		<img className="mt-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
																	)}
																</div>
																<div className="font-w600 mt-2" style={{ fontSize: '15px' }}>{product.name}</div>
																<div className="text-muted">{product.description}</div>
																<div className="mt-1" style={{ display: 'flex', alignItems: 'center' }}>
																	<div className="mr-5" style={{ fontWeight: '600', fontSize: '12px' }}>
																		<span className="rupees-symbol">₹ </span>{product.price}
																	</div>
																	{product.old_price && product.old_price > 0 &&
																		<div style={{ color: 'red', textDecoration: 'line-through', fontSize: '9px' }}>
																			<span className="rupees-symbol">₹ </span>{product.old_price}
																		</div>
																	}
																</div>
																{product.addon_categories && product.addon_categories.length > 0 && (
																	<span
																		className="text-muted mt-1"
																		style={{ "fontWeight": "400", "fontSize": "0.8rem", "opacity": "0.8" }}
																	>
																		Customizable
																	</span>
																)}
															</div>
														</Link>
													</div>
													<div>
														<div className="mb-10 mr-10" key={product.id}>
															{product.image &&
																<Link to={restaurant.slug + "/" + product.id}>
																	<img style={{ height: '110px', width: '110px', objectFit: 'cover', borderRadius: '0.8rem' }} src={WEBSITE_URL + "/assets/img/items/" + product.image} alt={product.name} />
																</Link>
															}
														</div>
														<div style={{ position: 'relative', textAlign: 'center', marginTop: product.image ? '-25px' : '35px', width: '110px' }}>
															{cartProducts.find((cp) => cp.id === product.id) !==
																undefined && (
																	<React.Fragment>
																		<div className="item-actions mt-2">
																			<div
																				className="btn-group btn-group-sm"
																				role="group"
																				aria-label="btnGroupIcons1"
																				style={{ borderRadius: "0.5rem" }}
																			>
																				{product.is_active ? (
																					<React.Fragment>
																						{product.addon_categories.length ? (
																							null
																						) : (
																							<button
																								type="button"
																								className="btn btn-add-remove"
																								style={{ "width": "30px", "borderBottom": "1px solid #FF4848", "borderLeft": "1px solid #FF4848", "borderTop": "1px solid #FF4848", "borderTopLeftRadius": "0.8rem", "borderBottomLeftRadius": "0.8rem" }}
																								onClick={() => {
																									product.quantity = 1;
																									removeProduct(product);
																									this.forceStateUpdate();
																								}}
																							>
																								<span class="btn-dec">-</span>
																								{/* <Ink duration="500" /> */}
																							</button>
																						)}
																						{product.addon_categories.length ? null : (
																							<span
																								className="pl-2 pr-2"
																								style={{ "border": "none", "width": "10px", "color": "#FF4848", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontWeight": "600", "fontSize": "1rem", "borderTop": "1px solid #FF4848", "borderBottom": "1px solid #FF4848", "backgroundColor": "rgb(255, 255, 255)" }}
																							>
																								<React.Fragment>
																									{
																										cartProducts.find(
																											(cp) => cp.id === product.id
																										).quantity
																									}
																								</React.Fragment>
																							</span>
																						)}

																						{product.addon_categories.length ? (
																							<Customization
																								product={product}
																								addProduct={addProduct}
																								forceUpdate={this.forceStateUpdate}
																							/>
																						) : (
																							<button
																								type="button"
																								className="btn btn-add-remove"
																								style={{ "width": "30px", "color": "#FF4848", "borderTopRightRadius": "0.8rem", "borderBottomRightRadius": "0.8rem", "borderTop": "1px solid #FF4848", "borderRight": "1px solid #FF4848", "borderBottom": "1px solid #FF4848" }}
																								onClick={() => {
																									addProduct(product);
																									this.forceStateUpdate();
																								}}
																							>
																								<span class="btn-dec">+</span>
																								{/* <Ink duration="500" /> */}
																							</button>
																						)}
																					</React.Fragment>
																				) : (
																					<div className="robo text-danger text-item-not-available">
																						Item Not Available
																					</div>
																				)}
																			</div>
																		</div>
																	</React.Fragment>
																)}

															{cartProducts.find((cp) => cp.id === product.id) ===
																undefined && (
																	<React.Fragment>
																		<div className="item-actions mt-2">
																			{product.is_active ? (
																				<React.Fragment>
																					{product.addon_categories.length ? (
																						<Customization
																							product={product}
																							addProduct={addProduct}
																							forceUpdate={this.forceStateUpdate}
																						/>
																					) : (
																						<button
																							type="button"
																							style={{ "position": "relative", "border": "1px solid rgb(255, 72, 72)", "color": "rgb(255, 72, 72)", "width": "70px", "backgroundColor": "rgb(255, 255, 255)", "letterSpacing": "0.8px", "fontWeight": "bolder", "padding": "4px", "borderRadius": "0.8rem" }}
																							onClick={() => {
																								product.quantity = 1;
																								addProduct(product);
																								this.forceStateUpdate();
																							}}
																						>
																							ADD
																							{/* <Ink duration="500" /> */}
																						</button>
																					)}
																				</React.Fragment>
																			) : (
																				<div className="robo text-danger text-item-not-available">
																					Item Not Available
																				</div>
																			)}
																		</div>
																	</React.Fragment>
																)}
														</div>
													</div>
												</div>
											</React.Fragment>
										)}
									</React.Fragment>
								) : (
									<div className="text-center text-muted mt-50">No Items Available</div>
								)}
							</React.Fragment>
						)}
					</div>

					<div className="mb-50" />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
	items: state.items.restaurant_items
});

export default connect(
	mapStateToProps,
	{ addProduct, removeProduct, searchItem, clearSearch }
)(ItemList);
