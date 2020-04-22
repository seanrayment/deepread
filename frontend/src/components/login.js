import React, { Component } from "react";
import axiosInstance from "../axiosApi";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }


    /**
     * Updates username and passwords states upon change
     */
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    /**
     * When a login is submitted, new access and refresh tokens are generated
     * Then, these tokens are stored in local storage
     * Then, a callback is made to App, whose state is updated to know that the user is logged in
     * Then, the user is redirected to the dashboard which is now aware of credentials
     */
    handleSubmit = (event) => {
        event.preventDefault();
        axiosInstance.post('/token/obtain/', {
            username: "cole2",
            email: this.state.username,
            password: this.state.password,
        }).then(
            result => {
                axiosInstance.defaults.headers['Authorization'] = "JWT " + result.data.access;
                localStorage.setItem('access_token', result.data.access);
                localStorage.setItem('refresh_token', result.data.refresh);
            }
        ).then( () => {
            this.props.checkAuth();
        }).then( () => {
            this.props.history.push("/");
        }).catch (error => {
            throw error;
        });
    }

    render() {
        return (
            <div className="login-body">
                <div className="login-content">
                    <h1>deepread.app</h1>
                    <div className="login-card">
                        <div className="login-form">
                            <h2>Sign in to your account</h2>
                            <form onSubmit={this.handleSubmit}>
                                <label>Email <br></br>
                                    <input type="email" onChange={this.handleChange} name="username" placeholder="Enter your email"/>
                                </label>
                                <label>Password <a href="">Forgot password?</a><br></br>
                                    <input type="password" onChange={this.handleChange} name="password" placeholder="Enter your password"/>
                                </label>
                                <input type="submit" value = "Submit" />
                            </form>
                        </div>
                    </div>
                    <div className="login-card signup-card">
                        <p>First time? <a href="/register">  Create an account</a></p>
                    </div>
                </div>

            </div>
        )
    }
}
export default Login;