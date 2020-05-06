import React, { Component } from 'react'
import { IoMdClose } from 'react-icons/io'

class Annotation extends Component { 
    constructor() {
        super();
        this.state = {
            active: false,
        }
    }

    setHoverIn = () => {
        this.setState({
            active: true,
        })
    }

    setHoverOut = () => {
        this.setState({
            active:false,
        })
    }

    render() {
        return(
            <div className="annotation-wrap" onMouseOver={this.setHoverIn} onMouseLeave={this.setHoverOut}>
                {this.state.active ? (<IoMdClose className="annotation-close" onClick={() => this.props.deleteAnnotation(this.props.annotation.pk)}/>) : null}
                <p style={{color:this.props.nightMode ? "white" : "black"}}>{this.props.annotation.contents}</p>
            </div>
        )
    }
}

export default Annotation;