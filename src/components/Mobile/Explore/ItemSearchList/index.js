import React, { Component } from "react";

import { Link } from "react-router-dom";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";
import { WEBSITE_URL } from "../../../../configs/website";

class ItemSearchList extends Component {
	render() {
		const { items } = this.props;
		// console.log(items);

		return (
			<React.Fragment>
				<div className="bg-white mb-50 mt-10">
					<h4 className="px-15 mb-1">Foods</h4>
					{items.map((item) => (
						<div key={item.id} className="col-xs-12 col-sm-12 restaurant-block">
							<Link
								to={{
									pathname: "../stores/" + item.store.slug + "/" + item.id,
									state: {
										fromExplorePage: true,
									},
								}}
								style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
								className="block-content block-content-full pt-2"
							>
								<div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div>
											{item.is_veg || item.is_egg ? (
												<React.Fragment>
													{item.is_veg ? (
														<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
													) : (
														<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
													)}
												</React.Fragment>
											) : (
												<img className="mt-2" style={{ height: '1rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
											)}
										</div>
										<div className="mt-3 ml-2" style={{ fontWeight: 'bolder', fontSize: '14px' }}>
											{item.name}
										</div>
									</div>
									<div className="mt-1" style={{ color: '#7E7E7E', fontSize: '12px' }}>
										{item.description}
									</div>
									<div className="mt-1" style={{ display: 'flex', alignItems: 'center' }}>
										<div className="mr-5" style={{ fontWeight: '600', fontSize: '13px' }}>
											<span className="rupees-symbol">₹ </span>{item.price}
										</div>
										{item.old_price && item.old_price > 0 &&
											<div style={{ color: 'red', textDecoration: 'line-through', fontSize: '10px' }}>
												<span className="rupees-symbol">₹ </span>{item.old_price}
											</div>
										}
									</div>
								</div>
								<div>
									{item.image !== null && (
										<LazyLoad>
											<img style={{ borderRadius: '0.8rem', height: '90px' }} src={WEBSITE_URL + "/assets/img/items/" + item.image} alt={item.name} className="restaurant-image mt-0" />
										</LazyLoad>
									)}
								</div>
								<Ink duration="500" />
							</Link>
						</div>
					))}
				</div>
			</React.Fragment>
		);
	}
}

export default ItemSearchList;
