import React, { Component } from "react";
import File from "./File"
import { Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import axiosInstance from '../axiosApi';
import moment from 'moment';
import Select from 'react-select';

const selectStyle = {
    control: (provided, state) => ({
        ...provided,
        border:'1px solid #e0e0e0',
        margin: '1rem 0',
        padding: '0 .5rem',
        width: '250px',
    })
}

const sortOptions = [
    {value: "created_at" , label: "Date Created"},
    {value: "updated_at" , label: "Date Updated"},
]

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            fileList: [],
            searchChars: "",
            sortField: "",
        }
    }

    render() {
        console.log("re-rendered")
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
                            <input aria-label="Search" type="search" placeholder="Search for documents" onChange={this.updateSearch}></input>
                            <Select 
                                options={sortOptions}
                                name="sortField"
                                styles={selectStyle}
                                onChange={this.handleSelectChange} 
                                placeholder="Sort by"
                                aria-label="sort documents"
                            />
                        </div>
                    </div>
                    {this.state.fileList.length > 0 ? (
                    <table>
                        <tbody>
                            {this.renderFiles()}
                        </tbody>
                    </table>
                    ) : (
                    <div className="files-no-files">
                        <p>No files to display. Create a file to get started.</p>
                    </div>
                    )}
                </div>
            </div>
        );
    }

    handleSelectChange = (event, meta) => {
        console.log(meta.name);
        this.setState ( {
                [meta.name]: event.value,
        });
    }

    deleteDoc = (pk) => {
        axiosInstance.delete(`/documents/${pk}`).then( () => {
            this.getDocs();
        });
    }

    getDocs = () => {
        axiosInstance.get('/documents/')
            .then(
                fileList => {
                    this.setState({ fileList: fileList.data });
                }).catch(error => {
                console.log("Error: ", JSON.stringify(error, null, 4));
                throw error;
            })
    } 

    renderFiles = () => {
        let fileList = this.state.fileList;

        switch (this.state.sortField) {
            case "created_at":
                fileList = fileList.sort((f1, f2) => moment(f2.created_at) - moment(f1.created_at));
                break;
            case "updated_at":
                fileList = fileList.sort((f1, f2) => moment(f2.updated_at) - moment(f1.updated_at));
                break;
            default:
                break;
        }        

        return fileList.filter(file => file.title.toLowerCase().includes(this.state.searchChars)).map(
            (file) => {
                console.log(file.created_at)
                return (<File key={file.pk} selectFile={this.goToReader} file={file} email={this.props.user.email} delete={this.deleteDoc}/>)
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