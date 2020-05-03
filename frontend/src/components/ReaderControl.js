import React, { Component } from 'react'
import { FaHighlighter } from 'react-icons/fa'
import { IoMdOptions, IoMdClose } from 'react-icons/io'
import Select from 'react-select';
import { CompactPicker } from 'react-color';

import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'


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

const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: '90%',
      },
      selectEmpty: {
        marginTop: theme.spacing(2)
      },
      slider: {
        width: 200,
        fontSize: 16,
      },
      textField: {
          width: '10ch',
      }
});

const fontOptions = [
    {value: "Times New Roman" , label: "Times New Roman"},
    {value: "Arial" , label: "Arial"},
    {value: "Helvetica" , label: "Helevetica"},
    {value: "Georgia" , label: "Georgia"},
    {value: "Tahoma" , label: "Tahoma"},
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

    constructor(props) {
        super(props);
        console.log(props.file.char_width)
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


    render(){
        const { classes } = this.props;

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

                                    name="font_family"
                                    styles={selectStyle}
                                    defaultValue={ {label: this.props.file.font_family, value: this.props.file.font_family } }
                                    onChange={this.props.handleSelectChange} placeholder="Select font"
                                />
                                <FormControl className={classes.formControl}>
                                    <Typography id="discrete-slider">
                                        Size
                                    </Typography>
                                    <Slider
                                        defaultValue={this.props.file.font_size}
                                        onChangeCommitted={(event, value) => this.props.handleChange("font_size", event, value)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={2}
                                        marks
                                        min={8}
                                        max={48}
                                        name="font_size"
                                    />
                                </FormControl>
                                <div className="reader-colors-wrap">
                                    <CompactPicker color={`#${this.props.file.color}`} colors={swatch} onChange={this.props.handleColorChange} zDepth={0}/> 
                                </div>
                                <FormControl className={classes.formControl}>
                                    <Typography id="discrete-slider">
                                        Line Height
                                    </Typography>
                                    <Slider
                                        defaultValue={this.props.file.line_height}
                                        onChangeCommitted={(event, value) => this.props.handleChange("line_height", event, value)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={.25}
                                        marks
                                        min={.5}
                                        max={4.0}
                                        name="line_height"
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <Typography id="discrete-slider">
                                        Text Width
                                    </Typography>
                                    <Slider
                                        defaultValue={this.props.file && this.props.file.char_width ? this.props.file.char_width : 80 }
                                        onChangeCommitted={(event, value) => this.props.handleChange("char_width", event, value)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        min={40}
                                        max={120}
                                        name="char_width"
                                    />
                                </FormControl>
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

export default withStyles(styles)(ReaderControl);
