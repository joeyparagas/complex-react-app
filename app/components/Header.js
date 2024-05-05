// Default container for logged in/out header page.

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../StateContext";

function Header(props) {
    const appState = useContext(StateContext);
    const headerContent = appState.loggedIn ? (
        <HeaderLoggedIn />
    ) : (
        <HeaderLoggedOut />
    );

    return (
        <header className="header-bar bg-primary mb-3">
            <div className="container d-flex flex-column flex-md-row align-items-center p-3">
                <h4 className="my-0 mr-md-auto font-weight-normal">
                    <Link to="/" className="text-white">
                        {" "}
                        Society Central{" "}
                    </Link>
                </h4>

                {
                    // Checks to see if generating html on local files on hd vs on server
                    // Only show app name if generating local files on hd
                    !props.staticEmpty ? headerContent : ""
                }
            </div>
        </header>
    );
}

export default Header;
