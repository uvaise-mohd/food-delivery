import React, { Component } from "react";
import { Discount } from "react-iconly";

class HomeHeader extends Component {
  render() {
    return (
      <div className="col-12  snaky-home-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="menu-square">
            <div>
              <img src="assets/img/Menu.png" alt="menu"></img>
            </div>
          </div>
          <div>
            <img src="assets/img/snaky-logo-w.png" alt="menu"></img>
          </div>
          <div className="menu-square">
            <Discount set="light" primaryColor="#fe0000" />
          </div>
        </div>
      </div>
    );
  }
}

export default HomeHeader;
