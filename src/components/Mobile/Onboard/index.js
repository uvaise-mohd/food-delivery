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
                    className="bg-white"
                    style={{ height: "100vh" }}
                    
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
                      <img src="https://app.snakyz.com/assets/snaky/Illustration.png" />
                    </div>

                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div onClick={() => this.__secondSlider()} className="next-button d-flex align-items-center justify-content-center text-white">
                        <div>Next</div>
                      </div>
                      <DelayLink delay={200} to={"/login"}>

                      <div className="skip-button d-flex align-items-center justify-content-center">
                        <div>Skip</div>
                      </div>
                      </DelayLink>
                    </div>
                  </div>
                </React.Fragment>
              </animated.div>
            )}
          </Spring>
        )}
        {this.state.second && (
          <React.Fragment style={{ height: "100vh", backgroundColor: "#fff" }}>
            <div className="second-bg " >
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
                <img src="https://app.snakyz.com/assets/snaky/delivery-illu.png" />
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div onClick={this.__thirdSlider} className="next-button d-flex align-items-center justify-content-center text-white">
                  <div>Next</div>
                </div>
                <DelayLink delay={200} to={"/login"}>

                <div className="skip-button d-flex align-items-center justify-content-center">
                  <div>Skip</div>
                </div>
                </DelayLink>
              </div>
            </div>
          </React.Fragment>
        )}
        {this.state.third && (
          <React.Fragment style={{ height: "100vh", backgroundColor: "#fff" }}>
            <div className="third-bg ">
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
                <img src="https://app.snakyz.com/assets/snaky/illu-3.png" />
              </div>
              <DelayLink delay={200} to={"/login"}>
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <div className="next-button d-flex align-items-center justify-content-center text-white">
                    <div>Get Started</div>
                  </div>
                </div>
              </DelayLink>
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
