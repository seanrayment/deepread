import React, { Component } from "react";
import axiosInstance from '../axiosApi';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "cole2",
            password: "",
            email:""
        };

        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axiosInstance.post('/user/create/', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }).then(response => {
            return response
        }).catch(error => {
            console.log(error.stack);
            this.setState({errors: error.response.data});
        })
    }

    render() {
        return (
            <div className="login-body">
                <div className="login-content">
                    <h1>deepread.app</h1>
                    <div className="login-card">
                        <div className="login-form">
                            <h2>Register for an account</h2>
                            <form onSubmit={this.handleSubmit}>
                                <label>Email <br></br>
                                    <input type="email" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange}/>
                                </label>
                                <label>Password <br></br>
                                    <input type="password" placeholder="Enter your password" name = "password" value={this.state.password} onChange={this.handleChange}/>
                                </label>
                                <input type="submit" value = "Register" />
                            </form>
                        </div>
                    </div>
                    <div className="login-card signup-card">
                        <p>Already have an account? <a href="/login">  Login</a></p>
                    </div>
                </div>
            </div>

            // <div>
            //     Signup
            //     <form onSubmit={this.handleSubmit}>
            //         <label>
            //             Username:
            //             <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
            //         </label>
            //         <label>
            //             Email:
            //             <input name="email" type="email" value={this.state.email} onChange={this.handleChange}/>
            //         </label>
            //         <label>
            //             Password:
            //             <input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
            //         </label>
            //         <input type="submit" value="Submit"/>
            //     </form>
            // </div>
        )
    }
}
export default SignUp;