import React, { Component } from "react";
import Axios from "axios";
import { ChevronLeft } from "react-iconly";
import FeatherIcon from "feather-icons-react";
import { connect } from "react-redux";
import ItemCategories from "./ItemCategories";

class MasterCategories extends Component {
  static contextTypes = {
    router: () => null,
  };
  state = {
    master_category: [],
    item_categories: [],
    loading: true,
    selected_category:0,
  };
  componentDidMount() {
    this.setState({
      loading: true,
    });
    const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
    Axios.post("https://app.snakyz.com/public/api/get-master-caregory", {
      id: this.props.match.params.id,
      latitude: userSetAddress.lat,
      longitude: userSetAddress.lng,
    }).then((response) => {
      if (response.data.item_categories && response.data.item_categories.length!==0  ) {
        this.setState({
          selected_category: response.data.item_categories[0].id,
        });
      }
      this.setState({
        master_category: response.data.master_category,
        item_categories: response.data.item_categories,
        loading: false,
      });
    });
  }
  __selectCategory = (id) => {
    this.setState({
      selected_category: id,
    });
  }
  render() {
    const { cartProducts } = this.props;
    return (
      <div>
        {!this.state.loading &&
        this.state.master_category &&
        this.state.master_category.id ? (
          <React.Fragment>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  borderBottomRightRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              >
                <img
                  src={
                    "https://app.snakyz.com" + this.state.master_category.image
                  }
                  className=""
                  style={{
                    height: "20vh",
                    width: "100%",
                    objectFit: "cover",
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    boxShadow: "inset 0 0 40px #00000066",
                  }}
                  alt="store"
                />
              </div>
              <div
                style={{ position: "absolute", top: "10px", width: "100%" }}
                className="d-flex flex-column  pl-15 pr-15 pt-15"
              >
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <div
                    className="d-flex align-items-center justify-content-center p-2"
                    style={{
                      border: "1px solid #fff",
                      borderRadius: "8px",
                      minHeight: "40px",
                      minWidth: "40px",
                    }}
                    onClick={() => this.context.router.history.goBack()}
                  >
                    <ChevronLeft primaryColor="#fff" />
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center p-2"
                    style={{
                      border: "1px solid #fff",
                      borderRadius: "8px",
                      minHeight: "40px",
                      minWidth: "40px",
                      backgroundColor: "rgb(255, 255, 255,0.2)",
                    }}
                  >
                    <div>
                      <div style={{ position: "relative" }}>
                        <FeatherIcon
                          icon="shopping-bag"
                          size={18}
                          stroke={"#fff"}
                        />
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            position: "absolute",
                            top: "-5px",
                            height: "14px",
                            width: "14px",
                            borderRadius: "100px",
                            backgroundColor: "red",
                            fontSize: "8px",
                            color: "#fff",
                            right: "-5px",
                          }}
                        >
                          {cartProducts.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{ fontSize: "16px", fontWeight: "600", color: "#000",textAlign:'center' }}
                >
                  {this.state.master_category.name}
                </div>
              </div>
            </div>
            <div style={{height:'100vh',backgroundColor:'#fff'}}>
              <ItemCategories 
              item_categories={this.state.item_categories}
              __selectCategory={this.__selectCategory}
              selected_category={this.state.selected_category}
              />
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cartProducts: state.cart.products,
  cartTotal: state.total.data,
});

export default connect(mapStateToProps, {})(MasterCategories);
