import React, { Component } from "react";

import Ink from "react-ink";
import { ChevronLeft } from "react-iconly";

class LoginBackButton extends Component {
    static contextTypes = {
        router: () => null
    };
    render() {
        return (
            <React.Fragment>
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ position: "relative" ,margin:'20px',backgroundColor:'#fff',border:'1px solid #e5e5e5',borderRadius:'100px',height:'40px',width:'40px'}}
                    onClick={this.context.router.history.goBack}
                >
                    <ChevronLeft size={'small'} stroke={'bold'}/>
                    <Ink duration="500" />
                </div>
            </React.Fragment>
        );
    }
}

export default LoginBackButton;
