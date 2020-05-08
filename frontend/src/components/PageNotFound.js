import React, { Component } from "react";
import illustration from "../undraw_web_search_eetr.svg";
class PageNotFound extends Component {
    
    render() {
        return (
            <div className="notfound-body">
                <div className="notfound-content">
                    <h1>Page not found</h1>
                    <div className="notfound-card">
                        <p>Either you don't have access to the requested resource or it does not exist.</p>                        
                    </div>
                    <img className="notfound-illustration" src={illustration}></img>
                </div>
            </div>
        )
    }
}
export default PageNotFound;