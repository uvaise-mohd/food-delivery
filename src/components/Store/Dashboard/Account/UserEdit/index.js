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
        name: this.props.store_user.data.name,
        phone: this.props.store_user.data.phone,
        email: this.props.store_user.data.email,
        password: null,
        confirm_password: null,
		loading: false,
		error: false,

	};

	componentDidMount(){
        this.setState({
            successSnack: false
        });

    }

    __updateUser(){
        if (this.state.password == this.state.confirm_password) {
            this.setState({ loading: true });
            axios
            .post('https://app.snakyz.com/public/api/store/update-user', {
                token: this.props.store_user.data.auth_token,
                name: this.state.name,
                phone: this.state.phone,
                email: this.state.email,
                password: this.state.password,
            })
            .then((response) => {
                const { store_user } = this.props;
                //update delivery guy info
                this.props.updateStoreUserInfo(store_user.data.id, store_user.data.auth_token);
                
                this.setState({ loading: false });
                this.setState({ successSnack: true })
                setTimeout(
                    () => this.setState({ successSnack: false}), 
                    3000
                );
            });
        } else {
            this.setState({ error: true });
        }
    }

    handleChangeName(event) {
        this.setState({ [event.target.id]: event.target.value }) 
    }

	render() {
        const { store_user } = this.props;
        // console.log(this.state.name);
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
            {this.state.error && (
				<div className="auth-error">
					<div className="error-shake"> Passwords do not match. </div>
				</div>
			)}
            <div className="bg-grey pt-50 pb-50" style={{ height: '100vh' }}>
                <div className="bg-white ml-15 mr-15 mt-20 p-15" style={{ borderRadius: '8px' }}>
                    <div>
                        <label style={{ fontWeight: '600' }}>Name</label>
                        <input style={style_input} type="text"  value={this.state.name} id={"name"} onChange={(e) => this.handleChangeName(e)}></input>	 
                    </div>
                    <div className="mt-5">
                        <label style={{ fontWeight: '600' }}>Phone</label>
                        <input style={style_input} type="tel"  value={this.state.phone} id={"phone"} onChange={(e) => this.handleChangeName(e)}></input>	 
                    </div>
                    <div className="mt-5">
                        <label style={{ fontWeight: '600' }}>Email</label>
                        <input style={style_input} type="email"  value={this.state.email} id={"email"} onChange={(e) => this.handleChangeName(e)}></input>	 
                    </div>
                    <div className="mt-5">
                        <label style={{ fontWeight: '600' }}>Password</label>
                        <input style={style_input} type="password"  value={this.state.password} id={"password"} onChange={(e) => this.handleChangeName(e)} placeholder="Enter New Password"></input>	 
                    </div>
                    <div className="mt-5">
                        <label style={{ fontWeight: '600' }}>Confirm Password</label>
                        <input style={style_input} type="password"  value={this.state.confirm_password} id={"confirm_password"} onChange={(e) => this.handleChangeName(e)} placeholder="Confirm Password"></input>	 
                    </div>
                    <div className="mt-20 text-center mb-20">
                        <div style={{ color: '#7C83FD', border: '1px solid #7C83FD', display: 'flex', width: '35vw', paddingLeft: '8vw', paddingTop: '1vh', paddingBottom: '1vh', borderRadius: '5px' }} className="mr-15" onClick={() => this.__updateUser()} ><PaperUpload /><span className="mt-1 ml-2">Update</span></div>
                    </div>     
                </div>
            </div>
            {this.state.successSnack == true &&
            <div className="no-click" style={
                {"position":"fixed","top":"50px","textAlign":"center","width":"100%","backgroundColor":"#60b246","color":"#f4f4f5","padding":"0.8rem","zIndex":"2147483647"}
            }>
                    <div className="error">Updated Succesfully</div>
            </div>}
           
			{/* <Footer active_products={true} /> */}
            </React.Fragment>
		);
	}
}



const mapStateToProps = (state) => ({
	store_user: state.store_user.store_user,
});

export default connect(
	mapStateToProps,
	{ updateStoreUserInfo }
)(StoreEdit);