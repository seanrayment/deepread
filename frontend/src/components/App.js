import React, { Component} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import ThankYou from "./ThankYou";
import Dashboard from "./Dashboard";
import Reader from "./Reader";
import PageNotFound from "./PageNotFound";
import CreateDocument from "./CreateDocument";
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

    /**
     * Use the locally stored access token to get user information.
     */
    checkAuth = async () => {
        if (localStorage.getItem('access_token')) {
            try {
                axiosInstance.defaults.headers['Authorization'] = "JWT " + localStorage.getItem('access_token')
                let res = await axiosInstance.get('/user/'); 
                this.setState({isAuthed: true, user: res.data});    
            }
            catch (error) {
                throw error;
            }
        }
    }

    componentDidMount = () => {
        this.checkAuth();
    }

    /**
     * Called as a function from nav bar
     */
    handleLogout = () => {
        const response = axiosInstance.post('/blacklist/', {
            "refresh_token": localStorage.getItem("refresh_token"),
        }).then(response => {
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
                        <Route exact path={"/login/"} render = { (props) => 
                            (!this.state.isAuthed ? <Login {...props} checkAuth={this.checkAuth}/> : <Redirect to="/"/>)}
                        />
                        <Route exact path={"/register/"} render ={ (props) => 
                            <SignUp {...props} checkAuth = {this.checkAuth} ></SignUp>}
                        />
                        <Route exact path={"/thankyou/"} component={ThankYou}/>                        
                        <Route exact path={"/(dashboard|)/"} render = { (props) => 
                            (this.state.isAuthed ? <Dashboard {...props} user = {this.state.user} signOut = {this.handleLogout} /> : <Redirect to="/login" /> )}
                        />
                        <Route exact path={"/document/:pk"} render = { (props) => 
                            <Reader {...props} signOut = {this.handleLogout}/> } 
                        />
                        <Route exact path={"/create/"} render= { (props) => 
                            <CreateDocument {...props} user = {this.state.user} signOut = {this.handleLogout} />
                        } /> 
                        <Route exact path={"/(404|)/"} render = { (props) => 
                            <PageNotFound></PageNotFound>
                        } />
                        <Route render = { (props) => 
                            <Redirect to="/404"></Redirect>
                        } />

                    </Switch>
                </main>
            </div>
      );
  }
}

export default App;
