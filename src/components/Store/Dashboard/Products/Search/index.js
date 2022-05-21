import React, { Component } from "react";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import FeatherIcon from 'feather-icons-react';
import axios from 'axios';
import DelayLink from "../../../../helpers/delayLink";
import Ink from "react-ink";

class Search extends Component {
    
	state = {
        value: [],
        products: [],
	};

    handleChange(event,auth_token) {
        this.setState({
            value: event,
        });
        this.setState({
            products: [],
        });
        if(event.length >= 4){
            axios
            .post('https://app.snakyz.com/public/api/store/search-product', {
                token: this.props.auth_token,
                query: event
            })
            .then((response) => {
                const products = response.data.products;
                if (products.length) {
                    // add new
                    this.setState({
                        products: products,
                        
                    });
                } else {
                    this.setState({
                        products: [],
                    });
                }
            });
        }
    };

    render() {
        return(
            <React.Fragment>
                <div className="col-12 bg-grey search-col" style={{
					textAlign: 'center',
					padding: '1em',
				}}>
					<div>
						<input style={{
							height: '3.4em',
							border: 'none',
							borderRadius: '8px  ',
							width: '100%',
							paddingLeft: '20px',
							background: 'white',
							color: 'black',
                            border: '1px solid #D9D9D9'
					    }} type="text" placeholder="Search Items" value={this.state.value} onChange={(e) => this.handleChange(e.target.value)}></input>	 
						    <FeatherIcon icon="search" style={{position: 'absolute',
								top: '24px',
								right: '45px',
								fontSize: '1.5em',
								transform: 'scale(-1, 1)',
								color: '#B3C0C1', }}/>
					</div>
                    {this.state.products.length > 0 && (
                    <div className="bg-white " style={{boxShadow:"rgba(0, 0, 0, 0.15) 0px 4px 8px 5px",position: 'absolute', zIndex: '9', width: '93%',marginTop: '6px', borderRadius: '6px'}}>
                        {this.state.products.map((product, index) => (
                            <DelayLink to={'/store/view/product/'+product.id}>
                                <div className="row mt-5" style={{"fontSize":"15px","padding":"5px","marginLeft":"19px","textAlign":"start","fontWeight":"bold","position":"relative"}}>
                                    <div className="col-8">
                                        {product.name}
                                    </div>
                                    <div className="col-4">
                                        ₹ {product.price}
                                    </div>
                                    <Ink duration="500" hasTouch="true" background={false} />
                                </div>
                            </DelayLink>
                        ))}
                    </div>
                    )}
				</div>
            </React.Fragment>
        );
    }
}

export default Search;
