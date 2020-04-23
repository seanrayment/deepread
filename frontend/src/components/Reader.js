import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'

class Reader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            prefs: {
                fontFamily: '',
                color: '',
            },
        }

        
    }
    
    render () {
        if (this.state.file) {
            console.log(this.state.file.font_family);
            const bodyStyle = {
                color: `#${this.state.file.color}`,
                fontFamily: this.convertFontString(this.state.file.font_family),
              };
            return (
                <div>
                    <div className = "reader-body">
                        <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")}></IoMdArrowBack>
                        <h1>{this.state.file.title}</h1>
                        <p style={bodyStyle}>{this.state.file.contents}</p>
                        <div className="reader-prefs">
                            <form onSubmit={this.updateFile}>
                                <select name="fontFamily" onChange={this.handleChange} defaultValue={this.state.file.font_family}>
                                    <option value="times_new_roman">Times New Roman</option>
                                    <option value="helvetica">Helvetica</option>
                                    <option value="arial">Arial</option>
                                    <option value="georgia">Georgia</option>
                                    <option value="tahoma">Tahoma</option>
                                </select>
                                <select name="color" onChange={this.handleChange} defaultValue={this.state.file.color}>
                                    <option value="E53935">red</option>
                                    <option selected value="000000">black</option>
                                    <option value="0288D1">blue</option>
                                </select>
                            </form>
                        </div>
                    </div> 
                </div>
            );
        }
        return ( <div></div> )
    }

    convertFontString = (str) => {
        return str.replace("_", " ").charAt(0).toUpperCase() + str.slice(1);
    }
    handleChange = async(event) => {
        await this.updatePref(event);
        this.updateFile(event);
    }

    updatePref = (event) => {
        this.setState ( {
            prefs: {
                [event.target.name]: event.target.value,
            }
        })
        console.log(this.state)
    }
    updateFile = async(event) => {
        try {
            let resp = await axiosInstance.put(`/documents/${this.props.match.params.pk}/`, {
                font_family: this.state.prefs.fontFamily,
                color: this.state.prefs.color,
            })
            this.setState({
                file: resp.data,
            })
        } catch (err) {
            console.log(err);
        }
    }

    componentDidMount = () => {
        this.renderFile();
    }

    renderFile = () => {
        axiosInstance.get(`/documents/${this.props.match.params.pk}/`)
        .then ( (response) => {
            this.setState({file: response.data});
        }).catch( err => {
            console.log(err);
        })
    }

}
export default Reader;