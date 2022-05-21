import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { WEBSITE_URL } from "../../../configs/website";
import { TimeCircle } from "react-iconly";
import Rater from 'react-rater';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Loading from "../../helpers/loading";
import Hero from "../Hero";
import Footer from "../Footer";
import { NavLink } from "react-router-dom";

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
                <Hero />

                {this.state.loading ? (
                    <Loading />
                ) : (
                    <React.Fragment>
                        {this.state.category &&
                            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="container mt-50">
                                <div style={{ fontSize: '1.2em', fontWeight: '900' }}>
                                    {this.state.category.name}
                                </div>
                            </div>
                        }

                        {(this.state.featured_stores.length === 0 && this.state.stores.length === 0 && this.state.closed_stores.length === 0) ? (
                            <div style={{ minHeight: '30vh' }} className="text-muted mt-50 container">No Stores Found</div>
                        ) : (
                            <React.Fragment>
                                <div className="container">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        {this.state.featured_stores.map((restaurant) =>
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
                                                                        <img src="https://chopze.com/assets/discount.png" style={{ height: '1.5rem' }} />
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
                                                                        <img src="https://chopze.com/assets/discount.png" style={{ height: '1.5rem' }} />
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

                                    {this.state.closed_stores &&
                                        <div className="mt-20 font-w600 text-muted ml-20 mr-20">CLOSED</div>
                                    }
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        {this.state.closed_stores.map((restaurant) =>
                                            <div className="mt-30">
                                                <NavLink
                                                    to={"/desktop/stores/" + restaurant.slug}
                                                    key={restaurant.id}
                                                    style={{ position: "relative" }}
                                                >
                                                    <div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                                                        <div className="list-card-image restaurant-not-active">
                                                            <img alt="chopze" src={WEBSITE_URL + restaurant.image}
                                                                style={{ width: '22.5vw', height: '15vw', objectFit: 'cover' }}
                                                                placeholder={"https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"} />
                                                        </div>
                                                        <div className="p-3 position-relative">
                                                            <div className="list-card-body">
                                                                <h6 className="mb-1">{restaurant.name}</h6>
                                                                <p className="text-muted mb-3">{restaurant.description}</p>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <p className="text-gray mb-3 time restaurant-not-active"><span
                                                                        className="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2"><TimeCircle className="pt-2" size={20} /> 15–30 min</span></p>
                                                                    <div style={{ fontSize: '20px' }}>
                                                                        <Rater total={5} rating={restaurant.avgRating} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="restaurant-not-active-msg">
                                                                Not Accepting Any Orders
                                                            </div>
                                                            {restaurant.featured_description &&
                                                                <div className="restaurant-not-active" style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <div className="mr-1">
                                                                        <img src="https://chopze.com/assets/discount.png" style={{ height: '1.5rem' }} />
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
});

export default connect(mapStateToProps)(SlideStores);
