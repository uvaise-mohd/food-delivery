import ProgressBar from "@ramonak/react-progress-bar";
import React, { Component } from "react";
import Ink from "react-ink";
import { Spring, animated } from "react-spring";
import { connect } from "react-redux";
import Axios from "axios";
import DelayLink from "../../helpers/delayLink";

class Onboard extends Component {
  state = {
    first: true,
    second: false,
    third: false,
    getStarted: false,
  };

  componentDidMount() {
    // if (!localStorage.getItem("lang")) {
    //     Axios.post("https://cutsarabia.com/public/api/get-translations", {
    //         lang: "en",
    //     })
    //         .then(response => {
    //             if (response.data.lang) {
    //                 const langs = response.data.data;
    //                 localStorage.setItem('lang', 'en');
    //                 langs.forEach(item => {
    //                     localStorage.setItem(item.key, item.value);
    //                 });
    //             }
    //             window.location.reload();
    //         });
    // } else {
    //     if (localStorage.getItem('lang') == 'ar') {
    //         var parg = document.getElementById("changeDir");
    //         parg.dir = "rtl";
    //     } else {
    //         var parg = document.getElementById("changeDir");
    //         parg.dir = "ltr";
    //     }
    //     this.setState({ loading: false });
    // }
    // setTimeout(() =>
    //     this.setState({ second: true, first: false }),
    //     3000)
    // setTimeout(() =>
    //     this.setState({ third: true, second: false, first: false }),
    //     6000);
    // setTimeout(() =>
    //     this.setState({ getStarted: true, third: false, second: false, first: false }),
    //     9000);
  }
  __secondSlider = () => {
    this.setState({ second: true, first: false });
  };
  __thirdSlider = () => {
    this.setState({ third: true, first: false, second: false });
  };
  __getStarted = () => {
    this.setState({
      getStarted: true,
      first: false,
      second: false,
      third: false,
    });
  };
  render() {
    const { user } = this.props;
    if (user && user.success) {
      console.log(user);
      window.location.href = "/home";
    }
    // if (user.success)
    return (
      <React.Fragment>
        {this.state.first && (
          <Spring
            from={{ opacity: 0, marginTop: "500px" }}
            to={{ opacity: 1, marginTop: "0px" }}
            // config={{ duration: 1000 }}
          >
            {(styles) => (
              <animated.div style={styles}>
                <React.Fragment>
                  <div
                    className="bg-white" style={{height:'100vh'}}
                    onClick={() => this.__secondSlider()}
                  >
                    <div className="pt-3 d-flex  align-items-center justify-content-center">
                      <div className="active-onboard-progress" />
                      <div className="inactive-onboard-progress" />
                      <div className="inactive-onboard-progress" />
                    </div>

                    <div className="onboard-text d-flex flex-column justify-content-start align-items-start p-5">
                      <span className="">Brow the largest variety of</span>
                      <span className="">fruits, vegetables,</span>
                      <span className="">groceries, drink</span>
                      <span className="">and more. </span>
                    </div>

                    <div className="onboard-image d-flex align-items-center justify-content-center">
                      <img src="assets/img/illustration.png" />
                    </div>

                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="next-button d-flex align-items-center justify-content-center text-white">
                        <div>Next</div>
                      </div>

                      <div className="skip-button d-flex align-items-center justify-content-center">
                        <div>Skip</div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              </animated.div>
            )}
          </Spring>
        )}
        {this.state.second && (
          <React.Fragment style={{height:'100vh',backgroundColor:'#fff'}}>
            <div className="second-bg " onClick={this.__thirdSlider}>
              <div className="pt-3 d-flex  align-items-center justify-content-center">
                <div className="inactive-onboard-progress" />
                <div className="active-onboard-progress ml-2" />
                <div className="inactive-onboard-progress" />
              </div>{" "}
              <div className="onboard-text d-flex flex-column justify-content-start h-100 align-items-start p-5">
                <span className="">Track your delivery in</span>
                <span className="">realtime.</span>
              </div>
              <div className="onboard-image d-flex align-items-center justify-content-center">
                <img src="assets/img/delivery-illu.png" />
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="next-button d-flex align-items-center justify-content-center text-white">
                  <div>Next</div>
                </div>

                <div className="skip-button d-flex align-items-center justify-content-center">
                  <div>Skip</div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {this.state.third && (
          <React.Fragment style={{height:'100vh',backgroundColor:'#fff'}}>
            <div className="third-bg " onClick={this.__getStarted}>
              <div className="pt-3 d-flex  align-items-center justify-content-center">
                <div className="inactive-onboard-progress" />
                <div className="inactive-onboard-progress" />
                <div className="active-onboard-progress ml-2" />
              </div>
              <div className="onboard-text d-flex flex-column justify-content-start h-100 align-items-start p-5">
                <span className="">Track your delivery in</span>
                <span className="">realtime.</span>
              </div>
              <div className="onboard-image d-flex align-items-center justify-content-center">
                <img src="assets/img/illu-3.png" />
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="next-button d-flex align-items-center justify-content-center text-white">
                  <div>Get Started</div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {this.state.getStarted && (
          <React.Fragment>
            <div
              className="get-started-bg overflow-hidden"
              onClick={() => this.__getStarted()}
            >
              <div className="pt-3 d-flex  align-items-around align-content-center flex-nowrap justify-content-around ">
                <div>
                  <ProgressBar
                    completed={100}
                    bgColor="#1B6600"
                    borderRadius="0px"
                    height="0.7vw"
                    width="20vw"
                    isLabelVisible={false}
                    baseBgColor="#c7c7c7"
                    maxCompleted={100}
                  />
                </div>
                <div>
                  <ProgressBar
                    completed={100}
                    bgColor="#1B6600"
                    height="0.7vw"
                    width="20vw"
                    borderRadius="0px"
                    isLabelVisible={false}
                    baseBgColor="#c7c7c7"
                    maxCompleted={100}
                  />
                </div>
                <div>
                  <ProgressBar
                    completed={100}
                    bgColor="#1B6600"
                    height="0.7vw"
                    width="20vw"
                    borderRadius="0px"
                    isLabelVisible={false}
                    baseBgColor="#c7c7c7"
                    maxCompleted={100}
                  />
                </div>
                <div>
                  <ProgressBar
                    completed={100}
                    bgColor="#1B6600"
                    height="0.7vw"
                    width="20vw"
                    borderRadius="0px"
                    isLabelVisible={false}
                    baseBgColor="#c7c7c7"
                    maxCompleted={100}
                  />
                </div>
              </div>
              <div
                className="d-flex flex-column justify-content-center align-items-start align-content-around h-100  px-4 "
                style={{ color: "#ffffff" }}
              >
                <span className="fs-4 fw-normal ">
                  {localStorage.getItem("cuts_satisfies_your_food")}
                </span>{" "}
                <span className="fs-4 fw-normal ">
                  {localStorage.getItem("cravings_with_your_favourite")}
                </span>{" "}
                <span className="fs-4 fw-normal ">
                  {localStorage.getItem("food_delivered_to_you")}
                </span>
                <span className="fs-4 fw-normal ">
                  {localStorage.getItem("wherever_you_are")}
                </span>
                <DelayLink delay={200} to={"/login"}>
                  <div className="mt-3 position-relative b-r-10">
                    <button
                      className="btn btn-warning text-white b-r-10 fw-bold py-3 px-5"
                      style={{
                        backgroundColor: "#FBA808",
                        border: "none",
                        outline: "none",
                      }}
                    >
                      {localStorage.getItem("get_started")}
                    </button>
                    <Ink duration={500} style={{ color: "#aaaaaaa" }} />
                  </div>
                </DelayLink>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, {})(Onboard);
// export default (Home);
