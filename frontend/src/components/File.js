import React, { Component } from "react";

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
                        <p>hello</p>
                    </div>
                </td>
            </tr>
        );
    }
}

export default File;