import React, { Component } from 'react'
import axiosInstance from "../axiosApi"
import { IoMdArrowBack } from 'react-icons/io'

class Reader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            prefs: {
                fontFamily: '',
                color: 'black',
            },
        }

        
    }
    
    render () {
        if (this.state.file) {
            return (
                <div>
                    <div className = "reader-body">
                        <IoMdArrowBack style={{width:'36px', height:'36px'}} onClick={() => this.props.history.push("/")}></IoMdArrowBack>
                        <h1>{this.state.file.title}</h1>
                        <p style={{color:this.state.prefs.color, fontFamily:this.state.prefs.fontFamily}}>{this.state.file.contents}</p>
                        <div className="reader-prefs">
                            <form>
                                <select name="fontFamily" onChange={this.updateFilePrefs}>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Helvetica">Helvetica</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Georgia">Georgia</option>
                                    <option vale="Tahoma">Tahoma</option>
                                </select>
                                <select name="color" onChange={this.updateFilePrefs}>
                                    <option value="red">red</option>
                                    <option value="black">black</option>
                                    <option value="blue">blue</option>
                                </select>
                            </form>
                        </div>
                    </div> 
                </div>
            );
        }
        return ( <div></div> )
    }
    
    updateFilePrefs = (event) => {
        this.setState({
            prefs: {
                [event.target.name]: event.target.value,
            }
        });
        console.log(this.state);
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