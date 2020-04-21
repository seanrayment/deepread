import React, { Component } from "react";
import File from "./File"
import { Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';

class Files extends Component {
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

    render() {
        return (
            <div className="files-body">
                <div className="header">
                    <Link to={"/"}><h1 className="logo">deepread.app</h1></Link>
                    <nav className="nav">
                        <div className="create-doc">
                            <p>Create document</p>
                        </div> 
                        <div className="user-dropdown">
                                <p>cole_horvitz@brown.edu</p>
                            <FaChevronDown color={"#723EE0"}/>
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

    filterAndSearch = () => {
        return this.state.fileList.filter(file => file.props.name.trim().toLowerCase().includes(this.state.searchChars));
    }

    updateSearch = (e) => {
        let searchChars = e.target.value.trim().toLowerCase();
        this.setState({ searchChars });
    }
}

export default Files;