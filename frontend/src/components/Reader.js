import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'
import ReaderControl from './ReaderControl';

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
            const bodyStyle = {
                color: `#${this.state.file.color}`,
                fontFamily: this.state.file.font_family.replace("_", " "),
                fontSize: `${this.state.file.font_size}pt`,
              };
            return (
                <div>
                    <div className = "reader-body">
                        <div className="reader-controls">
                            <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")} />
                            <ReaderControl file={this.state.file} handleSelectChange = {this.handleSelectChange} handleColorChange = {this.handleColorChange} ></ReaderControl>
                        </div>
                        <div className="reader-main">
                            <h1>{this.state.file.title}</h1>
                            <p style={bodyStyle}>{this.state.file.contents}</p>
                        </div>
                        <div className="reader-annotations">
                        </div>
                    </div> 
                </div>
            );
        }
        return ( <div></div> )
    }
    handleColorChange = async(event) => {
        await this.updateColorPref(event);
        this.updateFile()
    }

    updateColorPref = async(event) => {
        this.setState( {
            prefs: {
                color: event.hex.substring(1),
            }
        })
    }

    handleSelectChange = async(event, meta) => {
        await this.updateSelectPref(event, meta);
        this.updateFile(event);
    }

    updateSelectPref = (event, meta) => {
        this.setState ( {
            prefs: {
                [meta.name]: event.value,
            }
        })
    }

    updateFile = async() => {
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