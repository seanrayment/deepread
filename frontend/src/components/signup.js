import React, { Component } from "react";
import axiosInstance from '../axiosApi';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password: "",
        };
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axiosInstance.post('/user/create/', {
            email: this.state.email,
            username: this.state.email,
            password: this.state.password
        }).then ( () => { //is this the best way to do this?
            axiosInstance.post('/token/obtain/', {
                username: this.state.email,
                password: this.state.password,
            }).then(
                result => {
                    axiosInstance.defaults.headers['Authorization'] = "JWT " + result.data.access;
                    localStorage.setItem('access_token', result.data.access);
                    localStorage.setItem('refresh_token', result.data.refresh);
                }).then( () => {
                    this.props.checkAuth();
                    }).then( () => {
                        this.props.history.push("/");
                        }).catch(error => {
                            console.log(error.stack);
                            this.setState({errors: error.response.data});
                        })
        });
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
        )
    }
}
export default SignUp;