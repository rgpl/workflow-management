import React from 'react';
import {
    Route,
    Redirect,
  } from "react-router-dom";

const fakeAuth = {
    isAuthenticated:true
};


function HomeRoute ({ children, ...rest }) {
    return(
        <Route
        {...rest}
        render={({ location }) =>
            fakeAuth.isAuthenticated ? (
            children
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: location }
                }}
            />
            )
        }
        />
    )

}

export default HomeRoute;
