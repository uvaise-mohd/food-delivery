import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../../services/Store/user/actions";
import { connect } from "react-redux";
import Ink from "react-ink";
import TopBar from "../../TopBar";
import Loading from "../../../../helpers/loading";
import axios from "axios";
import Moment from "react-moment";
import { formatPrice } from "../../../../helpers/formatPrice";
import ItemView from "./ItemView";
import ContentLoader from "react-content-loader";
import Fade from 'react-reveal/Fade';

class order extends Component {

    static contextTypes = {
        router: () => null,
    };

    state = {
        order: [],
        orderitems: [],
        cancelPopup: false,
        itemNotAvailable: false,
        auth_token: this.props.store_user.data.auth_token,
        loading: false,
    };

    componentDidMount() {
        this.__fetchOrderData()
    }

    __fetchOrderData() {
        axios
            .post('https://app.snakyz.com/public/api/store/get-order-data', {
                unique_order_id: this.props.match.params.unique_order_id,
                token: this.props.store_user.data.auth_token
            })
            .then((response) => {
                const order = response.data;

                var total = 0;
                var tax = 0;

                if (order.tax && order.tax > 0) {
                    tax = order.tax;
                } else {
                    tax = 0;
                }

                total = parseFloat(tax) + parseFloat(order.sub_total);

                if (order) {
                    // add new
                    this.setState({
                        order: order,
                        orderitems: order.orderitems,
                        totalAmount: total,

                    });
                } else {
                    this.setState({
                        order: [],
                        orderitems: [],

                    });
                }
            });
    };

    __acceptToDeliver(order_id) {
        this.setState({ loading: true });
        axios
            .post('https://app.snakyz.com/public/api/accept-order-store', {
                token: this.props.store_user.data.auth_token,
                order_id: order_id
            }).then((response) => {
                const order = response.data;
                this.setState({ loading: false });
                if (order.success) {
                    this.__fetchOrderData();
                } else {
                    this.__fetchOrderData();
                }
            });
    };

    __orderReady(order_id) {
        this.setState({ loading: true });
        axios
            .post('https://app.snakyz.com/public/api/food-ready-store', {
                token: this.props.store_user.data.auth_token,
                order_id: order_id
            }).then((response) => {
                const order = response.data;
                this.setState({ loading: false });
                if (order.success) {
                    this.__fetchOrderData();
                } else {
                    this.__fetchOrderData();
                }
            });
    };

    __orderDelivered(order_id) {
        this.setState({ loading: true });
        axios
            .post('https://app.snakyz.com/public/api/self-order-complete', {
                token: this.props.store_user.data.auth_token,
                order_id: order_id
            }).then((response) => {
                const order = response.data;
                this.setState({ loading: false });
                if (order.success) {
                    this.__fetchOrderData();
                } else {
                    this.__fetchOrderData();
                }
            });
    };

    __cancelOrder = () => {
        axios
            .post('https://app.snakyz.com/public/api/store/cancel-order', {
                token: this.props.store_user.data.auth_token,
                order_id: this.state.order.id
            }).then((response) => {
                const order = response.data;
                if (order.success) {
                    this.context.router.history.push("/store/orders");

                } else {
                    this.__fetchOrderData();
                }
            });

    };

    handlePopupOpen = () => {
        this.setState({ cancelPopup: true });
    };

    handlePopupClose = () => {
        this.setState({ cancelPopup: false });
    };

    render() {

        const { store_user } = this.props;
        const { order } = this.state;
        console.log(order)
        const total = parseFloat(order.restaurant_total);

        return (
            <React.Fragment>
                <TopBar
                    has_title={false}
                    back={true}
                />
                {this.state.loading && <Loading />}
                <div className="bg-grey pt-50" style={{ height: '100vh' }}>
                    {this.state.orderitems.length === 0 ? (
                        <ContentLoader
                            height={54}
                            width={320}
                            viewBox="0 0 320 54"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                        >
                            <circle cx="27" cy="27" r="18" />
                            <rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
                            <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
                            <rect x="67" y="30" rx="3" ry="3" width="74" height="10" />
                            <circle cx="305" cy="27" r="8" />
                            <rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
                            <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
                        </ContentLoader>
                    ) : (
                        <React.Fragment>
                            {(order && order.order_status_id == 1 || order.order_status_id == 11) &&
                                <div>
                                    <div className="text-center ml-15 mr-15 mt-20 mb-20" style={{ backgroundColor: '#00C127', color: 'white' }}>
                                        NEW ORDER | <Moment format="MMM D y, hh:mm A">{order.created_at}</Moment>
                                    </div>
                                </div>
                            }
                            {order && order.order_status_id == 5 &&
                                <div>
                                    <div className="text-center ml-15 mr-15 mt-20 mb-20" style={{ backgroundColor: '#7C83FD', color: 'white' }}>
                                        COMPLETED ORDER | <Moment format="MMM D y, hh:mm A">{order.created_at}</Moment>
                                    </div>
                                </div>
                            }
                            {order && order.order_status_id == 6 &&
                                <div>
                                    <div className="text-center ml-15 mr-15 mt-20 mb-20" style={{ backgroundColor: 'red', color: 'white' }}>
                                        CANCELLED ORDER | <Moment format="MMM D y, hh:mm A">{order.created_at}</Moment>
                                    </div>
                                </div>
                            }
                            {(order && order.order_status_id == 2 || order.order_status_id == 3 || order.order_status_id == 4 || order.order_status_id == 7 || order.order_status_id == 8) &&
                                <div>
                                    <div className="text-center ml-15 mr-15 mt-20 mb-20" style={{ backgroundColor: '#F98404', color: 'white' }}>
                                        ON-GOING ORDER | <Moment format="MMM D y, hh:mm A">{order.created_at}</Moment>
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    )}

                    <div className="ml-15 mr-15 bg-white p-10" style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                        {this.state.orderitems.length === 0 ? (
                            <div>
                                <ContentLoader
                                    height={54}
                                    width={320}
                                    viewBox="0 0 320 54"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <circle cx="27" cy="27" r="18" />
                                    <rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
                                    <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
                                    <rect x="67" y="30" rx="3" ry="3" width="74" height="10" />
                                    <circle cx="305" cy="27" r="8" />
                                    <rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
                                    <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
                                </ContentLoader>

                                <ContentLoader
                                    height={54}
                                    width={320}
                                    viewBox="0 0 320 54"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <circle cx="27" cy="27" r="18" />
                                    <rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
                                    <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
                                    <rect x="67" y="30" rx="3" ry="3" width="74" height="10" />
                                    <circle cx="305" cy="27" r="8" />
                                    <rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
                                    <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
                                </ContentLoader>

                                <ContentLoader
                                    height={54}
                                    width={320}
                                    viewBox="0 0 320 54"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <circle cx="27" cy="27" r="18" />
                                    <rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
                                    <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
                                    <rect x="67" y="30" rx="3" ry="3" width="74" height="10" />
                                    <circle cx="305" cy="27" r="8" />
                                    <rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
                                    <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
                                </ContentLoader>

                                <ContentLoader
                                    height={54}
                                    width={320}
                                    viewBox="0 0 320 54"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <circle cx="27" cy="27" r="18" />
                                    <rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
                                    <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
                                    <rect x="67" y="30" rx="3" ry="3" width="74" height="10" />
                                    <circle cx="305" cy="27" r="8" />
                                    <rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
                                    <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
                                </ContentLoader>
                            </div>
                        ) : (
                            <div>
                                <div className="ml-10" style={{ fontWeight: 'bold', fontSize: '14px' }}>#{order.unique_order_id}</div>
                                <hr style={{ borderTop: '1px dashed #B8B8B8' }} />
                                {this.state.orderitems.map((item, index) => (
                                    <ItemView item={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    {this.state.orderitems.length === 0 ? (
                        null
                    ) : (
                        <div className="ml-15 mr-15 pl-15 pr-15 pb-15 bg-white" style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                            {/* {order.order_comment &&
                            <div className="row" style={{color: 'red'}}>
                                <div className="col-9">Comment </div>
                                <div className="col-3 text-right">{order.order_comment}</div>
                            </div> } */}
                            {order.store_charge &&
                                <div className="row" style={{ fontSize: '10px' }}>
                                    <div className="col-9 text-right">Store Charge</div>
                                    <div className="col-3 text-right">₹ {order.store_charge}</div>
                                </div>
                            }
                            <div className="row" style={{ fontSize: '10px' }}>
                                <div className="col-9 text-right">Subtotal</div>
                                <div className="col-3 text-right">₹ {order.sub_total}</div>
                            </div>
                            {/* {order.tax && order.tax > 0 &&
                                <div className="row" style={{ fontSize: '10px' }}>
                                    <div className="col-9 text-right">Tax</div>
                                    <div className="col-3 text-right">₹ {parseFloat(order.tax).toFixed(2)}</div>
                                </div>
                            } */}
                            <div className="row" style={{ fontWeight: '600' }}>
                                <div className="col-9 text-right">Total </div>
                                <div className="col-3 text-right">₹ {order.restaurant_total}</div>
                            </div>
                            {/* <div className="row">
                                <div className="col-9 text-muted font-size-sm">Commission </div>
                                <div className="col-3 text-muted font-size-sm text-right">{(parseFloat(order.total_commission).toFixed(2))}</div>
                            </div> */}
                        </div>
                    )}

                    {order.delivery_type == '2' &&
                        <div className="text-center mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
                            Self Pick-Up Order
                        </div>
                    }

                    {order.is_scheduled == 1 &&
                        <div>
                            <div className="text-center mt-10" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
                                Scheduled Order
                            </div>
                            <div className="mt-2" style={{ color: localStorage.getItem("storeColor"), display: 'flex', justifyContent: 'center' }}>
                                <span>Scheduled For:&nbsp;</span>
                                {order.schedule_date &&
                                    <span><Moment format="DD/MM/YYYY">{order.schedule_date}</Moment>&nbsp;</span>
                                }
                                {order.schedule_time &&
                                    <span>{order.schedule_time}</span>
                                }
                            </div>
                        </div>
                    }

                    {(order.order_status_id == 1 || order.order_status_id == 11) && (
                        <React.Fragment>
                            <div style={{ position: 'fixed', bottom: '0px', width: '100vw', display: 'flex' }}>
                                <div onClick={this.handlePopupOpen} style={{ "letterSpacing": "1px", "fontWeight": "600", "backgroundColor": "#FE0B15", "padding": "15px", "color": "white", "width": "50vw", "textAlign": "center" }}>
                                    CANCEL ORDER
                                </div>
                                <div onClick={() => this.__acceptToDeliver(order.id)} style={{ "letterSpacing": "1px", "fontWeight": "600", "backgroundColor": "#00C127", "padding": "15px", "color": "white", "width": "50vw", "textAlign": "center" }}>
                                    ACCEPT ORDER
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                    {order.order_status_id == 8 && (
                        <React.Fragment>
                            <div style={{ position: 'fixed', bottom: '0px', width: '100vw', display: 'flex' }}>
                                <div onClick={() => this.__orderReady(order.id)} style={{ "letterSpacing": "1px", "fontWeight": "600", "backgroundColor": "#00C127", "padding": "15px", "color": "white", "width": "100vw", "textAlign": "center" }}>
                                    ORDER READY
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                    {order.delivery_type == '2' && order.order_status_id == 2 && (
                        <React.Fragment>
                            <div style={{ position: 'fixed', bottom: '0px', width: '100vw', display: 'flex' }}>
                                <div onClick={() => this.__orderDelivered(order.id)} style={{ "letterSpacing": "1px", "fontWeight": "600", "backgroundColor": "#00C127", "padding": "15px", "color": "white", "width": "100vw", "textAlign": "center" }}>
                                    MARK AS DELIVERED
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                    {order && order.accept_delivery && order.accept_delivery.user &&
                        <div className="bg-white mx-20 my-10 p-20" style={{ borderRadius: '10px', fontWeight: '600' }}>
                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <div style={{ fontSize: '16px', fontWeight: '600' }}> Delivery boy details </div>

                            </div>
                            <div className="d-flex flex-row align-items-center justify-content-between">
                                <div> Delivery boy name: </div>
                                <div>{order.accept_delivery.user.name}</div>
                            </div>
                            <div className="d-flex flex-row align-items-center justify-content-between mt-1">
                                <div> Delivery boy number: </div>
                                <div>{order.accept_delivery.user.phone}</div>
                            </div>
                        </div>
                    }
                    {order && order.order_comment &&
                        <div className="bg-white mx-20 my-10 p-20" style={{ borderRadius: '10px', fontWeight: '600' }}>
                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <div style={{ fontSize: '16px', fontWeight: '600' }}> Order suggestion </div>

                            </div>
                            <div className="text-center text-muted mt-1"  >
                               <p> {order.order_comment}</p>
                            </div>
                            
                        </div>
                    }
                </div>
                {this.state.cancelPopup == true && (
                    <React.Fragment>
                        <div onClick={this.handlePopupClose} style={{ paddingLeft: '5%', paddingRight: '5%', height: '100%', width: '100%', bottom: '0px', zIndex: '9998', position: 'fixed', backgroundColor: '#000000a6' }}>
                            <Fade bottom>
                                <div className="bg-white" style={{ height: 'auto', left: '0', width: '100%', padding: '20px', paddingBottom: '20px', bottom: '0px', position: 'fixed', zIndex: '9999' }}>
                                    <h5>Are you sure about Cancel ?</h5>
                                    <div className="col-12 font-weight-bold" onClick={this.__cancelOrder} style={{ border: 'solid 2px #ef5350', "padding": "10px", "color": "#ef5350", "fontSize": "large", "textAlign": "center", "borderRadius": "8px" }}>
                                        Yes, Cancel
                                        <Ink duration="500" hasTouch="true" />
                                    </div>
                                </div>
                            </Fade>
                        </div>
                    </React.Fragment>
                )}
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
)(order);
