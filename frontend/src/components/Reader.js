import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

// styling to be applied dynamically via material-ui
const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: 100
      },
      selectEmpty: {
        marginTop: theme.spacing(2)
      },
      slider: {
        width: 120,
        fontSize: 16,
      },
      textField: {
          width: '10ch',
      }
});

class Reader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            file: null,
            prefs: {
                font_family: '',
                color: '',
                font_size:'',
                line_height: '',

            },
        }
    }
    
    render () {
        const { classes } = this.props;

        if (this.state.file) {
            const bodyStyle = {
                color: `#${this.state.file.color}`,
                fontFamily: this.state.file.font_family,
                fontSize: `${this.state.file.font_size}px`,
                lineHeight: `${this.state.file.line_height}`
              };
            return (
                <div>
                    <div className = "reader-body">
                        <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")}></IoMdArrowBack>
                        <h1>{this.state.file.title}</h1>
                        <p style={bodyStyle}>{this.state.file.contents}</p>
                        <div className="reader-prefs">
                            <form>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Font</InputLabel>
                                    <Select
                                    id="demo-simple-select"
                                    name="font_family"
                                    value={this.state.file.font_family}
                                    onChange={(event) => this.handleChange("font_family", event, event.target.value)}
                                    >
                                    <MenuItem value={"Times New Roman"}>Times New Roman</MenuItem>
                                    <MenuItem value={"Helvetica"}>Helvetica</MenuItem>
                                    <MenuItem value={"Arial"}>Arial</MenuItem>
                                    <MenuItem value={"Georgia"}>Georgia</MenuItem>
                                    <MenuItem value={"Tahoma"}>Tahoma</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Color</InputLabel>
                                    <Select
                                    id="demo-simple-select"
                                    name="color"
                                    value={this.state.file.color}
                                    onChange={(event) => this.handleChange("color", event, event.target.value)}
                                    >
                                    <MenuItem value={"E53935"}>red</MenuItem>
                                    <MenuItem value={"000000"}>black</MenuItem>
                                    <MenuItem value={"0288D1"}>blue</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                <Typography id="discrete-slider">
                                    Size
                                </Typography>
                                <Slider
                                    defaultValue={16}
                                    onChangeCommitted={(event, value) => this.handleChange("font_size", event, value)}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={2}
                                    marks
                                    min={8}
                                    max={48}
                                    name="font_size"
                                />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                <Typography id="discrete-slider">
                                    Line Height
                                </Typography>
                                <Slider
                                    defaultValue={this.state.file.line_height}
                                    onChangeCommitted={(event, value) => this.handleChange("line_height", event, value)}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={.25}
                                    marks
                                    min={.5}
                                    max={4.0}
                                    name="line_height"
                                />
                                </FormControl>
                            </form>
                        </div>
                    </div> 
                </div>
            );
        }
        return ( <div></div> )
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      };
    
    handleClose = () => {
    this.setState({ displayColorPicker: false })
    };

    handleChange = async(name, event, value) => {
        await this.setState({
            prefs: {
                [name]: value
            }
        });
        await this.updateFile();
    }

    updatePref = (event) => {
        this.setState ( {
            prefs: {
                [event.target.name]: event.target.value,
            }
        })
        console.log(this.state)
    }

    updateFile = async() => {
        try {
            let resp = await axiosInstance.put(`/documents/${this.props.match.params.pk}/`, {
                font_family: this.state.prefs.font_family,
                color: this.state.prefs.color,
                font_size: this.state.prefs.font_size,
                line_height: this.state.prefs.line_height,
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
export default withStyles(styles)(Reader);