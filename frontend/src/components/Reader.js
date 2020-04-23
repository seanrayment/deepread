import React, { Component } from 'react'
import axiosInstance from "../axiosApi"

class Reader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasLoaded: false,
            file: null,
        }
    }
    
    render () {
        if (this.state.hasLoaded) {
            return (
                <div>
                    <div className = "reader-body">
                        <h1>{this.state.file.title}</h1>
                        <p>{this.state.file.contents}</p>
                    </div> 
                </div>
            );
        }
        return ( <div></div> )
    }
    
    componentDidMount = () => {
        this.renderFile();
    }

    renderFile = () => {
        axiosInstance.get(`/documents/${this.props.match.params.pk}/`)
        .then ( (response) => {
            this.setState({file: response.data, hasLoaded:true});
        }).catch( err => {
            console.log(err);
        })
    }

}
export default Reader;