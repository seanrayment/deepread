import React, { Component } from "react";
import File from "./File"
import { Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../axiosApi';

/**
 * TODO: create a Files component and move create document to be nested here
 */
class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            fileList: [],
            searchChars: "",
            
        }
    }

    render() {
        return (
            <div className="files-body">
                <div className="header">
                    <Link to={"/"}><h1 className="logo">deepread.app</h1></Link>
                    <nav className="nav">
                        <div className="create-doc">
                            <Link className="nav-link" to="/create"><p>Create document</p></Link>
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
                    <div className="files-header">
                    <h2>Documents</h2>
                        <div className="files-control">
                            <input type="search" placeholder="Search for documents" onChange={this.updateSearch}></input>
                        </div>
                    </div>
                    <table>
                        <tbody>
                            {this.renderFiles()}
                        </tbody>
                    </table>
                    <div className="files-no-files">

                    </div>
                </div>
            </div>
        );
    }
    getDocs = () => {
        let response = axiosInstance.get('/documents/')
            .then(
                fileList => {
                    this.setState({ fileList: fileList.data });
                }).catch(error => {
                console.log("Error: ", JSON.stringify(error, null, 4));
                throw error;
            })
    } 

    renderFiles = () => {
        return this.state.fileList.filter(file => file.title.toLowerCase().includes(this.state.searchChars)).map(
            (file) => {
                return (<File selectFile={this.goToReader} file={file}></File>)
            }
        );
    }

    goToReader = (pk) => {
        this.props.history.push(`/document/${pk}`);
    }
    signOut = () => {
        this.props.signOut().then( () => {
            this.props.history.push("/login");
        });
    }

    createDocument = () => {

    }

    filterAndSearch = () => {
        console.log(this.state.fileList);
        return this.state.fileList.filter(file => file.props.owner.trim().toLowerCase().includes(this.state.searchChars));
    }

    updateSearch = (e) => {
        let searchChars = e.target.value.trim().toLowerCase();
        this.setState({ searchChars });
    }

    componentDidMount = () => {
        this.getDocs();
    }
}

export default Dashboard;