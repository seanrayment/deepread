import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'
import { withStyles } from '@material-ui/core/styles'
import ReaderControl from './ReaderControl';

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
                char_width: '',
                highlights: [],
            },
        }
    }
    
    render () {
        const { classes } = this.props;

        if (this.state.file) {
            const bodyStyle = {
                color: `#${this.state.file.color}`,
                fontFamily: this.state.file.font_family,
                fontSize: `${this.state.file.font_size}pt`,
                lineHeight: `${this.state.file.line_height}`,
                width: `${this.state.file.char_width}ch`
              };
            return (
                    <div className="reader-body">
                        <div className="reader-controls">
                            <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")} />
                            <ReaderControl file={this.state.file} handleChange = {this.handleChange} handleSelectChange = {this.handleSelectChange} handleColorChange = {this.handleColorChange} ></ReaderControl>
                        </div>
                        <div className="reader-main">
                            <h1>{this.state.file.title}</h1>
                            <p style={bodyStyle}>{this.state.file.contents}</p>
                        </div>
                        <div className="reader-annotations">
                        </div>
                    </div> 
            );
        }
        return ( <div></div> );
    }

    handleColorChange = async(event) => {
        await this.updateColorPref(event);
        await this.updateFile();
    }

    updateColorPref = async(event) => {
        this.setState( {
            prefs: {
                color: event.hex.substring(1),
            }
        });
    }
 
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }
    
    handleClose = () => {
        this.setState({ displayColorPicker: false });
    }

    handleChange = async(name, event, value) => {
        await this.setState({
            prefs: {
                [name]: value
            }
        });
        await this.updateFile();
    }

    handleSelectChange = async(event, meta) => {
        await this.updateSelectPref(event, meta);
        await this.updateFile(event);
    }

    updateSelectPref = (event, meta) => {
        console.log(meta.name);
        console.log(event.value);
        this.setState ( {
            prefs: {
                [meta.name]: event.value,
            }
        });
    }

    updateFile = async() => {
        try {
            let resp = await axiosInstance.put(`/documents/${this.props.match.params.pk}/`, {
                font_family: this.state.prefs.font_family,
                color: this.state.prefs.color,
                font_size: this.state.prefs.font_size,
                line_height: this.state.prefs.line_height,
                char_width: this.state.prefs.char_width,
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