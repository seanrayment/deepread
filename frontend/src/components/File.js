import React, { Component } from "react";
import { BsThreeDots } from "react-icons/bs"
var moment = require('moment')

class File extends Component{

    constructor(props) {
        super();
        this.state = {
            hovered: false,
            fileMenu: false,
        }
    }

    handleClick = () => {
        this.props.selectFile(this.props.file.pk); 
    }

    setHoverIn = () => {
        this.setState({
            hovered: true,
        })
    }

    setHoverOut = () => {
        this.setState({
            hovered:!this.state.hovered,
        })
    }


    displayFileMenu = () => {
        this.setState({fileMenu:true,})
    }


    render() {
        return(
            <tr onMouseOver={this.setHoverIn} onMouseLeave={this.setHoverOut}>
                <td>
                    <p className="file-title" onClick={this.handleClick} >{this.props.file.title}</p>
                </td>
                <td>
                    <div className="file-metadata">
                        <p className="file-metadata-descriptor">last modified <span>{moment(this.props.file.updated_at).fromNow() }</span></p>
                        <p className="file-metadata-descriptor">created on <span>{moment(this.props.file.created_at).format('MMMM D YYYY')}</span></p>
                    </div>
                </td>
                <td>
                    <div className="file-dot-menu-wrap">
                        {this.state.hovered ? (
                            <div className="file-dots">
                                <BsThreeDots style={{width:'24px', height:'24px', color:'#212121'}} onClick={this.displayFileMenu}/>
                                <div className="file-menu" onClick={()=>{this.props.delete(this.props.file.pk)}}>
                                    <p>Delete document</p>
                                </div>
                            </div>
                        ) : null }

                    </div>
                </td>
            </tr>
        );
    }
}

export default File;