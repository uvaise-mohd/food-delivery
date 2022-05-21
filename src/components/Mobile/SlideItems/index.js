import React, { Component } from "react";

import Ink from "react-ink";
import { connect } from "react-redux";
import DelayLink from "../../helpers/delayLink";
import Nav from '../Nav';
import ContentLoader from "react-content-loader";
import axios from "axios";
import ProgressiveImage from "react-progressive-image";
import { WEBSITE_URL } from "../../../configs/website";
import { ChevronLeft } from "react-iconly";
import FloatCart from "../FloatCart";
import { addProduct, removeProduct } from "../../../services/cart/actions";
import Customization from "../Items/Customization";
import LazyLoad from "react-lazyload";
import { TimeCircle } from "react-iconly";
import Fade from "react-reveal/Fade";
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
        document.getElementsByTagName("html")[0].classList.remove("page-inactive");
        
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
                <FloatCart />
                <div className="bg-white" style={{ minHeight: '100vh' }}>
                    {this.state.banner && (
                        <ProgressiveImage
                            delay={100}
                            src={WEBSITE_URL + this.state.banner.image}
                            placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
                        >
                            {(src, loading) => (
                                <img src={src} className="img-fluid" style={{ width: '100%' }} />
                            )}
                        </ProgressiveImage>
                    )}

                    <button
                        type="button"
                        className="btn search-navs-btns"
                        style={{ "position": "fixed", "borderRadius": "50%", "height": "3rem", "top": "2vh", "width": "3rem", "left": "2vh" }}
                        onClick={this.context.router.history.goBack}
                    >
                        <ChevronLeft size="medium" style={{ marginLeft: '-0.5rem' }} />
                        <Ink duration="500" />
                    </button>

                    {this.state.loading ? (
                        <ContentLoader
                            speed={2}
                            width={400}
                            height={460}
                            viewBox="0 0 400 460"
                            backgroundColor="#ebebeb"
                            foregroundColor="#ecebeb"
                        >
                            <rect x="210" y="17" rx="0" ry="0" width="144" height="165" />
                            <rect x="210" y="192" rx="0" ry="0" width="144" height="165" />
                            <rect x="55" y="17" rx="0" ry="0" width="144" height="165" />
                            <rect x="53" y="193" rx="0" ry="0" width="144" height="165" />
                            <rect x="211" y="373" rx="0" ry="0" width="144" height="165" />
                            <rect x="54" y="374" rx="0" ry="0" width="144" height="165" />
                        </ContentLoader>
                    ) : (
                        <React.Fragment>
                            {this.state.stores.length === 0 ? (
                                <ContentLoader
                                    speed={2}
                                    width={400}
                                    height={1000}
                                    viewBox="0 0 400 1000"
                                    backgroundColor="#ebebeb"
                                    foregroundColor="#ffffff"
                                >
                                    <rect x="32" y="15" rx="0" ry="0" width="144" height="165" />
                                    <rect x="45" y="188" rx="0" ry="0" width="115" height="9" />
                                    <rect x="223" y="15" rx="0" ry="0" width="144" height="165" />
                                    <rect x="235" y="188" rx="0" ry="0" width="115" height="9" />
                                    <rect x="33" y="218" rx="0" ry="0" width="144" height="165" />
                                    <rect x="46" y="391" rx="0" ry="0" width="115" height="9" />
                                    <rect x="224" y="218" rx="0" ry="0" width="144" height="165" />
                                    <rect x="236" y="391" rx="0" ry="0" width="115" height="9" />
                                    <rect x="34" y="422" rx="0" ry="0" width="144" height="165" />
                                    <rect x="47" y="595" rx="0" ry="0" width="115" height="9" />
                                    <rect x="225" y="422" rx="0" ry="0" width="144" height="165" />
                                    <rect x="237" y="595" rx="0" ry="0" width="115" height="9" />
                                    <rect x="35" y="625" rx="0" ry="0" width="144" height="165" />
                                    <rect x="48" y="798" rx="0" ry="0" width="115" height="9" />
                                    <rect x="226" y="625" rx="0" ry="0" width="144" height="165" />
                                    <rect x="238" y="798" rx="0" ry="0" width="115" height="9" />
                                </ContentLoader>
                            ) : (
                                <React.Fragment>
                                    <div className="d-flex m-0 pb-100" style={{
                                        flexWrap: "wrap",
                                        margin: '5px',
                                        padding: '10px',
                                        justifyContent: "space-between",
                                        backgroundColor: 'white'
                                    }}
                                    >
                                        {this.state.stores.map((restaurant) => (
                                            <React.Fragment key={restaurant.id}>
                                                <LazyLoad>
                                                    <div className="col-xs-12 d-flex col-sm-12 restaurant-block">
                                                        <DelayLink
                                                            to={"../stores/" + restaurant.slug}
                                                            delay={200}
                                                            className="block text-center mb-0"
                                                        >
                                                            <div
                                                                className="block-content block-content-full pt-2"
                                                            >
                                                                <Fade duration={500}>
                                                                    <img
                                                                        src={WEBSITE_URL + restaurant.image}
                                                                        alt={restaurant.name}
                                                                        className={`restaurant-image ${!restaurant.is_active &&
                                                                            "restaurant-not-active"}`}
                                                                    />
                                                                </Fade>
                                                            </div>
                                                            <div style={{ width: '95%' }} className="block-content ml-4 block-content-full restaurant-info">
                                                                <div className="font-w600 text-dark">
                                                                    {restaurant.name}
                                                                </div>
                                                                <div style={{ fontSize: '10px' }} className="text-muted truncate-text text-muted">
                                                                    {restaurant.description}
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                                                                    <TimeCircle className="mr-2" size={10} />{" "}
                                                                    {restaurant.delivery_time}{" "}
                                                                    mins
                                                                </div>
                                                                {!restaurant.is_active && (
                                                                    <div className="restaurant-not-active-msg">
                                                                        Not Accepting Any Orders
                                                                    </div>
                                                                )}
                                                                <Rater total={5} rating={restaurant.avgRating} />
                                                                <hr style={{ borderTop: '1px dashed #707070', marginTop: '0px', marginBottom: '0px' }} />
                                                                {restaurant.featured_description &&
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div className="mr-1">
                                                                            <img src="https://app.snakyz.com/assets/discount.png" style={{ height: '1rem' }} />
                                                                        </div>
                                                                        <div style={{ "maxWidth": "110px", "overflow": "hidden", "color": "#7E7E7E", "fontSize": "10px" }}>
                                                                            {restaurant.featured_description}
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            <Ink duration="500" hasTouch={false} />
                                                        </DelayLink>
                                                    </div>
                                                </LazyLoad>
                                            </React.Fragment>
                                        ))}
                                        {/* {this.state.items.map((item) => (
                                            <div className="store-block p-10 d-flex justify-content-center">
                                                <div className="text-black" style={{ borderRadius: '2rem' }} >
                                                    <DelayLink to={'/stores/' + item.store.slug + '/' + item.id}>
                                                        <img style={{ borderRadius: '0.5rem', height: '80px', width: '36vw' }} src={WEBSITE_URL + "/assets/img/items/" + item.image} />
                                                    </ DelayLink>
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
                                                        <div className="mt-2 ml-2" style={{ fontWeight: 'bolder', maxWidth: '36vw', overflow: 'hidden' }}>
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                    <div style={{ maxWidth: '36vw', overflow: 'hidden', color: '#7E7E7E', fontSize: '10px' }}>
                                                        {item.description}
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
                                        ))} */}
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>

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
