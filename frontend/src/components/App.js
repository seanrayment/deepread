import React, { Component} from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import Login from "./login";
import SignUp from "./signup";
import ThankYou from "./ThankYou";
import Dashboard from "./Dashboard";
import '../App.css';
import axiosInstance from "../axiosApi";

class App extends Component {

    /**
     * isAuthed: boolean of login state 
     * user: data associated with current user
     * These states are used to protect routes from logged-out users
     */
    constructor() {
        super();
        this.state = {
            isAuthed: false,
            user: null,
        }
    }

    componentDidMount = () => {
        this.checkAuth();
    }

    /**
     * Use the locally stored access token to get user information.
     */
    checkAuth = () => {
        if (localStorage.getItem('access_token')) {
            console.log(localStorage.getItem('access_token'))
            axiosInstance.get('/user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('access_token')}`
                }
            }).then(
                (res) => {
                    this.setState({isAuthed:true, user: res.data,})
            }).catch(error => {
                throw error
            });
        }
    }

    /**
     * Called as a function from nav bar
     */
    handleLogout = () => {
        const response = axiosInstance.post('/blacklist/', {
            "refresh_token": localStorage.getItem("refresh_token"),
        }).then(response => {
            console.log("about to delete the tokens")
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            this.setState({
                isAuthed:false,
                user: null,
            });
            axiosInstance.defaults.headers['Authorization'] = null;
        }).catch(error => {
            console.log(error);
        })
        return response;
    }

    /**
     * Instead of route's component property, we use a render function to pass in props and conditionally decide which page to display
     * 
     * the "/(dashboard|)/" path routes to both "/" and "/dashboard"
     */
    render() {
        return (
            <div className="site">
                <main>
                    <Switch>
                        <Route exact path={"/login/"} render = { (props) => (!this.state.isAuthed ? <Login {...props} checkAuth={this.checkAuth}/> : <Redirect to="/"/>)} />
                        <Route exact path={"/register/"} render ={ (props) => <SignUp {...props} checkAuth = {this.checkAuth} ></SignUp>}/>
                        <Route exact path={"/(dashboard|)/"} render = { (props) => (this.state.isAuthed ? <Dashboard {...props} user = {this.state.user} signOut = {this.handleLogout}/> : <Redirect to="/login" /> )} />
                        <Route exact path={"/thankyou/"} component={ThankYou}/>
                    </Switch>
                </main>
            </div>
      );
  }
}

export default App;