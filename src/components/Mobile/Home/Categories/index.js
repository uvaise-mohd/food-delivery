import React, { Component } from 'react';

class Categories extends Component {

    render() {
        return (
           <div style={styles.gridScroll}>
             {/*    {test &&
                test.map((dineout_category, index) => (
                  <div key={index} className="d-flex flex-column mt-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <Link to={"/master-category/" + dineout_category.id}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            minHeight: "20vw",
                            minWidth: "20vw",
                            maxHeight: "20vw",
                            maxWidth: "20vw",
                            borderRadius: "10px",
                            position: "relative",
                            backgroundColor:colors[Math.floor(Math.random() * colors.length)]
                          }}
                        >
                          <img
                            alt="naae"
                            style={{
                              height: "20vw",
                              width: "20vw",
                              position: "relative",
                              borderRadius: "10px",
                              filter:
                                "drop-shadow(rgba(0, 0, 0, 0.17) 2px 4px 6px)",
                              objectFit: "cover",
                            }}
                            src={
                              "https://app.shopbook.app" +
                              dineout_category.image
                            }
                          />
                          <Ink duration={500} />
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            marginTop: "10px",
                            color: "#000",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          {dineout_category.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                ))} */}
            </div>
        );
    }
}
var styles = {
    gridScroll: {
      display: "flex",
      gridAutoFlow: "column",
      flexWrap: "wrap",
      columnGap: "14px",
      height: "auto",
      alignItems: "center",
      rowGap: "0px",
      minWidth: "90px",
    },
  };
export default Categories;