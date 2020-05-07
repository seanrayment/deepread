import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../axiosApi';
import { BsFillPersonFill } from 'react-icons/bs'


/**
 * TODO: error catching
 */


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
            font_family: 'Arial',
            color: '000000',
            line_height:1.5,
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
                                <BsFillPersonFill style={{color:'white', padding:'1rem', width:18, height:18}}/>
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
                                    <textarea name="contents" type="textarea" rows="1" cols="50" onChange={this.handleChange}></textarea>
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