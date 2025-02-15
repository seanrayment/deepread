import React, { Component } from "react";
import axiosInstance from '../axiosApi';
import BeatLoader from 'react-spinners/BeatLoader';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password: "",
            errors: {},
            loading: false
        };
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        let oldErrors = {...this.state.errors, ...{[event.target.name]: {}}};
        this.setState({errors: oldErrors});
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        this.setState({loading: true})
        try {
            await axiosInstance.post('/user/create/', {
                email: this.state.email,
                username: this.state.email,
                password: this.state.password,
            });

            let res = await axiosInstance.post('/token/obtain/', {
                username: this.state.email,
                password: this.state.password,
            });

            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);

            await this.props.checkAuth()
            this.setState(({loading: false}))
            this.props.history.push("/");

        } catch (error) {
            this.setState(({loading: false}))
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
                                    { this.state.errors.email && this.state.errors.email.length && this.renderErrors(this.state.errors.email) }
                                    <input type="email" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange}/>
                                </label>
                                <label>Password <br></br>
                                    { this.state.errors.password && this.state.errors.password.length && this.renderErrors(this.state.errors.password) }
                                    <input type="password" placeholder="Enter your password" name = "password" value={this.state.password} onChange={this.handleChange}/>
                                </label>
                                { this.state.loading ? <div className="loader"><BeatLoader className="loader" size={14} color="#723EE0" /></div> : <input type="submit" value = "Register" /> }
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