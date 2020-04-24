import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'
import Slider from '@material-ui/core/Slider';

class Reader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            prefs: {
                fontFamily: '',
                color: '',
                fontSize:'',
            },
        }

        
    }
    
    render () {
        if (this.state.file) {
            console.log(this.state.file.font_family);
            const bodyStyle = {
                color: `#${this.state.file.color}`,
                fontFamily: this.state.file.font_family.replace("_", " "),
                fontSize: `${this.state.file.font_size}px`,
              };
            return (
                <div>
                    <div className = "reader-body">
                        <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")}></IoMdArrowBack>
                        <h1>{this.state.file.title}</h1>
                        <p style={bodyStyle}>{this.state.file.contents}</p>
                        <div className="reader-prefs">
                            <form>
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
                                <select name="fontSize" onChange={this.handleChange} defaultValue={this.state.file.font_size}>
                                    <option value="12">12px</option>
                                    <option value="14">14px</option>
                                    <option value="16">16px</option>
                                    <option value="18">18px</option>
                                    <option value="20">20px</option>
                                    <option value="24">24px</option>
                                </select>
                                <select name="lineHeight" onChange={this.handleChange} defaultValue={this.state.file.font_size}>
                                    <option value="1">1</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2">16px</option>
                                </select>
                            </form>
                        </div>
                    </div> 
                </div>
            );
        }
        return ( <div></div> )
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
                font_size: this.state.prefs.fontSize,
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