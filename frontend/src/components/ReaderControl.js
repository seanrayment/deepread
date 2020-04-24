import React, { Component } from 'react'
import { FaHighlighter } from 'react-icons/fa'
import { IoMdOptions, IoMdClose } from 'react-icons/io'
import Select from 'react-select';
import { CompactPicker } from 'react-color';

const swatch = ["#000000","#424242", "#9E9E9E", "#1565C0", "#E53935", "#4CAF50"]

const selectStyle = {
    control: (provided, state) => ({
        ...provided,
        border:'1px solid #e0e0e0',
        marginBottom:'1rem',
    })
}

const colorStyle = {
    boxShadow: "none"
}

const fontOptions = [
    {value: "times_new_roman" , label: "Times New Roman"},
    {value: "arial" , label: "Arial"},
    {value: "helvetica" , label: "Helevetica"},
    {value: "georgia" , label: "Georgia"},
    {value: "tahoma" , label: "Tahoma"},
]

const fontSize = [
    {value: "12" , label: "12pt"},
    {value: "14" , label: "14pt"},
    {value: "16" , label: "16pt"},
    {value: "18" , label: "18pt"},
    {value: "20" , label: "20pt"},
    {value: "24" , label: "24pt"},
]



class ReaderControl extends Component {
    constructor() {
        super();
        this.state = {
            displayPanel: false,
            useHighlighter: true,
        }
    }

    

    handleHighlighter = () => {
        this.setState({useHighlighter: !this.state.useHighlighter,})
    }
    handleDisplayPanel = () => {
        this.setState({displayPanel: !this.state.displayPanel});
    }

    capitalizeFirstLetter = (str) => {
        return str.replace(
            /\w\S*/g,
            (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    render(){
        return (
            <div className="reader-control-wrap">
                <div className="reader-highlight-box" onClick={this.handleHighlighter} style={{border:this.state.useHighlighter ? '1px solid #723EE0' : '1px solid #E0E0E0'}}>
                    <FaHighlighter />
                </div>
                { this.state.displayPanel ?
                    <div className="reader-prefs">
                        <div className="reader-panel-close-box">
                            <IoMdClose onClick={this.handleDisplayPanel} className="reader-panel-close"/>
                        </div>
                        <form>
                            <p>Font</p>
                            <div>
                                <Select 
                                    options={fontOptions}
                                    name="fontFamily"
                                    styles={selectStyle}
                                    defaultValue={ {label: this.capitalizeFirstLetter(this.props.file.font_family.replace(/[\W_]+/g,' ')), value: this.props.file.font_family } }
                                    onChange={this.props.handleSelectChange} placeholder="Select font"
                                />
                                <Select 
                                    options={fontSize}
                                    name="fontSize"
                                    styles={selectStyle}
                                    defaultValue={ {label:`${this.props.file.font_size}pt`, value: this.props.file.font_size } }
                                    onChange={this.props.handleSelectChange}
                                    placeholder="Select font" /> 
                                <div className="reader-colors-wrap">
                                    <CompactPicker color={`#${this.props.file.color}`} colors={swatch} onChange={this.props.handleColorChange} zDepth={0}/> 
                                </div>
                            </div>
                        </form>
                    </div>
                : <div onClick={this.handleDisplayPanel}>
                    <IoMdOptions  className="reader-options-icon"  />
                </div>}
                
            </div>
        )   
    }
}

export default ReaderControl;