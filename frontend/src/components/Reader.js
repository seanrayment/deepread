import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { BsChevronDown } from 'react-icons/bs'
import ReaderControl from './ReaderControl';
import { TextAnnotator } from 'react-text-annotate'
import { Link } from "react-router-dom";
import Annotation from './Annotation'
import { TextField } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#723EE0'
      }
    },
    overrides: {
        MuiOutlinedInput: {
            root: {
                borderColor: "#E0e0e0"
            }
        }
    }
});
  

class Reader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            user: null,
            prefs: {
                font_family: '',
                color: '',
                font_size:'',
                line_height: '',
                char_width: '',
                highlights: [],
                annotations: [],
            },
            showHighlights: true,
            nightMode: false,
            showAnnotations: true,
            currentAnnotation: "",
        }
    }
    
    render () {
        if (this.state.file) {
            return (
                <div>
                    <div className="reader-banner">
                        <h1 onClick={() => this.props.history.push("/")}>deepread.app</h1>
                        <div className="reader-user-dropdown-wrap">
                            <div className="user-dropdown">
                                <h2>{this.state.user ? this.state.user.data.email : null}</h2>
                                <BsChevronDown color={"white"} style={{width:'16px', height:'16px', paddingLeft:'.5rem'}}/>
                            </div> 
                            <div className="reader-dropdown-menu">
                                <Link to="/login" onClick={this.signOut}>Sign out</Link>
                            </div>
                        </div>
                    </div>
                    <div className="reader-body" style={{backgroundColor: this.state.nightMode ? 'black' : 'white'}}>
                        <div className="reader-controls">
                            <ReaderControl 
                                file={this.state.file}
                                handleChange = {this.handleChange}
                                handleSelectChange = {this.handleSelectChange}
                                handleColorChange = {this.handleColorChange}
                                handleSliderChange = {this.handleSliderChange}
                                handleHighlighter = {this.handleHighlighter}
                                showHighlights={this.state.showHighlights}
                                handleAnnotations={this.handleAnnotations}
                                showAnnotations={this.state.showAnnotations}
                                toggleNightMode={this.toggleNightMode}
                                nightMode = {this.state.nightMode}
                                >   
                            </ReaderControl>
                        </div>
                        <div className="reader-main">
                            <h1 style={{color: this.state.nightMode ? 'white' : 'black'}}>{this.state.file.title}</h1>
                            {this.renderText()}
                        </div>
                        <div className="reader-annotations" >
                            <div style={{display:this.state.showAnnotations ? 'block' : 'none'}}>
                                <p style={{color: this.state.nightMode ? "white" : "black"}}>ANNOTATIONS ({this.state.file.annotations.length})</p>
                                <MuiThemeProvider theme={theme}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="New annotation"
                                        multiline
                                        fullWidth
                                        variant="outlined"
                                        color={theme.primary}
                                        value={this.state.currentAnnotation}
                                        inputProps={{
                                            style: {
                                                borderRadius: 0,
                                                fontSize:'.75em',
                                                color: this.state.nightMode ? "white" : "black",
                                            }
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: this.state.nightMode ? "white" : "#757575", 
                                            }
                                        }}
                                        onChange={this.updateCurrentAnnotation}
                                    /> 
                                </MuiThemeProvider>
                                <button className="annotation-submit" 
                                style={{backgroundColor: this.state.nightMode ? "black" : "white"}}
                                onClick={this.addAnnotation}>Add annotation</button>
                                {this.renderAnnotations()}
                            </div> 
                        </div>
                    </div> 
                </div>
            );
        }
        return ( <div></div> );
    }

    componentDidMount = () => {
        this.loadFile();
        this.getUser();
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
    handleHighlighter = () => {
        console.log('h')
        this.setState({showHighlights:!this.state.showHighlights,})
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
            }, () => this.buildHighlights())
        } catch (err) {
            console.log(err);
        }
    }

    renderText = () => {
        if (this.state.showHighlights) {
            return ( 
                <TextAnnotator
                    style={{
                        color: this.state.nightMode ? 'white' : `#${this.state.file.color}`,
                        fontFamily: this.state.file.font_family,
                        fontSize: `${this.state.file.font_size}pt`,
                        lineHeight: this.state.file.line_height,
                        width: `100%`,
                    }}
                    content={this.state.file.contents}
                    value={this.state.prefs.highlights}
                    onChange={this.addHighlight}
                    getSpan={ span => ({
                    ...span,
                    color: "#fff2ac",
                    })}
                />
            )
        }
        else {
            return (
                <p style={{
                    color: this.state.nightMode ? 'white' : `#${this.state.file.color}`,
                    fontFamily: this.state.file.font_family,
                    fontSize: `${this.state.file.font_size}pt`,
                    lineHeight: this.state.file.line_height,}}
                >
                    {this.state.file.contents}
                </p>)
        }

    }

    addHighlight = async(value) => {
        console.log(value);
        let highlights = this.state.prefs.highlights;
        let currValue = value[value.length-1];
        if (currValue && !isNaN(currValue.start) && !isNaN(currValue.end)){ //Account for the edge cases
            for (let i=0; i < highlights.length; i++){
                let h = highlights[i];
                if (currValue.start < h.start && currValue.end > h.end){ //If new highlight wraps another
                    await this.deleteHighlight(h.pk); //delete old highlight from db
                    value.splice(i, 1); //delete from highlight values
                }
                else if (currValue.start < h.end && currValue.start >= h.start && currValue.end <= h.end && currValue.end > h.start){//if another highlight wraps new highlight
                    return;
                }
                else if (currValue.start < h.start && currValue.end <= h.end && currValue.end > h.start) { //new highlight begins before another but terminates inside
                    //await this.updateHighlight(h.pk, currValue.start, h.end); //update old highlight to begin at new start
                    await this.deleteHighlight(h.pk);
                    currValue.end = h.end;
                }
                else if (currValue.start >= h.start && currValue.start <= h.end && currValue.end > h.start) { //new highlight starts inside another but terminates after
                    await this.deleteHighlight(h.pk); //update old highlight to end at new end
                    currValue.start = h.start;
                }
            }
            this.postHighlight(value);
        }
    }

    updateHighlight = (pk, start, end) => {
        axiosInstance.put(`/highlight/${pk}/`,{
            start_char:start,
            end_char:end,
        });
    }

    deleteHighlight = (pk) => {
        axiosInstance.delete(`/highlight/${pk}/`);
    }

    buildHighlights = () => {
        let values = this.state.file.highlights.map(h => {
            return ({
                pk: h.pk,
                start: h.start_char, 
                end: h.end_char,
                color:"#fff2ac",
            })
        });
        this.setState({prefs: {
            highlights: values,
        }});
    }

    postHighlight = (v) => {
        let newHighlight = v[v.length-1];
        if (newHighlight) {
            axiosInstance.post(`/highlights/${this.props.match.params.pk}/`, {
                start_char: v[v.length-1].start,
                end_char: v[v.length-1].end,
            }).then(()=>this.loadFile()); //reload
        }
    }


    loadFile = () => {
        axiosInstance.get(`/documents/${this.props.match.params.pk}/`)
        .then ( (response) => {
            this.setState({file: response.data}, ()=> {
                this.buildHighlights()
                this.renderAnnotations();
            });
        }).catch( err => {
            console.log(err);
        })
    }

    getUser = () => {
        axiosInstance.get('/user/').then ((user) => this.setState({user}));
    }

    toggleNightMode = () => {
        this.setState({
            nightMode:!this.state.nightMode,
            prefs: {
                ...this.state.prefs,
                color:'ffffff',
            }
        }, () => this.renderText())
    }

    renderAnnotations = () => {
        if (this.state.file) {
            return this.state.file.annotations.map(a => {
                return <Annotation key={a.pk} annotation={a} deleteAnnotation = {this.deleteAnnotation} nightMode ={this.state.nightMode}/>
            })
        }
    }
    updateCurrentAnnotation = e => {
        this.setState({currentAnnotation: e.target.value});
    }

    addAnnotation = () => {
        axiosInstance.post(`/annotations/${this.props.match.params.pk}/`,{
            start_char:0, //placeholders
            end_char:1,
            contents:this.state.currentAnnotation,
        })
        .then( () => {
            this.loadFile()
        })
        this.setState({currentAnnotation:''})
    }
    deleteAnnotation = (pk) => {
        axiosInstance.delete(`/annotation/${pk}/`);
        this.loadFile()
    }

    handleAnnotations = () => {
        this.setState({
            showAnnotations: !this.state.showAnnotations,
        })
    }
    signOut = () => {
        this.props.signOut().then( () => {
            this.props.history.push("/login");
        });
    }

}
export default Reader;