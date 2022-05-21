import React, { Component } from "react";
import { ArrowLeft } from "react-iconly";

class Help extends Component {

    static contextTypes = {
		router: () => null,
	};

    render() {

        return (
            <React.Fragment>
                <div className="bg-white" style={{ minHeight: '100vh' }}>
                    <div style={{ "position": "absolute", "top": "15px", "left": "15px" }} onClick={() => this.context.router.history.goBack()}>
                        <ArrowLeft />
                    </div>
                    <div className="text-center pt-15" style={{ "ontSize": "15px", "fontWeight": "bolder" }}>
                        Help & Support
                    </div>


                    <div className="p-15">
                        <p style={{ textAlign: "justify", marginTop: "15px" }}>
                            Let's take a step ahead and help you better. Ask us anything and we'll help you find the answers. Response time: 9:30AM to 5:30PM
                        </p>
                        <hr />
                        <p className="mb-1 font-weight-bold">Email us on</p>
                        <p>
                            Need help with the Chopze app? Write us an email and we'll get back to you at the earliest.
                            <p className="mt-2"><a className="font-weight-bold" href="mailto:help@app.snakyz.com" style={{ color: localStorage.getItem("storeColor") }}>help@app.snakyz.com</a></p>
                        </p>
                        <hr />
                        <p className="mb-1 font-weight-bold">Connect us on</p>
                        <p>
                            You can get assistance for any order related queries by calling the number which is
                            <p className="mt-2"><a className="font-weight-bold" href="tel:+916238298358" style={{ color: localStorage.getItem("storeColor") }}>+91 6238298358</a></p>
                        </p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default (Help);
