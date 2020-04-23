import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../axiosApi';

class CreateDocument extends Component {

    constructor(){
        super();
        this.state = {
            title: "",
            contents: "",
        }
    }

    onSubmitForm = (event) => {
        event.preventDefault();
        axiosInstance.post("/documents/", {
            title: this.state.title,
            contents: this.state.contents,
        }).then (result => {
            this.props.history.push(`/document/${result.data.pk}`);
        })
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    render () {
        if (this.props.user !== null){
            return(
                <div className="files-body">
                    <div className="header">
                        <Link to={"/"}><h1 className="logo">deepread.app</h1></Link>
                        <nav className="nav">
                            <div className="create-doc">
                                <Link to={"/"} className="nav-link"><p>My documents</p></Link>
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
                        <h2>Create document</h2>
                        <form className="create-form" onSubmit={this.onSubmitForm}>
                            <div>
                                <label>TITLE <br></br>
                                    <input name="title" type="text" placeholder="Title" onChange={this.handleChange}></input>
                                </label>
                            </div>
                            <div>
                                <label>BODY <br></br>
                                    <input name="contents" type="textarea" onChange={this.handleChange}></input>
                                </label>
                            </div>
                            <input type="submit"></input>
                        </form>
                    </div>
                </div>
            );    
        }
        return <div></div>
    }
}

export default CreateDocument;