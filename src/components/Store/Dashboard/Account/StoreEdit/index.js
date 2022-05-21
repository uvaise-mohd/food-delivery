import React, { Component } from "react";
import { updateStoreUserInfo } from "../../../../../services/Store/user/actions";
import { connect } from "react-redux";
import Ink from "react-ink";
import TopBar from "../../TopBar";
import axios from "axios";
import Fade from 'react-reveal/Fade';
import { PaperUpload } from 'react-iconly';
import Loading from "../../../../helpers/loading";

class StoreEdit extends Component {

    static contextTypes = {
		router: () => null,
	};
	
	state = {
        store: [],
        name: null,
        description: null,
        min_order_price: null,
		loading: true,

	};

	componentDidMount(){
        this.__fetchData();
        this.setState({
            successSnack: false
        });

    }

    __fetchData(){
        axios
		.post('https://chopze.com/public/api/store/view-store', {
            token: this.props.store_user.data.auth_token,
            id: this.props.match.params.id
		})
		.then((response) => {
            this.setState({ loading: false });
            const store = response.data;

            if(store.store){
                this.setState({
                    store: store.store,
                    name: store.store.name,
                    description: store.store.description,
                    min_order_price: store.store.min_order_price,

                });
            }else{
                this.setState({
                    store: []
                });
            }
		});

    }

    __updateItem(){
        this.setState({ loading: true });
        axios
		.post('https://chopze.com/public/api/store/update-store', {
            token: this.props.store_user.data.auth_token,
            id: this.props.match.params.id,
            name: this.state.name,
            description: this.state.description,
            min_order_price: this.state.min_order_price,
		})
		.then((response) => {
            this.setState({ loading: false });
            this.setState({ successSnack: true })
            setTimeout(
                () => this.setState({ successSnack: false}), 
                3000
              );
		});
    }

    handleChangeName(event) {
        this.setState({ [event.target.id]: event.target.value }) 
    }

	render() {
        const { store_user } = this.props;
        const { store } = this.state;
        const style_input = {
            height: '3.4em',
            border: '1px solid #D9D9D9',
            borderRadius: '4px',
            width: '100%',
            paddingLeft: '20px',
            background: 'white',
            color: 'black',
            marginBottom: '12px'
                };
		return (
			<React.Fragment>
            <TopBar
					back={true}
			/>
            {this.state.loading && <Loading />}
            <div className="bg-grey pt-50 pb-50" style={{ height: '100vh' }}>
                <div className="bg-white ml-15 mr-15 mt-20 p-15" style={{ borderRadius: '8px' }}>
                    <div>
                        <label style={{ fontWeight: '600' }}>Store Name</label>
                        <input style={style_input} type="text"  value={this.state.name} id={"name"} onChange={(e) => this.handleChangeName(e)}></input>	 
                    </div>
                    <div>
                        <label style={{ fontWeight: '600' }}>Store Description</label>
                        <input style={{ height: '5em', border: '1px solid #D9D9D9', borderRadius: '4px', width: '100%', paddingLeft: '20px', background: 'white', color: 'black', marginBottom: '12px' }} type="text"  value={this.state.description} id={"description"} onChange={(e) => this.handleChangeName(e)}></input>	 
                    </div>
                    <div className="mt-5">
                        <label style={{ fontWeight: '600' }}>Min Order Price</label>
                        <input style={style_input} type="text"  value={this.state.min_order_price} id={"min_order_price"} onChange={(e) => this.handleChangeName(e)} placeholder="Enter Min Order Price"></input>	 
                    </div>
                    <div className="mt-20 text-center mb-20">
                        <div style={{ color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '35vw', paddingLeft: '8vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px' }} className="mr-15" onClick={() => this.__updateItem()} ><PaperUpload /><span className="mt-1 ml-2">Update</span></div>
                    </div>     
                </div>
            </div>
            {this.state.successSnack == true &&
            <div className="no-click" style={
                {"position":"fixed","top":"50px","textAlign":"center","width":"100%","backgroundColor":"#60b246","color":"#f4f4f5","padding":"0.8rem","zIndex":"2147483647"}
            }>
                    <div className="error">Updated Succesfully</div>
            </div>}

            {this.state.deletePopup == true && (
                <React.Fragment>
                    <div onClick={this.handlePopupClose} style={{paddingLeft:'5%', paddingRight:'5%',height:'100%', width: '100%',bottom:'0px', zIndex: '9998',position: 'fixed', backgroundColor:'#000000a6'}}>	
                        <Fade bottom>
                            <div className="bg-white" style={{height:'auto',left:'0',width: '100%',padding:'20px',paddingBottom:'20px', bottom:'0px', position: 'fixed', zIndex: '9999'}}>
                                <h5>Are you sure about Delete ?</h5>
                                <div className="col-12 font-weight-bold" onClick={this.__deleteItem} style={{border:'solid 2px #ef5350',"padding":"10px","color":"#ef5350","fontSize":"large","textAlign":"center","borderRadius":"8px"}}>
                                    Yes, Delete
                                    <Ink duration="500" hasTouch="true" />
                                </div>
                            </div>
                        </Fade>
                    </div>
                </React.Fragment>
            )}
           
			{/* <Footer active_products={true} /> */}
            </React.Fragment>
		);
	}
}



const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
	order_history: state.store_user.order_history,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo }
)(StoreEdit);