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

class NewAddon extends Component {

    static contextTypes = {
		router: () => null,
	};

	state = {
		loading: true,
        categories: [],
		name: "",
		price: "",
        addon_category_id: "",
	};

    componentDidMount(){
        this.fetchDta();
	}

    fetchDta(){
        axios
		.post('https://chopze.com/public/api/store/get-addon-categories', {
			token: this.props.store_user.data.auth_token
		})
		.then((response) => {
			const data = response.data.data;
            // console.log(data);
			if (data) {
                this.setState({ loading: false })
				this.setState({
					categories: data.categories,
				});

			} else {
				this.setState({
					categories: [],
				});
			}
		});
    };

    handleInputName = (event) => {
		this.setState({ name: event.target.value });
	};

    handleInputPrice = (event) => {
		this.setState({ price: event.target.value });
	};

    handleInputCategory = (event) => {
		this.setState({ addon_category_id: event.target.value });
	};

    addAddon = (event) => {
		event.preventDefault();
		if (this.state.addon_category_id) {
            this.setState({ loading: true });

            const formData = new FormData();
            formData.append("token", this.props.store_user.data.auth_token);
            formData.append("name", this.state.name);
            formData.append("price", this.state.price);
            formData.append("addon_category_id", this.state.addon_category_id);

            Axios.post("https://chopze.com/public/api/store/add-addon", formData)
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
                <form onSubmit={this.addAddon}>
                    <div className="bg-white ml-15 mr-15 mt-20 p-15" style={{ borderRadius: '8px' }}>
                        <div>
                            <label style={{ fontWeight: '600' }}>Addon Name</label>
                            <input style={style_input} type="text"  value={this.state.name} onChange={this.handleInputName} placeholder="Enter Addon Name" required></input>	 
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Addon Price</label>
                            <input style={style_input} type="text"  value={this.state.price} onChange={this.handleInputPrice} placeholder="Enter Addon Price" required></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Addons's Category</label>
                            <div>
                                <select name="addon_category_id"
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
                        <div className="mt-50 px-15 mb-30 text-center">
							<button
								type="submit"
								className="btn"
								style={{ "backgroundColor":"white","border":"1px solid #7C83FD","color":"#7C83FD","fontWeight":"700","fontSize":"16px","paddingLeft":"25px","paddingRight":"25px","paddingTop":"5px","paddingBottom":"5px","height":"40px","borderRadius":"5px" }}
							>
								Save Addon
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
)(NewAddon);
