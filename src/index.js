import { BrowserRouter, Route, Switch } from "react-router-dom";
// import './assets/delivery-dark.css';
// import './assets/delivery-light.css';
import App from "./components/App";
import Loadable from "react-loadable";
import Loading from "./components/helpers/loading";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import withTracker from "./withTracker";

// import NotFound from "./components/NotFound";
const NotFound = Loadable({
	loader: () => import("./components/NotFound"),
	loading: () => <Loading />,
});

// import Location from "./components/Mobile/Location";
const Location = Loadable({
	loader: () => import("./components/Mobile/Location"),
	loading: () => <Loading />,
});

const DesktopLocation = Loadable({
	loader: () => import("./components/Desktop/Location"),
	loading: () => <Loading />,
});

// import Items from "./components/Mobile/Items";
// const Items = Loadable({
// 	loader: () => import("./components/Mobile/Items"),
// 	loading: () => <Loading />,
// });

// import Login from "./components/Mobile/Auth/Login";
const Login = Loadable({
	loader: () => import("./components/Mobile/Auth/LoginOtp"),
	loading: () => <Loading />,
});

const DesktopLogin = Loadable({
	loader: () => import("./components/Desktop/Auth/LoginOtp"),
	loading: () => <Loading />,
});

// import Register from "./components/Mobile/Auth/Register";
const Register = Loadable({
	loader: () => import("./components/Mobile/Auth/Register"),
	loading: () => <Loading />,
});

const Chat = Loadable({
	loader: () => import("./components/Mobile/Chat"),
	loading: () => <Loading />,
});

// import CartPage from "./components/Mobile/Cart";
const CartPage = Loadable({
	loader: () => import("./components/Mobile/Cart"),
	loading: () => <Loading />,
});

const DesktopCartPage = Loadable({
	loader: () => import("./components/Desktop/Cart"),
	loading: () => <Loading />,
});

const AvailableCoupons = Loadable({
	loader: () => import("./components/Mobile/Cart/Coupon/AvailableCoupons"),
	loading: () => <Loading />,
});

const DesktopAvailableCoupons = Loadable({
	loader: () => import("./components/Desktop/Cart/Coupon/AvailableCoupons"),
	loading: () => <Loading />,
});

// import Account from "./components/Mobile/Account";
const Account = Loadable({
	loader: () => import("./components/Mobile/Account"),
	loading: () => <Loading />,
});

const DesktopAccount = Loadable({
	loader: () => import("./components/Desktop/Account"),
	loading: () => <Loading />,
});

// import Explore from "./components/Mobile/Explore";
const Explore = Loadable({
	loader: () => import("./components/Mobile/Explore"),
	loading: () => <Loading />,
});

const DesktopExplore = Loadable({
	loader: () => import("./components/Desktop/Explore"),
	loading: () => <Loading />,
});

// import Addresses from "./components/Mobile/Account/Addresses";
const Addresses = Loadable({
	loader: () => import("./components/Mobile/Account/Addresses"),
	loading: () => <Loading />,
});

// import Checkout from "./components/Mobile/Checkout";
const Checkout = Loadable({
	loader: () => import("./components/Mobile/Checkout"),
	loading: () => <Loading />,
});

const DesktopCheckout = Loadable({
	loader: () => import("./components/Desktop/Checkout"),
	loading: () => <Loading />,
});

// import RunningOrder from "./components/Mobile/RunningOrder";
const RunningOrder = Loadable({
	loader: () => import("./components/Mobile/RunningOrder"),
	loading: () => <Loading />,
});

const DesktopRunningOrder = Loadable({
	loader: () => import("./components/Desktop/RunningOrder"),
	loading: () => <Loading />,
});

const CstViewOrder = Loadable({
	loader: () => import("./components/Mobile/ViewOrder"),
	loading: () => <Loading />,
});

const DesktopCstViewOrder = Loadable({
	loader: () => import("./components/Desktop/ViewOrder"),
	loading: () => <Loading />,
});

// import Orders from "./components/Mobile/Account/Orders";
const Orders = Loadable({
	loader: () => import("./components/Mobile/Account/Orders"),
	loading: () => <Loading />,
});

const DesktopOrders = Loadable({
	loader: () => import("./components/Desktop/Account/Orders"),
	loading: () => <Loading />,
});

// import WalletPage from "./components/Mobile/Account/Wallet";
const WalletPage = Loadable({
	loader: () => import("./components/Mobile/Account/Wallet"),
	loading: () => <Loading />,
});

const Help = Loadable({
	loader: () => import("./components/Mobile/Account/Help"),
	loading: () => <Loading />,
});

const DesktopWalletPage = Loadable({
	loader: () => import("./components/Desktop/Account/Wallet"),
	loading: () => <Loading />,
});
/* Delivery */
// import Delivery from "./components/Delivery";
const Delivery = Loadable({
	loader: () => import("./components/Delivery"),
	loading: () => <Loading />,
});

// import DeliveryLogin from "./components/Delivery/Login";
const DeliveryLogin = Loadable({
	loader: () => import("./components/Delivery/Login"),
	loading: () => <Loading />,
});

const DeliveryRegister = Loadable({
	loader: () => import("./components/Delivery/Register"),
	loading: () => <Loading />,
});

// import DeliveryOrders from "./components/Delivery/Orders";
const DeliveryOrders = Loadable({
	loader: () => import("./components/Delivery/Orders"),
	loading: () => <Loading />,
});

// import ViewOrder from "./components/Delivery/ViewOrder";
const ViewOrder = Loadable({
	loader: () => import("./components/Delivery/ViewOrder"),
	loading: () => <Loading />,
});

const DeliveryCompletedOrders = Loadable({
	loader: () => import("./components/Delivery/CompletedOrders"),
	loading: () => <Loading />,
});

const DeliveryUserEdit = Loadable({
	loader: () => import("./components/Delivery/Account/UserEdit"),
	loading: () => <Loading />,
});

// import GeoLocationPage from "./components/Mobile/GeoLocationPage";
const GeoLocationPage = Loadable({
	loader: () => import("./components/Mobile/GeoLocationPage"),
	loading: () => <Loading />,
});

const DesktopGeoLocationPage = Loadable({
	loader: () => import("./components/Desktop/GeoLocationPage"),
	loading: () => <Loading />,
});

// import SingleItem from "./components/Mobile/Items/SingleItem";
// const SingleItem = Loadable({
// 	loader: () => import("./components/Mobile/Items/SingleItem"),
// 	loading: () => <Loading />,
// });

const ItemsParent = Loadable({
	loader: () => import("./components/Mobile/Items/ItemsParent"),
	loading: () => <Loading />,
});

const DesktopItemsParent = Loadable({
	loader: () => import("./components/Desktop/Items/ItemsParent"),
	loading: () => <Loading />,
});

const SingleItemParent = Loadable({
	loader: () => import("./components/Mobile/Items/SingleItemParent"),
	loading: () => <Loading />,
});

const DesktopSingleItemParent = Loadable({
	loader: () => import("./components/Desktop/Items/SingleItemParent"),
	loading: () => <Loading />,
});

const SinglePage = Loadable({
	loader: () => import("./components/SinglePage"),
	loading: () => <Loading />,
});

const ForgotPassword = Loadable({
	loader: () => import("./components/Mobile/Auth/ForgotPassword"),
	loading: () => <Loading />,
});

const RestaurantListOnCategory = Loadable({
	loader: () => import("./components/Mobile/Home/RestaurantListOnCategory"),
	loading: () => <Loading />,
});

const RatingAndReview = Loadable({
	loader: () => import("./components/Mobile/Account/Orders/RatingAndReview"),
	loading: () => <Loading />,
});

const ViewStoreReviews = Loadable({
	loader: () => import("./components/Mobile/StoreReviews"),
	loading: () => <Loading />,
});

const Alerts = Loadable({
	loader: () => import("./components/Mobile/Alerts"),
	loading: () => <Loading />,
});

const FavoriteRestaurantList = Loadable({
	loader: () => import("./components/Mobile/Home/FavoriteRestaurants"),
	loading: () => <Loading />,
});

const DesktopFavoriteRestaurantList = Loadable({
	loader: () => import("./components/Desktop/FavoriteRestaurants"),
	loading: () => <Loading />,
});

const SlideItems = Loadable({
	loader: () => import("./components/Mobile/SlideItems"),
	loading: () => <Loading />,
});

const DesktopSlideItems = Loadable({
	loader: () => import("./components/Desktop/SlideItems"),
	loading: () => <Loading />,
});

const SlideStores = Loadable({
	loader: () => import("./components/Mobile/SlideStores"),
	loading: () => <Loading />,
});

const DesktopSlideStores = Loadable({
	loader: () => import("./components/Desktop/SlideStores"),
	loading: () => <Loading />,
});

const CategoryStores = Loadable({
	loader: () => import("./components/Mobile/CategoryStores"),
	loading: () => <Loading />,
});

const DesktopCategoryStores = Loadable({
	loader: () => import("./components/Desktop/CategoryStores"),
	loading: () => <Loading />,
});

const ScrollToTop = () => {
	window.scrollTo(0, 0);
	return null;
};

// Store Owner
const StoreLogin = Loadable({
	loader: () => import("./components/Store/Login"),
	loading: () => <Loading />,
});

const StoreRegister = Loadable({
	loader: () => import("./components/Store/Register"),
	loading: () => <Loading />,
});

const StoreAccount = Loadable({
	loader: () => import("./components/Store/Dashboard/Account"),
	loading: () => <Loading />,
});

const StoreDashboard = Loadable({
	loader: () => import("./components/Store"),
	loading: () => <Loading />,
});

const StoreReports = Loadable({
	loader: () => import("./components/Store/Dashboard/Reports"),
	loading: () => <Loading />,
});

const StoreOrders = Loadable({
	loader: () => import("./components/Store/Dashboard/Orders"),
	loading: () => <Loading />,
});

const StorePayout = Loadable({
	loader: () => import("./components/Store/Dashboard/Payout"),
	loading: () => <Loading />,
});

const CompletedOrders = Loadable({
	loader: () => import("./components/Store/Dashboard/CompletedOrders"),
	loading: () => <Loading />,
});

const StoreProducts = Loadable({
	loader: () => import("./components/Store/Dashboard/Products"),
	loading: () => <Loading />,
});

const StoreViewProducts = Loadable({
	loader: () => import("./components/Store/Dashboard/Products/View"),
	loading: () => <Loading />,
});

const StoreEdit = Loadable({
	loader: () => import("./components/Store/Dashboard/Account/StoreEdit"),
	loading: () => <Loading />,
});

const UserEdit = Loadable({
	loader: () => import("./components/Store/Dashboard/Account/UserEdit"),
	loading: () => <Loading />,
});

const AddItem = Loadable({
	loader: () => import("./components/Store/Dashboard/Products/NewItem"),
	loading: () => <Loading />,
});

const AddItemCategory = Loadable({
	loader: () => import("./components/Store/Dashboard/Products/NewItemCategory"),
	loading: () => <Loading />,
});

const AddAddon = Loadable({
	loader: () => import("./components/Store/Dashboard/Products/NewAddon"),
	loading: () => <Loading />,
});

const AddAddonCategory = Loadable({
	loader: () => import("./components/Store/Dashboard/Products/NewAddonCategory"),
	loading: () => <Loading />,
});

const OrderView = Loadable({
	loader: () => import("./components/Store/Dashboard/Orders/OrderView"),
	loading: () => <Loading />,
});



ReactDOM.render(
	<Root>
		<BrowserRouter>
			<React.Fragment>
				<Route component={ScrollToTop} />
				<Switch>
					{/* <Route exact strict  path="/:url*" render={props => <Redirect to={`${props.location.pathname}/`} />} /> */}
					<Route path={"/"} exact component={withTracker(App)} />

					{/* Test Routes*/}
					{/* <Route path={"/saurabh/test"} exact component={TestComponent} /> */}

					<Route path={"/search-location"} exact component={withTracker(Location)} />
					<Route path={"/desktop/search-location"} exact component={withTracker(DesktopLocation)} />
					<Route path={"/my-location"} exact component={withTracker(GeoLocationPage)} />
					<Route path={"/desktop/my-location"} exact component={withTracker(DesktopGeoLocationPage)} />

					<Route path={"/categories/stores"} exact component={withTracker(RestaurantListOnCategory)} />

					{/* <Route path={"/stores/:restaurant"} exact component={withTracker(Items)} /> */}
					<Route path={"/stores/:restaurant"} exact component={withTracker(ItemsParent)} />
					<Route path={"/desktop/stores/:restaurant"} exact component={withTracker(DesktopItemsParent)} />
					{/* <Route path={"/stores/:restaurant/:id"} exact component={withTracker(SingleItem)} /> */}
					<Route path={"/stores/:restaurant/:id"} exact component={withTracker(SingleItemParent)} />
					<Route path={"/desktop/stores/:restaurant/:id"} exact component={withTracker(DesktopSingleItemParent)} />

					<Route path={"/explore"} exact component={withTracker(Explore)} />
					<Route path={"/desktop/explore"} exact component={withTracker(DesktopExplore)} />

					<Route path={"/login"} exact component={withTracker(Login)} />
					<Route path={"/desktop/login"} exact component={withTracker(DesktopLogin)} />
					<Route path={"/login/forgot-password"} exact component={withTracker(ForgotPassword)} />
					<Route path={"/register"} exact component={withTracker(Register)} />

					<Route path={"/my-account"} exact component={withTracker(Account)} />
					<Route path={"/desktop/my-account"} exact component={withTracker(DesktopAccount)} />
					<Route path={"/alerts"} exact component={withTracker(Alerts)} />
					{/* <Route path={"/my-addresses"} exact component={withTracker(Addresses)} /> */}
					<Route path={"/my-wallet"} exact component={withTracker(WalletPage)} />
					<Route path={"/help"} exact component={withTracker(Help)} />
					<Route path={"/desktop/my-wallet"} exact component={withTracker(DesktopWalletPage)} />
					<Route path={"/my-orders"} exact component={withTracker(Orders)} />
					<Route path={"/desktop/my-orders"} exact component={withTracker(DesktopOrders)} />
					<Route path={"/rate-order/:id"} exact component={withTracker(RatingAndReview)} />
					<Route path={"/reviews/:slug"} exact component={withTracker(ViewStoreReviews)} />
					<Route path={"/banner-items/:banner_id"} exact component={withTracker(SlideItems)} />
					<Route path={"/desktop/banner-items/:banner_id"} exact component={withTracker(DesktopSlideItems)} />
					<Route path={"/slider-stores/:slider_id"} exact component={withTracker(SlideStores)} />
					<Route path={"/desktop/slider-stores/:slider_id"} exact component={withTracker(DesktopSlideStores)} />
					<Route path={"/category-stores/:category_id"} exact component={withTracker(CategoryStores)} />
					<Route path={"/desktop/category-stores/:category_id"} exact component={withTracker(DesktopCategoryStores)} />

					<Route path={"/checkout"} exact component={withTracker(Checkout)} />
					<Route path={"/desktop/checkout"} exact component={withTracker(DesktopCheckout)} />
					<Route path={"/running-order/:unique_order_id"} exact component={withTracker(RunningOrder)} />
					<Route path={"/desktop/running-order/:unique_order_id"} exact component={withTracker(DesktopRunningOrder)} />
					<Route path={"/view-order/:unique_order_id"} exact component={withTracker(CstViewOrder)} />
					<Route path={"/desktop/view-order/:unique_order_id"} exact component={withTracker(DesktopCstViewOrder)} />
					
					<Route path={"/chat"} exact component={withTracker(Chat)} />

					<Route path={"/cart"} exact component={withTracker(CartPage)} />
					<Route path={"/desktop/cart"} exact component={withTracker(DesktopCartPage)} />
					<Route path={"/coupons"} exact component={withTracker(AvailableCoupons)} />
					<Route path={"/desktop/coupons"} exact component={withTracker(DesktopAvailableCoupons)} />

					<Route path={"/pages/:slug"} exact component={withTracker(SinglePage)} />
					<Route path={"/my-favorite-stores"} exact component={withTracker(FavoriteRestaurantList)} />
					<Route path={"/desktop/my-favorite-stores"} exact component={withTracker(DesktopFavoriteRestaurantList)} />
					{/* Delivery Routes */}
					<Route path={"/delivery"} exact component={Delivery} />
					<Route path={"/delivery/login"} exact component={DeliveryLogin} />
					<Route path={"/delivery/register"} exact component={DeliveryRegister} />
					<Route path={"/delivery/orders"} exact component={DeliveryOrders} />
					<Route path={"/delivery/orders/:unique_order_id"} exact component={ViewOrder} />
					<Route path={"/delivery/completed-orders"} exact component={DeliveryCompletedOrders} />
					<Route path={"/delivery/edit-user"} component={DeliveryUserEdit} />

					{/* Restaurant Owner Routes*/}
					<Route path={"/store/login"} exact component={StoreLogin} />
					<Route path={"/store/register"} exact component={StoreRegister} />
					<Route path={"/store/dashboard"} exact component={StoreDashboard} />
					<Route path={"/store/orders"} exact component={StoreOrders} />
					<Route path={"/store/order/view/:unique_order_id"} exact component={OrderView} />
					<Route path={"/store/products"} exact component={StoreProducts} />
					<Route path="/store/view/product/:product_id" component={StoreViewProducts} />
					<Route path="/store/edit-user" component={UserEdit} />
					<Route path="/store/edit/:id" component={StoreEdit} />
					<Route path="/store/add-item" component={AddItem} />
					<Route path="/store/add-item-category" component={AddItemCategory} />
					<Route path="/store/add-addon" component={AddAddon} />
					<Route path="/store/add-addon-category" component={AddAddonCategory} />
					<Route path="/store/account" component={StoreAccount} />
					<Route path="/store/reports" component={StoreReports} />
					<Route path="/store/payout" component={StorePayout} />
					<Route path="/store/completed-orders" component={CompletedOrders} />
					{/* Restaurant Owner Routes End*/}

					{/* Common Routes */}
					<Route component={NotFound} />
				</Switch>
			</React.Fragment>
		</BrowserRouter>
	</Root>,
	document.getElementById("root")
);
