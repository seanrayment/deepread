import React, { Component } from "react";
import File from "./File"
import { Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../axiosApi';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            fileList: [ 
                <File name={"Out There"}></File>,
                <File name={"When You're Pregnant During a Pandemic"}></File>,
                <File name={"How Cancer Cells Learn to Resist Chemotherapy"}></File>
            ],
            searchChars: "",
        }
    }

    componentDidMount() {
        this.getDocs();
    }

    render() {
        return (
            <div className="files-body">
                <div className="header">
                    <Link to={"/"}><h1 className="logo">deepread.app</h1></Link>
                    <nav className="nav">
                        <div className="create-doc">
                            <p>Create document</p>
                        </div> 
                        <div className="user-dropdown-wrapper">
                            <div className="user-dropdown">
                                <p>{this.props.user.email}</p>
                                <FaChevronDown color={"#723EE0"}/>
                            </div> 
                            <div className="menu">
                                <Link to="/login" onClick={this.signOut}>Sign out</Link>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="files-content">
                    <h2>My Documents</h2>
                    <div className="files-control">
                        <input type="search" placeholder="Search for documents" onChange={this.updateSearch}></input>
                    </div>
                    <table>
                        <tbody>
                            {this.filterAndSearch()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    signOut = () => {
        this.props.signOut().then( () => {
            this.props.history.push("/login");
        });
    }

    getDocs = () => {
        let response = axiosInstance.get('/documents/')
            .then(
                result => {
                    console.log(result)
            }).catch(error => {
                console.log("Error: ", JSON.stringify(error, null, 4));
                throw error;
            })
    } 

    filterAndSearch = () => {
        return this.state.fileList.filter(file => file.props.name.trim().toLowerCase().includes(this.state.searchChars));
    }

    updateSearch = (e) => {
        let searchChars = e.target.value.trim().toLowerCase();
        this.setState({ searchChars });
    }

    componentDidCatch = () => {
        console.log(this.props.state.location.user);
    }
}

export default Dashboard;