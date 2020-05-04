import React, { Component } from "react";
var moment = require('moment')

class File extends Component{
    constructor(props){
        super(props);
    }
    handleClick = () => {
        this.props.selectFile(this.props.file.pk); 
    }

    render() {
        return(
            <tr onClick={this.handleClick}>
                <td>
                    <p>{this.props.file.title}</p>
                </td>
                <td>
                    <div className="file-metadata">
                        <p className="file-metadata-descriptor">last modified <span>{moment(this.props.file.updated_at).fromNow() }</span></p>
                        <p className="file-metadata-descriptor">created on <span>{moment(this.props.file.created_at).format('MMMM D YYYY')}</span></p>
                    </div>
                </td>
            </tr>
        );
    }
}

export default File;