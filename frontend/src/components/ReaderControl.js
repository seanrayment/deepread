import React, { Component } from 'react'
import { FaHighlighter } from 'react-icons/fa'
import { IoMdOptions, IoMdClose } from 'react-icons/io'
import { FiMoon, FiSun } from 'react-icons/fi'
import { GoNote } from 'react-icons/go'
import Select from 'react-select';
import { CompactPicker } from 'react-color';

import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const swatch = ["#000000","#424242", "#9E9E9E", "#1565C0", "#E53935", "#4CAF50"]

const selectStyle = {
    control: (provided, state) => ({
        ...provided,
        border:'1px solid #e0e0e0',
        marginBottom:'1rem',
        backgroundColor: state.selectProps.nightMode ? 'black' : 'white',
    }),
    singleValue: (provided, state) => ({
        color:state.selectProps.nightMode ? 'white' : 'black',
    }),

}
const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#723EE0'
      }
    },
});

const styles = theme => ({
    formControl: {
        margin: 0,
        width: '100%',
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
      },
});

const fontOptions = [
    {value: "Times New Roman" , label: "Times New Roman"},
    {value: "Arial" , label: "Arial"},
    {value: "Helvetica" , label: "Helevetica"},
    {value: "Georgia" , label: "Georgia"},
    {value: "Tahoma" , label: "Tahoma"},
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

    handleDisplayPanel = () => {
        this.setState({displayPanel: !this.state.displayPanel});
    }


    render(){
        const { classes } = this.props;

        return (
            <div className="reader-control-wrap">
                <div className="reader-toggles">
                    <div className="reader-highlight-box" onClick={this.props.handleHighlighter} style={{border: this.props.showHighlights ? '1px solid #723EE0' : '1px solid #E0E0E0', }}>
                        <FaHighlighter style={{color:this.props.nightMode ? 'white' : 'black'}}/>
                    </div>
                    <div className="reader-highlight-box" onClick={this.props.handleAnnotations} style={{border:this.props.showAnnotations ? '1px solid #723EE0' : '1px solid #E0E0E0',}}>
                        <GoNote style={{color:this.props.nightMode ? 'white' : 'black'}}/>
                    </div>
                </div>
                { this.state.displayPanel ?
                    <div className="reader-prefs">
                        <div className="reader-panel-close-box">
                        <MuiThemeProvider theme={theme}>
                            <FormControlLabel
                                control={<Switch size="small" checked={this.props.nightMode} onChange={this.props.toggleNightMode} color="primary" inputProps={{
                                    style: {
                                        color: theme.primary
                                    }
                                }} />}
                                label={(this.props.nightMode ?
                                    <FiSun style={{width:'20px', height:'20px',paddingTop:'.25rem', paddingLeft:'.25rem', color:'white'}} />
                                : <FiMoon style={{width:'20px', height: '20px', paddingTop:'.25rem', paddingLeft: '.25rem', color:'black'}} /> )}
                            />
                            <IoMdClose onClick={this.handleDisplayPanel} className="reader-panel-close"/>
                        </MuiThemeProvider>
                        </div>
                        <form>
                            <p style={{color: this.props.nightMode ? 'white' : 'black'}}>Font</p>
                            <div>
                                <MuiThemeProvider theme={theme}>
                                    <Select 
                                        options={fontOptions}
                                        name="font_family"
                                        styles={selectStyle}
                                        nightMode={this.props.nightMode}
                                        defaultValue={ {label: this.props.file.font_family, value: this.props.file.font_family } }
                                        onChange={this.props.handleSelectChange} placeholder="Select font"
                                    />
                                    <FormControl className={classes.formControl}>
                                        <Typography id="discrete-slider" style={{marginBottom:'.5rem', marginTop:'.5rem',  color: this.props.nightMode ? "white" : "black"}}>
                                            Size
                                        </Typography>
                                        <Slider
                                            defaultValue={this.props.file.font_size}
                                            onChangeCommitted={(event, value) => this.props.handleSliderChange("font_size", event, value)}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={2}
                                            min={8}
                                            max={48}
                                            color="primary"
                                            name="font_size"
                                        />
                                    </FormControl>
                                    <div className="reader-colors-wrap" style={{display:this.props.nightMode ? 'none' : 'block'}}>
                                        <p>Color</p>
                                        <CompactPicker color={`#${this.props.file.color}`} colors={swatch} onChange={this.props.handleColorChange} /> 
                                    </div>
                                    <FormControl className={classes.formControl}>
                                        <Typography id="discrete-slider" style={{marginBottom:'.5rem', marginTop:'.5rem', color: this.props.nightMode ? "white" : "black"}}>
                                            Line Height
                                        </Typography>
                                        <Slider
                                            defaultValue={this.props.file.line_height}
                                            onChangeCommitted={(event, value) => this.props.handleSliderChange("line_height", event, value)}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={.25}
                                            min={1.0}
                                            max={4.0}
                                            color="primary"
                                            name="line_height"
                                        />
                                    </FormControl>
                                </MuiThemeProvider>
                            </div>
                        </form>
                    </div>
                : <div onClick={this.handleDisplayPanel}>
                    <IoMdOptions className="reader-options-icon"  style={{color: this.props.nightMode ? 'white' : 'black'}}/>
                </div>}
                
            </div>
        )   
    }
}

export default withStyles(styles)(ReaderControl);
