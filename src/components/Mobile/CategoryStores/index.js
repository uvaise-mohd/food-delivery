import React, { Component } from "react";
import { Search } from "react-iconly";
import Ink from "react-ink";
import { connect } from "react-redux";
import DelayLink from "../../helpers/delayLink";
import ContentLoader from "react-content-loader";
import axios from "axios";
import ProgressiveImage from "react-progressive-image";
import { WEBSITE_URL } from "../../../configs/website";
import { ArrowLeft } from "react-iconly";
import LazyLoad from "react-lazyload";
import { TimeCircle } from "react-iconly";
import Fade from "react-reveal/Fade";
import Rater from 'react-rater';
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Loading from "../../helpers/loading";

class SlideStores extends Component {

    static contextTypes = {
        router: () => null,
    };

    state = {
        update: true,
        total: null,
        featured_stores: [],
        stores: [],
        closed_stores: [],
        loading: true,
        tag: [],
        sliders: [],
        category: null
    }

    componentDidMount() {
        document.getElementsByTagName("html")[0].classList.remove("page-inactive");

        const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
        axios
            .post('https://chopze.com/public/api/get-category-stores', {
                id: this.props.match.params.category_id,
                latitude: userSetAddress.lat,
                longitude: userSetAddress.lng,
            })
            .then((response) => {
                this.setState({
                    loading: false,
                    featured_stores: response.data.featured_stores,
                    stores: response.data.stores,
                    closed_stores: response.data.closed_stores,
                    sliders: response.data.sliders,
                    category: response.data.category,
                });
            });
    }

    render() {

        return (
            <React.Fragment>
                {this.state.loading && <Loading />}
                <div className="bg-white">
                    <div className="bg-white" style={{ position: 'sticky', top: '0px', zIndex: '999' }}>
                        <div style={{ "position": "absolute", "top": "15px", "left": "15px" }} onClick={() => this.context.router.history.goBack()}>
                            <ArrowLeft />
                        </div>
                        {this.state.category &&
                            <React.Fragment>
                                <div className="text-center pt-15 pb-10" style={{ "fontSize": "15px", "fontWeight": "bolder" }}>
                                    {this.state.category.name}
                                </div>

                                <Link to="/explore">
                                    <div className="pl-20 pr-20 pb-10 pt-10">
                                        <div
                                            className="items-search-box form-control"
                                            style={{ width: '90vw' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span>Search Food or Store Here</span>
                                                </div>
                                                <div style={{ color: '#ababab' }}>
                                                    <Search />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </React.Fragment>
                        }
                    </div>

                    <div className="pl-15 pr-15">
                        {this.state.sliders.length === 0 ? (
                            null
                        ) : (
                            <Carousel className="mt-10" autoFocus={true} autoPlay={false} centerMode centerSlidePercentage={58} showStatus={false} stopOnHover={true} showArrows={false} showThumbs={false}>
                                {this.state.sliders.map(slide => (
                                    <DelayLink to={'/slider-stores/' + slide.id} key={slide.id}>
                                        <div>
                                            <ProgressiveImage
                                                delay={100}
                                                src={WEBSITE_URL + slide.image}
                                                placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
                                            >
                                                {(src, loading) => (
                                                    <img
                                                        src={src}
                                                        alt={'offers-great'}
                                                        style={{
                                                            borderRadius: '1rem',
                                                            width: '50vw',
                                                            height: '60vw',
                                                        }}
                                                    />
                                                )}
                                            </ProgressiveImage>
                                        </div>
                                    </DelayLink>
                                ))}
                            </Carousel>
                        )}
                    </div>

                    <div className="bg-white pb-50 mt-20" style={{ minHeight: '100vh' }}>
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
                                {(this.state.featured_stores.length === 0 && this.state.stores.length === 0 && this.state.closed_stores.length === 0) ? ( 
                                    <div className="text-center text-muted pt-100">
                                        No Stores Available.
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <div>
                                            {this.state.featured_stores.map((restaurant) => (
                                                <React.Fragment key={restaurant.id}>
                                                    <LazyLoad>
                                                        <div className="col-xs-12 col-sm-12 d-flex restaurant-block mb-10">
                                                            <DelayLink
                                                                to={"../stores/" + restaurant.slug}
                                                                delay={200}
                                                                className="block text-center mb-0"
                                                            >
                                                                <div
                                                                    className="block-content block-content-full pt-2"
                                                                >
                                                                    <div style={{"width":"35px","backgroundColor":"rgb(62 65 82 / 60%)","color":"#fff","borderRadius":"5px","position":"absolute","zIndex":"99","top":"25px","left":"25px"}}>Ad</div>
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
                                                                    <div style={{ fontSize: '14px' }} className="font-w600 text-dark">
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
                                            {this.state.stores.map((restaurant) => (
                                                <React.Fragment key={restaurant.id}>
                                                    <LazyLoad>
                                                        <div className="col-xs-12 col-sm-12 d-flex restaurant-block mb-10">
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
                                                                    <div style={{ fontSize: '14px' }} className="font-w600 text-dark">
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

                                            {this.state.closed_stores.length > 0 &&
                                                <div className="mt-20 font-w600 text-muted ml-20 mr-20">CLOSED</div>
                                            }

                                            {this.state.closed_stores.map((restaurant) => (
                                                <React.Fragment key={restaurant.id}>
                                                    <LazyLoad>
                                                        <div className="col-xs-12 col-sm-12 d-flex restaurant-block mb-10">
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
                                                                    <div style={{ fontSize: '14px' }} className="font-w600 text-dark">
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
                </div>
            </React.Fragment>
        );

    }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(SlideStores);
