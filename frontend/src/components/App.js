import React, { Component} from "react";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import ThankYou from "./ThankYou";
import Files from "./Files";
import '../App.css';
import axiosInstance from "../axiosApi";

class App extends Component {

    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        const response = axiosInstance.post('/blacklist/', {
            "refresh_token": localStorage.getItem("refresh_token")
        }).then(response => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className="site">
                {/* <nav>
                    <Link className={"nav-link"} to={"/"}>Home</Link>
                    <Link className={"nav-link"} to={"/login/"}>Login</Link>
                    <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
                    <Link className={"nav-link"} to={"/hello/"}>Hello</Link>
                    <button onClick={this.handleLogout}>Logout</button>
                </nav> */}
                <main>
                    <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/register/"} component={SignUp}/>
                        <Route exact path={"/files/"} component={Files}/>
                        <Route exact path={"/thankyou/"} component={ThankYou}/>
                        <Route exact path={"/"} component={Files} />
                    </Switch>
                </main>
            </div>
      );
  }
}

export default App;