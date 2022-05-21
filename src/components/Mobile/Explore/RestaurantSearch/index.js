import React, { Component } from "react";
import Ink from "react-ink";

class RestaurantSearch extends Component {
    state = {
        restaurant: ""
    };
    componentDidMount() {
        this.searchInput.focus();
    }
    static contextTypes = {
        router: () => null
    };

    handleInputChange = e => {
        this.setState({ restaurant: e.target.value });
        this.props.searchFunction(e.target.value);
    };

    render() {
        return (
            <React.Fragment>
                <div className="bg-white">
                    <div className="input-group search-box" style={{ position: 'fixed', zIndex: '9999', top: '8vh', borderRadius: '0.8rem',
                        backgroundColor: '#ffffff', boxShadow: 'rgb(136 136 136) 0px 0px 10px -3px', width: '90vw', left: '5vw' }}>
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder='Search for Food or Restaurants'
                            value={this.state.restaurant}
                            onChange={this.handleInputChange}
                            ref={input => {
                                this.searchInput = input;
                            }}
                            style={{ borderRadius: '0.8rem' }}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default RestaurantSearch;
