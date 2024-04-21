// Header for logged in user

import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { Tooltip as ReactTooltip } from "react-tooltip";

function HeaderLoggedIn(props) {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    function handleLogout() {
        appDispatch({ type: "logout" });
    }

    function handleSearchIcon(e) {
        e.preventDefault();
        appDispatch({ type: "openSearch" });
    }

    return (
        <div className="flex-row my-3 my-md-0">
            {/*Search Icon*/}
            <a
                data-tooltip-id="search"
                data-tooltip-content="Search Site"
                onClick={handleSearchIcon}
                href="#"
                className="text-white mr-2 header-search-icon"
            >
                <i className="fas fa-search"></i>
            </a>
            <ReactTooltip id="search" className="custom-tooltip" />{" "}
            {/*Chat Icon*/}
            <span
                data-tooltip-id="chat"
                data-tooltip-content="Chat with Others"
                className="mr-2 header-chat-icon text-white"
            >
                <i className="fas fa-comment"></i>
                <span className="chat-count-badge text-white"> </span>
            </span>
            <ReactTooltip id="chat" className="custom-tooltip" />{" "}
            {/*User Avatar or view posts*/}
            <Link
                data-tooltip-id="avatar"
                data-tooltip-content="My Profile"
                to={`/profile/${appState.user.username}`}
                className="mr-2"
            >
                <img
                    className="small-header-avatar"
                    // pull straight from localStorage
                    // src={localStorage.getItem("SocietyCentralAvatar")}

                    // Pull the source from StateContext now being held in main.js
                    src={appState.user.avatar}
                />
            </Link>
            <ReactTooltip id="avatar" className="custom-tooltip" />{" "}
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;
