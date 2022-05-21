import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../../services/Store/user/actions";
import { connect } from "react-redux";
import Ink from "react-ink";
import TopBar from "../../TopBar";
import axios from "axios";
import Fade from 'react-reveal/Fade';
import { ToggleSwitch } from 'react-dragswitch'
import 'react-dragswitch/dist/index.css'
import { PaperUpload } from 'react-iconly';
import { Delete } from 'react-iconly';
import Loading from "../../../../helpers/loading";

class ProductView extends Component {

    static contextTypes = {
        router: () => null,
    };

    state = {
        product: [],
        product_name: null,
        product_desc: null,
        old_image: null,
        image: null,
        product_old_price: null,
        product_price: null,
        max_quantity: null,
        min_quantity: null,
        product_is_active: false,
        product_is_veg: false,
        product_is_egg: false,
        product_is_recommended: false,
        deletePopup: false,
        loading: true,

    };

    handlePopupOpen = () => {
        this.setState({ deletePopup: true });
    };

    handlePopupClose = () => {
        this.setState({ deletePopup: false });
    };

    componentDidMount() {
        this.__fetchProductData();
        this.setState({
            successSnack: false
        });

    }

    __fetchProductData() {
        axios
            .post('https://chopze.com/public/api/store/view-product', {
                token: this.props.store_user.data.auth_token,
                product_id: this.props.match.params.product_id
            })
            .then((response) => {
                this.setState({ loading: false });
                const product = response.data;

                if (product.product) {
                    this.setState({
                        product: product.product,
                        product_name: product.product.name,
                        product_desc: product.product.description,
                        old_image: product.product.image,
                        product_old_price: product.product.old_price,
                        product_price: product.product.price,
                        max_quantity: product.product.max_quantity,
                        min_quantity: product.product.min_quantity,
                        product_is_active: product.product.is_active,
                        product_is_veg: product.product.is_veg,
                        product_is_egg: product.product.is_egg,
                        product_is_recommended: product.product.is_recommended,

                    });
                } else {
                    this.setState({
                        product: []
                    });
                }
            });

    }

    __updateItem() {
        this.setState({ loading: true });

        const formData = new FormData();
        formData.append("token", this.props.store_user.data.auth_token);
        formData.append("product_id", this.props.match.params.product_id);
        formData.append("product_name", this.state.product_name);
        formData.append("product_desc", this.state.product_desc);
        formData.append("image", this.state.image);
        formData.append("product_old_price", this.state.product_old_price);
        formData.append("product_price", this.state.product_price);
        formData.append("max_quantity", this.state.max_quantity);
        formData.append("min_quantity", this.state.min_quantity);
        formData.append("product_is_active", this.state.product_is_active);
        formData.append("product_is_veg", this.state.product_is_veg);
        formData.append("product_is_egg", this.state.product_is_egg);
        formData.append("product_is_recommended", this.state.product_is_recommended);

        axios
            .post('https://chopze.com/public/api/store/update-product', formData)
            .then((response) => {
                this.setState({ loading: false });
                this.setState({ successSnack: true })
                setTimeout(
                    () => this.setState({ successSnack: false }),
                    3000
                );
            });
    }

    __deleteItem = () => {
        axios
            .post('https://chopze.com/public/api/store/delete-product', {
                token: this.props.store_user.data.auth_token,
                product_id: this.props.match.params.product_id,
            })
            .then((response) => {
                this.context.router.history.goBack();
            });
    }

    handleChangeName(event) {
        this.setState({ [event.target.id]: event.target.value })
    }

    handleChangeDesc(event) {
        this.setState({ [event.target.id]: event.target.value })
    }

    onImageChange = event => {
        this.setState({ image: event.target.files[0] });
    };

    // handleImageUpload = event => {
    //     console.log(event.target.files[0])
    // }

    render() {
        const { store_user } = this.props;
        const { product } = this.state;
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
                <div className="bg-grey pt-50 pb-50" style={{ height: '100vh' }}>
                    <div className="bg-white ml-15 mr-15 mt-20 p-15" style={{ borderRadius: '8px' }}>
                        <div>
                            <label style={{ fontWeight: '600' }}>Item Name</label>
                            <input style={style_input} type="text" value={this.state.product_name} id={"product_name"} onChange={(e) => this.handleChangeName(e)}></input>
                        </div>
                        <div>
                            <label style={{ fontWeight: '600' }}>Item Description</label>
                            <input style={{ height: '5em', border: '1px solid #D9D9D9', borderRadius: '4px', width: '100%', paddingLeft: '20px', background: 'white', color: 'black', marginBottom: '12px' }} type="text" value={this.state.product_desc} id={"product_desc"} onChange={(e) => this.handleChangeDesc(e)}></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>New Image</label>
                            <br />
                            <img className="mb-2" src={"https://chopze.com/assets/img/items/" + this.state.old_image} style={{ height: '100px', width: '100px', borderRadius: '3px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={(e) => this.onImageChange(e)}
                                    className="form-control"
                                    style={{ "marginBottom": "1.5rem", "border": "1px solid #D9D9D9", "borderTopLeftRadius": "5px", "borderBottomLeftRadius": "5px", "fontFamily": "poppins !important", "width": "60vw" }}
                                />
                                <div className="text-center pt-3" style={{ fontWeight: '600', color: 'white', backgroundColor: '#FE0B15', borderRadius: '5px', height: '40px', width: '30vw' }}>Choose File</div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Market Price</label>
                            <input style={style_input} type="text" value={this.state.product_old_price} id={"product_old_price"} onChange={(e) => this.handleChangeName(e)} placeholder="Enter Market Price"></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Selling Price</label>
                            <input style={style_input} type="text" value={this.state.product_price} id={"product_price"} onChange={(e) => this.handleChangeName(e)}></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Maximum Cart Count</label>
                            <input style={style_input} type="text" value={this.state.max_quantity} id={"max_quantity"} onChange={(e) => this.handleChangeName(e)}></input>
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }}>Minimum Cart Count</label>
                            <input style={style_input} type="text" value={this.state.min_quantity} id={"min_quantity"} onChange={(e) => this.handleChangeName(e)}></input>
                        </div>
                        <div className="mt-10">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Active ?</label>
                            <ToggleSwitch className="" checked={this.state.product_is_active} onChange={c => {
                                this.setState({ product_is_active: c })
                            }} />
                        </div>
                        <div className="mt-5">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Veg ?</label>
                            <ToggleSwitch className="" checked={this.state.product_is_veg} onChange={c => {
                                this.setState({ product_is_veg: c })
                            }} />
                        </div>
                        <div className="mt-10">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Egg ?</label>
                            <ToggleSwitch className="" checked={this.state.product_is_egg} onChange={c => {
                                this.setState({ product_is_egg: c })
                            }} />
                        </div>
                        <div className="mt-10">
                            <label style={{ fontWeight: '600' }} className="mr-15 col-6">Is Recommended ?</label>
                            <ToggleSwitch className="" checked={this.state.product_is_recommended} onChange={c => {
                                this.setState({ product_is_recommended: c });
                            }} />
                        </div>
                        <div className="mt-20 mb-20" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: 'white', border: '1px solid #FE0B15', display: 'flex', width: '35vw', paddingLeft: '8vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px', backgroundColor: '#FE0B15' }} className="ml-15" onClick={this.handlePopupOpen} ><Delete /><span className="mt-1 ml-2">Delete</span></div>
                            <div style={{ color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '35vw', paddingLeft: '8vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px' }} className="mr-15" onClick={() => this.__updateItem()} ><PaperUpload /><span className="mt-1 ml-2">Update</span></div>
                        </div>
                    </div>
                </div>
                {this.state.successSnack == true &&
                    <div className="no-click" style={
                        { "position": "fixed", "top": "50px", "textAlign": "center", "width": "100%", "backgroundColor": "#60b246", "color": "#f4f4f5", "padding": "0.8rem", "zIndex": "2147483647" }
                    }>
                        <div className="error">Updated Succesfully</div>
                    </div>}

                {this.state.deletePopup == true && (
                    <React.Fragment>
                        <div onClick={this.handlePopupClose} style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
                            <Fade bottom>
                                <div className="bg-white" style={{ height: 'auto', left: '0', width: '100%', padding: '20px', paddingBottom: '20px', bottom: '0px', position: 'fixed', zIndex: '9999' }}>
                                    <h5>Are you sure about Delete ?</h5>
                                    <div className="col-12 font-weight-bold" onClick={this.__deleteItem} style={{ border: 'solid 2px #ef5350', "padding": "10px", "color": "#ef5350", "fontSize": "large", "textAlign": "center", "borderRadius": "8px" }}>
                                        Yes, Delete
                                        <Ink duration="500" hasTouch="true" />
                                    </div>
                                </div>
                            </Fade>
                        </div>
                    </React.Fragment>
                )}

                {/* <Footer active_products={true} /> */}
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
)(ProductView);