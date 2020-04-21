import React, { Component } from "react";

class File extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() {
        return(
            <tr>
                <td>
                    <p>{this.props.name}</p>
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