import React, { Component } from "react";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";
import axios from "axios";
import { WEBSITE_URL } from "../../../configs/website";
import { addProduct, removeProduct } from "../../../services/cart/actions";
import Customization from "../Customization";
import Hero from "../Hero";
import Loading from "../../helpers/loading";
import Footer from "../Footer";
import FloatCart from "../FloatCart";
import { NavLink } from "react-router-dom";
import { TimeCircle } from "react-iconly";
import Rater from 'react-rater';

class SlideItems extends Component {

    static contextTypes = {
        router: () => null,
    };

    state = {
        update: true,
        total: null,
        stores: [],
        loading: false,
        tag: [],
        banner: null
    }

    componentDidMount() {
        const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
        axios
            .post('https://app.snakyz.com/public/api/get-banner-items', {
                id: this.props.match.params.banner_id,
                latitude: userSetAddress.lat,
                longitude: userSetAddress.lng,
            })
            .then((response) => {
                this.setState({
                    stores: response.data.stores,
                    banner: response.data.banner,
                });
            });
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

    render() {

        const { addProduct, removeProduct, cartProducts } = this.props;

        return (
            <React.Fragment>
                <Hero />
                <FloatCart />

                {this.state.loading ? (
                    <Loading />
                ) : (
                    <React.Fragment>
                        {this.state.banner &&
                            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="container mt-50">
                                <div style={{ fontSize: '1.2em', fontWeight: '900' }}>
                                    {this.state.banner.name}
                                </div>
                            </div>
                        }

                        {this.state.stores.length === 0 ? (
                            <div style={{ minHeight: '30vh' }} className="text-muted mt-50 container">No Stores Found</div>
                        ) : (
                            <React.Fragment>
                                <div className="container">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        {/* {this.state.items.map((item) =>
                                            <div className="mt-20">
                                                <NavLink
                                                    to={"/desktop/stores/" + item.store.slug + "/" + item.id}
                                                    key={item.id}
                                                    style={{ position: "relative" }}
                                                >
                                                    <div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                                                        <div className="list-card-image">
                                                            <img alt="chopze" src={WEBSITE_URL + "/assets/img/items/" + item.image}
                                                                style={{ width: '17vw', height: '11vw', objectFit: 'cover' }}
                                                                placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"} />
                                                        </div>
                                                        <div className="p-3 position-relative">
                                                            <div className="list-card-body">
                                                                <div className="d-flex align-items-center">
                                                                    <div>
                                                                        {item.is_veg || item.is_egg ? (
                                                                            <React.Fragment>
                                                                                {item.is_veg ? (
                                                                                    <img className="mr-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/veg-icon.png"} />
                                                                                ) : (
                                                                                    <img className="mr-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/egg-icon.png"} />
                                                                                )}
                                                                            </React.Fragment>
                                                                        ) : (
                                                                            <img className="mr-2" style={{ height: '1.2rem' }} src={WEBSITE_URL + "/assets/non-veg-icon-2.png"} />
                                                                        )}
                                                                    </div>
                                                                    <div style={{ fontWeight: 'bolder', maxWidth: '10vw', overflow: 'hidden' }} className="mb-0">{item.name}</div>
                                                                </div>
                                                                <p className="text-muted mb-1">{item.description}</p>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div className="mr-5" style={{ fontWeight: '600', fontSize: '11px' }}>
                                                                    <span className="rupees-symbol">₹ </span>{item.price}
                                                                </div>
                                                                {item.old_price && item.old_price > 0 &&
                                                                    <div style={{ color: 'red', textDecoration: 'line-through', fontSize: '9px' }}>
                                                                        <span className="rupees-symbol">₹ </span>{item.old_price}
                                                                    </div>
                                                                }
                                                            </div>
                                                            <div style={{ position: 'relative', textAlign: 'center' }}>
                                                                {cartProducts.find((cp) => cp.id === item.id) !==
                                                                    undefined && (
                                                                        <React.Fragment>
                                                                            <div className="item-actions mt-2">
                                                                                <div
                                                                                    className="btn-group btn-group-sm"
                                                                                    role="group"
                                                                                    aria-label="btnGroupIcons1"
                                                                                    style={{ borderRadius: "0.5rem" }}
                                                                                >
                                                                                    {item.is_active ? (
                                                                                        <React.Fragment>
                                                                                            {item.addon_categories.length ? (
                                                                                                null
                                                                                            ) : (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="btn btn-add-remove"
                                                                                                    style={{ "width": "30px", "borderBottom": "1px solid #FF4848", "borderLeft": "1px solid #FF4848", "borderTop": "1px solid #FF4848", "borderTopLeftRadius": "0.8rem", "borderBottomLeftRadius": "0.8rem" }}
                                                                                                    onClick={() => {
                                                                                                        item.quantity = 1;
                                                                                                        removeProduct(item);
                                                                                                        this.forceStateUpdate();
                                                                                                    }}
                                                                                                >
                                                                                                    <span class="btn-dec">-</span>
                                                                                                </button>
                                                                                            )}
                                                                                            {item.addon_categories.length ? null : (
                                                                                                <span
                                                                                                    className="pl-2 pr-2"
                                                                                                    style={{ "border": "none", "width": "10px", "color": "#FF4848", "display": "flex", "justifyContent": "center", "alignItems": "center", "fontWeight": "600", "fontSize": "1rem", "borderTop": "1px solid #FF4848", "borderBottom": "1px solid #FF4848", "backgroundColor": "rgb(255, 255, 255)" }}
                                                                                                >
                                                                                                    <React.Fragment>
                                                                                                        {
                                                                                                            cartProducts.find(
                                                                                                                (cp) => cp.id === item.id
                                                                                                            ).quantity
                                                                                                        }
                                                                                                    </React.Fragment>
                                                                                                </span>
                                                                                            )}

                                                                                            {item.addon_categories.length ? (
                                                                                                <Customization
                                                                                                    product={item}
                                                                                                    addProduct={addProduct}
                                                                                                    forceUpdate={this.forceStateUpdate}
                                                                                                />
                                                                                            ) : (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="btn btn-add-remove"
                                                                                                    style={{ "width": "30px", "color": "#FF4848", "borderTopRightRadius": "0.8rem", "borderBottomRightRadius": "0.8rem", "borderTop": "1px solid #FF4848", "borderRight": "1px solid #FF4848", "borderBottom": "1px solid #FF4848" }}
                                                                                                    onClick={() => {
                                                                                                        addProduct(item);
                                                                                                        this.forceStateUpdate();
                                                                                                    }}
                                                                                                >
                                                                                                    <span class="btn-dec">+</span>
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

                                                                {cartProducts.find((cp) => cp.id === item.id) ===
                                                                    undefined && (
                                                                        <React.Fragment>
                                                                            <div className="item-actions mt-2">
                                                                                {item.is_active ? (
                                                                                    <React.Fragment>
                                                                                        {item.addon_categories.length ? (
                                                                                            <Customization
                                                                                                product={item}
                                                                                                addProduct={addProduct}
                                                                                                forceUpdate={this.forceStateUpdate}
                                                                                            />
                                                                                        ) : (
                                                                                            <button
                                                                                                type="button"
                                                                                                style={{ "position": "relative", "border": "1px solid rgb(255, 72, 72)", "color": "rgb(255, 72, 72)", "width": "70px", "backgroundColor": "rgb(255, 255, 255)", "letterSpacing": "0.8px", "fontWeight": "bolder", "padding": "4px", "borderRadius": "0.8rem" }}
                                                                                                onClick={() => {
                                                                                                    item.quantity = 1;
                                                                                                    addProduct(item);
                                                                                                    this.forceStateUpdate();
                                                                                                }}
                                                                                            >
                                                                                                ADD
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
                                                                {item.addon_categories.length > 0 && (
                                                                    <span
                                                                        className="ml-2 customizable-item-text text-muted"
                                                                    >
                                                                        Customizable
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        )} */}
                                        {this.state.stores.map((restaurant) =>
                                            <div className="mt-30">
                                                <NavLink
                                                    to={"/desktop/stores/" + restaurant.slug}
                                                    key={restaurant.id}
                                                    style={{ position: "relative" }}
                                                >
                                                    <div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                                                        <div className="list-card-image">
                                                            <img alt="chopze" src={WEBSITE_URL + restaurant.image}
                                                                style={{ width: '22.5vw', height: '15vw', objectFit: 'cover' }}
                                                                placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"} />
                                                        </div>
                                                        <div className="p-3 position-relative">
                                                            <div className="list-card-body">
                                                                <h6 className="mb-1">{restaurant.name}</h6>
                                                                <p className="text-muted mb-3">{restaurant.description}</p>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <p className="text-gray mb-3 time"><span
                                                                        className="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2"><TimeCircle className="pt-2" size={20} /> 15–30 min</span></p>
                                                                    <div style={{ fontSize: '20px' }}>
                                                                        <Rater total={5} rating={restaurant.avgRating} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {restaurant.featured_description &&
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <div className="mr-1">
                                                                        <img src="https://app.snakyz.com/assets/discount.png" style={{ height: '1.5rem' }} />
                                                                    </div>
                                                                    <div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "12px" }}>
                                                                        {restaurant.featured_description}
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}

                <Footer />

            </React.Fragment>
        );

    }
}

const mapStateToProps = (state) => ({
    cartProducts: state.cart.products,
});

export default connect(mapStateToProps, {
    addProduct,
    removeProduct,
})(SlideItems);
