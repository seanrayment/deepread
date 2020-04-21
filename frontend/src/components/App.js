import React, { Component} from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
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
        this.state = {
            isAuthed: localStorage.get('acces_token') ? true : false,
            user: null,
        }
    }

    componentDidMount = () => {
        if (this.state.isAuthed) {
            
        }
    }

    setAuthed = (user) => {
        this.setState({isAuthed: true, user });
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
                        <Route exact path={"/login/"} render = { (props) => <Login {...props} setAuthed={this.setAuthed}/>}/>
                        <Route exact path={"/register/"} component={SignUp}/>
                        <Route exact path={"/files/"} render = { (props) => (this.state.isAuthed ? <Files {...props} user = {this.state.user}/> : <Redirect to="/login" /> )} />
                        <Route exact path={"/thankyou/"} component={ThankYou}/>
                        <Route exact path={"/"} component={Files} />
                    </Switch>
                </main>
            </div>
      );
  }
}

export default App;