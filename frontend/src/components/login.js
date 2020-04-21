import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import { useHistory } from "react-router-dom";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const response = axiosInstance.post('/token/obtain/', {
            username: "cole2",
            email: this.state.username,
            password: this.state.password
        }).then(
            result => {
                axiosInstance.defaults.headers['Authorization'] = "JWT " + result.data.access;
                localStorage.setItem('access_token', result.data.access);
                localStorage.setItem('refresh_token', result.data.refresh);
                return result.data;
            }
        ).then( (userData) => {
            this.props.setAuthed(this.state.username);
            this.props.history.push("/files");
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




            // <div>Login
            //     <form onSubmit={this.handleSubmit}>
            //         <label>
            //             Username:
            //             <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
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
export default Login;