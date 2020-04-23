import React, { Component } from "react";
import axiosInstance from "../axiosApi";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
        };
    }


    /**
     * Updates username and passwords states upon change
     */
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        let oldErrors = {...this.state.errors, ...{[event.target.name]: {}}};
        this.setState({errors: oldErrors});
    }

    /**
     * When a login is submitted, new access and refresh tokens are generated
     * Then, these tokens are stored in local storage
     * Then, a callback is made to App, whose state is updated to know that the user is logged in
     * Then, the user is redirected to the dashboard which is now aware of credentials
     */
    handleSubmit = async(event) => {
        event.preventDefault();

        try {
            let res = await axiosInstance.post('/token/obtain/', {
                username: this.state.email,
                password: this.state.password,
            });
    
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            res = await axiosInstance.get('/user/');
            this.setState({isAuthed:true, user: res.data});
            this.props.history.push("/");
        } catch (error) {
            console.log(error.stack);
            this.setState({errors: error.response.data});
        }
    }

    renderErrors(errs) {
        return (
            <ul className="error-list">
                { errs.map((item, index) => (
                    <li className='error-list-item' key={index}>
                        { item }
                    </li>
                )) }
            </ul>
        )
    }

    renderError(err) {
        return (
            <span className="error-text">
                { err }
            </span>
        )
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
                                    { this.state.errors.email && this.state.errors.email.length && this.renderErrors(this.state.errors.email)}
                                    <input type="email" onChange={this.handleChange} name="email" placeholder="Enter your email"/>
                                </label>
                                <label>Password <a href="">Forgot password?</a><br></br>
                                    { this.state.errors.password && this.state.errors.password.length && this.renderErrors(this.state.errors.password)}
                                    <input type="password" onChange={this.handleChange} name="password" placeholder="Enter your password"/>
                                </label>

                                <input type="submit" value = "Submit" />
                                { this.state.errors.detail && this.renderError(this.state.errors.detail) }
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