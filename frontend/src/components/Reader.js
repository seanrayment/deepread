import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'
import ReaderControl from './ReaderControl';
import { TextAnnotator } from 'react-text-annotate'

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
            highlightToggle: true,
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
                                handleHighlighter = {this.handleHighlighter}
                                >    
                            </ReaderControl>
                        </div>
                        <div className="reader-main">
                            <h1>{this.state.file.title}</h1>
                            {this.renderText()}
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
    handleHighlighter = () => {
        this.setState({highlightToggle:!this.state.highlightToggle,})
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
        if (this.state.highlightToggle) {
            return ( 
                <TextAnnotator
                    style={{
                        color: `#${this.state.file.color}`,
                        fontFamily: this.state.file.font_family,
                        fontSize: `${this.state.file.font_size}pt`,
                        lineHeight: this.state.file.line_height,
                    }}
                    content={this.state.file.contents}
                    value={this.state.prefs.highlights}
                    onChange={this.addHighlight}
                    onClick = {e=>console.log(e)}
                    getSpan={span => ({
                    ...span,
                    color: "#fff2ac",
                    })}
                />
            )
        }
        else {
            return (
                <p style={{
                    color: `#${this.state.file.color}`,
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

    componentDidMount = () => {
        this.loadFile();
    }

    loadFile = () => {
        axiosInstance.get(`/documents/${this.props.match.params.pk}/`)
        .then ( (response) => {
            this.setState({file: response.data}, ()=> this.buildHighlights());
        }).catch( err => {
            console.log(err);
        })
    }

}
export default Reader;