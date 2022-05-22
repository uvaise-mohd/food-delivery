import React, { Component } from "react";

import FirstScreen from "./FirstScreen";
import Home from "./Home";
import Onboard from "./Onboard";

class Mobile extends Component {
    state = {
        showGdpr: false
    };
    componentDidMount() {
        setTimeout(() => {
            if (document.getElementsByClassName("popup-content")[0]) {
                document.getElementsByClassName("popup-content")[0].style.backgroundColor = "transparent";
            }
        }, 100);

        if (!localStorage.getItem("gdprAccepted")) {
            localStorage.setItem("gdprAccepted", "false");
            if (localStorage.getItem("showGdpr") === "true") {
                this.setState({ showGdpr: true });
            }
        }

        if (localStorage.getItem("showGdpr") === "true" && localStorage.getItem("gdprAccepted") === "false") {
            this.setState({ showGdpr: true });
        }
    }
    handleGdprClick = () => {
        localStorage.setItem("gdprAccepted", "true");
        this.setState({ showGdpr: false });
    };
    render() {
        return (
            <React.Fragment>
                {this.state.showGdpr && (
                    <div className="fixed-gdpr-mobile">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: <p>We use Cookies to give you the best possible service. By continuing to browse our site you are agreeing to our use of <strong>Cookies.&nbsp;</strong></p>
                            }}
                        ></span>
                        <span>
                            <button
                                className="btn btn-sm ml-2"
                                style={{ backgroundColor: '#FE0B15' }}
                                onClick={this.handleGdprClick}
                            >
                                Okay
                            </button>
                        </span>
                    </div>
                )}
                {localStorage.getItem("userSetAddress") ? (
                    <div>
                        <Home />
                    </div>
                ) : (
                    <Onboard languages={this.props.languages} />
                )}
            </React.Fragment>
        );
    }
}

export default Mobile;
