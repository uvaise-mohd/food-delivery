import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../../services/Store/user/actions";
import { connect } from "react-redux";
import TopBar from "../../TopBar";
import Axios from "axios";
import axios from "axios";
import { ToggleSwitch } from 'react-dragswitch';
import 'react-dragswitch/dist/index.css';
import { Redirect } from "react-router";
import Loading from "../../../../helpers/loading";
import { PaperUpload } from 'react-iconly';

class NewItem extends Component {

    static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
        store: [],
        categories: [],
		name: "",
		description: "",
		price: "",
		old_price: "",
		store_id: "",
        item_category_id: "",
        image: null,
        max_quantity: "",
        min_quantity: "",
        is_veg: false,
        is_egg: false,
        is_recommended: false
	};

    componentDidMount(){
        this.fetchDta();
	}

    fetchDta(){
        axios
		.post('https://app.snakyz.com/public/api/store/get-store-and-categories', {
			token: this.props.store_user.data.auth_token
		})
		.then((response) => {
			const data = response.data.data;
            // console.log(data);
			if (data) {
                this.setState({ loading: false })
				this.setState({
					store: data.stores,
					categories: data.categories,
				});

			} else {
				this.setState({
					stores: [],
					categories: [],
				});
			}
		});
    };

    handleInputName = (event) => {
		this.setState({ name: event.target.value });
	};

    handleInputDescription = (event) => {
		this.setState({ description: event.target.value });
	};

    handleInputOldPrice = (event) => {
		this.setState({ old_price: event.target.value });
	};

    handleInputPrice = (event) => {
		this.setState({ price: event.target.value });
	};

    handleInputStore = (event) => {
		this.setState({ store_id: event.target.value });
	};

    handleInputCategory = (event) => {
		this.setState({ item_category_id: event.target.value });
	};

    onImageChange = event => {
        this.setState({ image: event.target.files[0] });
    };

    handleInputQuantity = (event) => {
		this.setState({ max_quantity: event.target.value });
	};

    handleInputQuantityMin = (event) => {
		this.setState({ min_quantity: event.target.value });
	};

    addItem = (event) => {
		event.preventDefault();
		if (this.state.store_id && this.state.item_category_id) {
            this.setState({ loading: true });

            const formData = new FormData();
            formData.append("token", this.props.store_user.data.auth_token);
            formData.append("name", this.state.name);
            formData.append("description", this.state.description);
            formData.append("price", this.state.price);
            formData.append("old_price", this.state.old_price);
            formData.append("store_id", this.state.store_id);
            formData.append("item_category_id", this.state.item_category_id);
            formData.append("image", this.state.image);
            formData.append("max_quantity", this.state.max_quantity);
            formData.append("min_quantity", this.state.min_quantity);
            formData.append("is_veg", this.state.is_veg);
            formData.append("is_egg", this.state.is_egg);
            formData.append("is_recommended", this.state.is_recommended);

            Axios.post("https://app.snakyz.com/public/api/store/add-item", formData)
            .then(response => {
                const data = response.data;
                if (data.success) {
                    this.context.router.history.goBack();
                }
            });
        }
	};

	render() {

		const { store_user } = this.props;
		// console.log(this.state.store);

        const style_input = {
            height: '3.4em',
            border: '1px solid #D9D9D9',
            borderRadius: '4px',
            width: '100%',
            paddingLeft: '20px',
            background: 'white',
            color: 'black',
            marginBottom: '12px'
        };

		return (
			<React.Fragment>
            <TopBar
				back={true}
			/>
            {this.state.loading && <Loading />}
            <div className="bg-grey pt-50 pb-30" style={{ minHeight: '100vh' }}>
                <form onSubmit={this.addItem}>
                    <div className="bg-white ml-15 mr-15 mt-20 p-15" style={{ borderRadius: '8px' }}>
                        <div>
                            <label style={{ fontWeight: '600' }}>Item Name</label>
                            <input style={style_input} type="text"  value={this.state.name} onChange={this.handleInputName} placeholder="Enter Item Name" required></input>	 
                        </div>
                        <div>
                            <label style={{ fontWeight: '600' }}>Item Description</label>
                            <input style={{ height: '5em', border: '1px solid #D9D9D9', borderRadius: '4px', width: '100%', paddingLeft: '20px', background: 'white', color: 'black', marginBottom: '12px' }} type="text" value={this.state.description} onChange={this.handleInputDescription} placeholder="Enter Item Description"></input>	 
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Market Price</label>
                            <input style={style_input} type="text"  value={this.state.old_price} onChange={this.handleInputOldPrice} placeholder="Enter Market Price"></input>	 
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Selling Price</label>
                            <input style={style_input} type="text"  value={this.state.price} onChange={this.handleInputPrice} placeholder="Enter Selling Price" required></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Item's Store</label>
                            <div>
                                <select name="store_id"
                                    onChange={this.handleInputStore}
                                    style={{ height: '3em', border: '1px solid #D9D9D9', borderRadius: '4px', width: '100%', paddingLeft: '20px', background: 'white', marginBottom: '12px' }}
                                    className="text-muted"
                                >
                                    <option selected disabled>-Selcet-</option>
                                    {this.state.store && this.state.store.map((str) => (
                                        <option value={str.id}> {str.name} </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Item's Category</label>
                            <div>
                                <select name="item_category_id"
                                    onChange={this.handleInputCategory}
                                    style={{ height: '3em', border: '1px solid #D9D9D9', borderRadius: '4px', width: '100%', paddingLeft: '20px', background: 'white', marginBottom: '12px' }}
                                    className="text-muted"
                                >
                                    <option selected disabled>-Selcet-</option>
                                    {this.state.categories && this.state.categories.map((category) => (
                                        <option value={category.id}> {category.name} </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Image</label>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<input 
									type="file"
									name="image"
									onChange={(e) => this.onImageChange(e)}
									className="form-control"
                                    style={{"marginBottom":"1.5rem","border":"1px solid #D9D9D9","borderTopLeftRadius":"5px","borderBottomLeftRadius":"5px","fontFamily":"poppins !important","width":"60vw"}}
								/>
                                <div className="text-center pt-3" style={{ fontWeight: '600', color: 'white', backgroundColor: '#FE0B15', borderRadius: '5px', height: '40px', width: '30vw' }}>Choose File</div>
							</div>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Maximun Cart Count</label>
                            <input style={style_input} type="text"  value={this.state.max_quantity} onChange={this.handleInputQuantity}></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Minimum Cart Count</label>
                            <input style={style_input} type="text"  value={this.state.min_quantity} onChange={this.handleInputQuantityMin}></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Veg ?</label>
                            <ToggleSwitch className="" checked={this.state.is_veg} onChange={c => {
                                this.setState({ is_veg: c })
                            }} />
                        </div>
                        <div className="mt-10">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Egg ?</label>
                            <ToggleSwitch className="" checked={this.state.is_egg} onChange={c => {
                                this.setState({ is_egg: c })
                            }} />  
                        </div>
                        <div className="mt-10">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Recommended ?</label>
                            <ToggleSwitch className="" checked={this.state.is_recommended} onChange={c => {
                                this.setState({ is_recommended: c })
                            }} />  
                        </div>
                        <div className="mt-50 px-15 mb-30 text-center">
							<button
								type="submit"
								className="btn"
								style={{ "backgroundColor":"white","border":"1px solid #7C83FD","color":"#7C83FD","fontWeight":"700","fontSize":"16px","paddingLeft":"25px","paddingRight":"25px","paddingTop":"5px","paddingBottom":"5px","height":"40px","borderRadius":"5px" }}
							>
								Save Item
							</button>
						</div>
                    </div>
                </form>
            </div>

            </React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo }
)(NewItem);
