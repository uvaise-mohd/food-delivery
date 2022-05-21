import React, { Component } from "react";
import { Redirect } from "react-router";
import Footer from "../Footer";

class Chat extends Component {

    render() {
        // console.log("Show BG Image:", this.state.showBgImage);

        if (window.innerWidth > 768) {
            return <Redirect to="/" />;
        }
        if (localStorage.getItem("storeColor") === null) {
            return <Redirect to={"/"} />;
        }
        return (
            <React.Fragment>
                <iframe style={{ width: '100vw', height: '100vh' }} src="https://tawk.to/chat/6172d514f7c0440a591f8915/1fiqv10e1" />

                <Footer />
            </React.Fragment>
        );
    }
}

export default (Chat);
