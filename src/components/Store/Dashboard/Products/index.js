import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../services/Store/user/actions";
import { connect } from "react-redux";
import Footer from "../Footer";
import TopBar from "../TopBar";
import axios from "axios";
import DelayLink from "../../../helpers/delayLink";
import ContentLoader from "react-content-loader"
import LazyLoad from "react-lazyload";
import Search from "./Search"
import { ToggleSwitch } from 'react-dragswitch'
import 'react-dragswitch/dist/index.css';
import Collapsible from "react-collapsible";
import { PaperPlus } from 'react-iconly';
import { Link } from "react-router-dom";
import Loading from "../../../helpers/loading";

class Products extends Component {

	state = {
		data: [],
		loading: false
	};

	componentDidMount(){
        this.__fetchProducts();
	}

    __fetchProducts(){
        axios
		.post('https://chopze.com/public/api/store/get-store-products', {
			token: this.props.store_user.data.auth_token
		})
		.then((response) => {
			const data = response.data.categorisedArray;
			if (data.length) {
				// add new
				this.setState({
					data: data,

				});

			} else {
				this.setState({
					data: [],
				});
			}
		});
    };

    __toogleActive(product_id){
		this.setState({ loading: true });
        axios
		.post('https://chopze.com/public/api/store/toogle-product', {
            token: this.props.store_user.data.auth_token,
            product_id: product_id
		})
		.then((response) => {
				// add new
				this.__fetchProducts();
				this.setState({ loading: false });
		});
    };

	__toogleActiveCategory(id, is_active){
		this.setState({ loading: true });
        axios
		.post('https://chopze.com/public/api/store/toogle-item-category', {
            token: this.props.store_user.data.auth_token,
            id: id,
            is_active: is_active
		})
		.then((response) => {
				// add new
				this.__fetchProducts();
				this.setState({ loading: false });
		});
    };

	checkCategory = (index) => {
		const category = this.state.data[index];
		var toggle = false;
		Object.values(category.items).forEach(element => {
			// console.log(element.is_active);
			if (element.is_active == 1) {
				toggle = true;
			}
		});

		return toggle;
	}

	render() {

		const { store_user } = this.props;
		// console.log(this.state.data);

		return (
			<React.Fragment>
            <TopBar
				has_title={true}
				title="Inventory"
			/>
			{this.state.loading && <Loading />}
			<div>
                <div className="pt-50 bg-grey " style={{ minHeight: '100vh' }}>

					<div className="mt-20 ml-15 mr-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Link to="/store/add-item">
							<div style={{ backgroundColor: 'white', color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '45vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px', fontWeight: '600', paddingLeft: '10vw' }}><PaperPlus /><span className="mt-1 ml-2">New Item</span></div>
						</Link>
						<Link to="/store/add-item-category">
							<div style={{ backgroundColor: 'white', color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '45vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px', fontWeight: '600', paddingLeft: '5vw' }}><PaperPlus /><span className="mt-1 ml-2">Item Category</span></div>
						</Link>
					</div>
					<div className="mt-20 ml-15 mr-15" style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Link to="/store/add-addon">
							<div style={{ backgroundColor: 'white', color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '45vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px', fontWeight: '600', paddingLeft: '8vw' }}><PaperPlus /><span className="mt-1 ml-2">New Addon</span></div>
						</Link>
						<Link to="/store/add-addon-category">
							<div style={{ backgroundColor: 'white', color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '45vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px', fontWeight: '600', paddingLeft: '3vw' }}><PaperPlus /><span className="mt-1 ml-2">Addon Category</span></div>
						</Link>
					</div>

                	<Search auth_token={this.props.store_user.data.auth_token} />

                	{this.state.data.length === 0 ? (
				 		<ContentLoader viewBox="0 0 500 700" height={700} width={500} >
							<circle cx="70.2" cy="73.2" r="41.3" />
							<rect x="129.9" y="29.5" width="125.5" height="17" />
							<rect x="129.9" y="64.7" width="296" height="17" />
							<rect x="129.9" y="97.8" width="253.5" height="17" />
							<rect x="129.9" y="132.3" width="212.5" height="17" />

							<circle cx="70.7" cy="243.5" r="41.3" />
							<rect x="130.4" y="199.9" width="125.5" height="17" />
							<rect x="130.4" y="235" width="296" height="17" />
							<rect x="130.4" y="268.2" width="253.5" height="17" />
							<rect x="130.4" y="302.6" width="212.5" height="17" />

							<circle cx="70.7" cy="412.7" r="41.3" />
							<rect x="130.4" y="369" width="125.5" height="17" />
							<rect x="130.4" y="404.2" width="296" height="17" />
							<rect x="130.4" y="437.3" width="253.5" height="17" />
							<rect x="130.4" y="471.8" width="212.5" height="17" />

							<circle cx="70.7" cy="412.7" r="41.3" />
							<rect x="130.4" y="369" width="125.5" height="17" />
							<rect x="130.4" y="404.2" width="296" height="17" />
							<rect x="130.4" y="437.3" width="253.5" height="17" />
							<rect x="130.4" y="471.8" width="212.5" height="17" />
			  		 	</ContentLoader>
					):(
                		<div className="mb-20 ml-15 mr-15" style={{ paddingBottom: '5rem' }}>
							{this.state.data.map((category, index) => (
								<div key={category.category_name} id={category.category_name + index}>
									<Collapsible
										trigger={
											<div style={{ color: this.checkCategory(index) ? 'black' : 'grey', fontWeight: this.checkCategory(index) ? '900' : '400' }}>
												<div>{category.category_name}</div>
											</div>
										}
									>
										<React.Fragment>
											<div className="mr-20 mb-15" style={{ display: 'flex', justifyContent: 'right' }}>
												<ToggleSwitch checked={this.checkCategory(index)} onChange={() => this.__toogleActiveCategory(category.id, this.checkCategory(index)) } />
											</div>
											{Object.values(category.items).map((item) => (
												<div  style={{ position: 'relative', borderRadius: '8px', border: '1px solid #D9D9D9'}} className="bg-white p-15 ml-5 mr-5 mb-10">
													<div className="clearfix text-black">
														<div className="row">
															<div className="col-9" >
															<DelayLink to={'/store/view/product/'+item.id}>
																<div className="row pl-10">
																	<LazyLoad>
																	<div >
																		<img src={'https://chopze.com/assets/img/items/'+item.image} style={{ height: '60px', width: '60px' }} className="flex-item-image" />
																	</div>
																	</LazyLoad>
																	<div>
																		<div className="mb-10 mt-5 pl-10" style={{"whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis","maxWidth":"150px"}}>{item.name}</div>
																		<span className="pl-10">
																			₹ {item.price}
																		</span>
																	</div>
																</div>
																</DelayLink>
															</div>
															<div className="col-3 mt-10" style={{padding: '5%', zIndex:'5'}}>
																<ToggleSwitch  checked={item.is_active} onChange={() => this.__toogleActive(item.id) } />
															</div>
														</div>
													</div>
												</div>
											))}
										</React.Fragment>
									</Collapsible>
								</div>
							))}
                		</div>
					)}
                </div >
			</div>

			<Footer active_products={true} />
            </React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
	order_history: state.store_user.order_history,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo }
)(Products);
