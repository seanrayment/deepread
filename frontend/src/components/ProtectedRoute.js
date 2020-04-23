import React, { Component } from 'react';
import {  Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({component: Component, ...rest}) => {
        console.log({...rest});
        return (
            <Route { ...rest } render = { props => {
                    if (rest.isAuthed) {
                        return <Component {...props} ></Component>
                    }
                    return <Redirect to=""></Redirect>
                    
                }
            }
            />
        )
}