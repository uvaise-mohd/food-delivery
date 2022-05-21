import React, { Component } from "react";

import Ink from "react-ink";
import { connect } from "react-redux";
import DelayLink from "../../helpers/delayLink";
import ContentLoader from "react-content-loader";
import axios from "axios";
import ProgressiveImage from "react-progressive-image";
import { WEBSITE_URL } from "../../../configs/website";
import { ChevronLeft } from "react-iconly";
import LazyLoad from "react-lazyload";
import { TimeCircle } from "react-iconly";
import Fade from "react-reveal/Fade";
import Rater from 'react-rater';

class SlideStores extends Component {

    static contextTypes = {
        router: () => null,
    };

    state = {
        update: true,
        total: null,
        stores: [],
        loading: false,
        tag: [],
        slider: null
    }

    componentDidMount() {
        document.getElementsByTagName("html")[0].classList.remove("page-inactive");
        
        const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
        axios
            .post('https://chopze.com/public/api/get-slider-stores', {
                id: this.props.match.params.slider_id,
                latitude: userSetAddress.lat,
                longitude: userSetAddress.lng,
            })
            .then((response) => {
                this.setState({
                    stores: response.data.stores,
                    slider: response.data.slider,
                });
            });
    }

    render() {

        return (
            <React.Fragment>
                <div className="bg-white" style={{ minHeight: '100vh' }}>
                    {this.state.slider && (
                        <ProgressiveImage
                            delay={100}
                            src={WEBSITE_URL + this.state.slider.image}
                            placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
                        >
                            {(src, loading) => (
                                <img src={src} className="img-fluid" style={{ width: '100%', height: '50vh', objectFit: 'cover' }} />
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
                                // <ContentLoader
                                //     speed={2}
                                //     width={400}
                                //     height={1000}
                                //     viewBox="0 0 400 1000"
                                //     backgroundColor="#ebebeb"
                                //     foregroundColor="#ffffff"
                                // >
                                //     <rect x="32" y="15" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="45" y="188" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="223" y="15" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="235" y="188" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="33" y="218" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="46" y="391" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="224" y="218" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="236" y="391" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="34" y="422" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="47" y="595" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="225" y="422" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="237" y="595" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="35" y="625" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="48" y="798" rx="0" ry="0" width="115" height="9" />
                                //     <rect x="226" y="625" rx="0" ry="0" width="144" height="165" />
                                //     <rect x="238" y="798" rx="0" ry="0" width="115" height="9" />
                                // </ContentLoader>

                                <div className="text-center text-muted pt-100">
                                    No Restaurants Available.
                                </div>
                            ) : (
                                <React.Fragment>
                                    <div>
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
                                                                            <img src="https://chopze.com/assets/discount.png" style={{ height: '1rem' }} />
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
});

export default connect(mapStateToProps)(SlideStores);
