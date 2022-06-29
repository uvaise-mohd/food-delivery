import React, { Component } from "react";
import { WEBSITE_URL } from "../../../../configs/website";
import DelayLink from "../../../helpers/delayLink";

class ItemCategories extends Component {
  render() {
    const { item_categories, __selectCategory, selected_category } = this.props;
    // console.log(selected_category);
    return (
      <React.Fragment>
        <div
          className="mt-20"
          style={{
            display: "flex",
            overflowX: "auto",
            // justifyContent: "space-around",
          }}
        >
          {item_categories &&
            item_categories.length !== 0 &&
            item_categories.map((category) => (
              <>
                <div className="ml-10" onClick={() => __selectCategory(category)}>
                  <div
                    className="d-flex   align-items-center justify-content-center"
                    style={{
                      backgroundColor:
                        selected_category.id === category.id
                          ? "#ff0000"
                          : "#F5F5F8",
                      borderRadius: "10px",
                      height: "50px",
                      padding: "10px",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                        objectFit: "cover",
                        borderRadius: "100px",
                      }}
                      src={WEBSITE_URL + "/" + category.image}
                      alt="name"
                    />
                    <div
                      className="mt-1 ml-5"
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color:
                          selected_category.id === category.id
                            ? "#fff"
                            : "#525C67",
                      }}
                    >
                      {category.name}
                    </div>
                  </div>
                </div>
               
              </>
            ))}
        </div>
      </React.Fragment>
    );
  }
}

export default ItemCategories;
