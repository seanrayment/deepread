import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'

import { withStyles } from '@material-ui/core/styles'
import ReaderControl from './ReaderControl';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

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
            file: null,
            prefs: {
                font_family: '',
                color: '',
                font_size:'',
                line_height: '',
                char_width: '',
                highlights: [],
                annotations: [],
            },
        }
    }
    
    render () {
        if (this.state.file) {
            const bodyStyle = {
                color: `#${this.state.file.color}`,
                fontFamily: this.state.file.font_family,
                fontSize: `${this.state.file.font_size}pt`,
                lineHeight: this.state.file.line_height,
              };
            return (
                    <div className="reader-body">
                        <div className="reader-controls">
                            <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")} />
                            <ReaderControl 
                                file={this.state.file}
                                handleChange = {this.handleChange}
                                handleSelectChange = {this.handleSelectChange}
                                handleColorChange = {this.handleColorChange}
                                handleSliderChange = {this.handleSliderChange}
                                >    
                            </ReaderControl>
                        </div>
                        <div className="reader-main">
                            <h1>{this.state.file.title}</h1>
                            <p 
                                style={bodyStyle} 
                                dangerouslySetInnerHTML={ {__html: this.buildText() } }>
                            </p>
                        </div>
                        <div className="reader-annotations">
                        </div>
                    </div> 
            );
        }
        return ( <div></div> );
    }

    buildText = () => {
        let splitContents = this.state.file.contents.split('');
        this.state.file.highlights.forEach(h => {
            splitContents[h.start_char] = "<span class='highlight'>" + splitContents[h.start_char];
            splitContents[h.end_char] = splitContents[h.end_char] + "</span>";
        }) 
        return splitContents.join('');
    }

    handleColorChange = (event) => {
        this.setState( {
            prefs: {
                color: event.hex.substring(1),
            }
        }, () => this.updateFile());
    }
 
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }    
    
    handleClose = () => {
        this.setState({ displayColorPicker: false });
    }

    handleSliderChange = (name, event, value) => {
        this.setState({
            prefs: {
                [name]: value,
            }
        }, () => this.updateFile())
    }

    // handleSelectChange = async(event, meta) => {
    //     await this.updateSelectPref(event, meta);
    //     this.updateFile(event);
    // }


    handleSelectChange = (event, meta) => {
        console.log(meta.name);
        console.log(event.value);
        this.setState ( {
            prefs: {
                [meta.name]: event.value,
            }
        }, () => this.updateFile())
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
export default Reader;