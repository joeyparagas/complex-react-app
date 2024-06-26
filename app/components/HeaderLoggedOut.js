// Header for logged out user

import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function HeaderLoggedOut(props) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const appDispatch = useContext(DispatchContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await Axios.post("/login", {
                username,
                password,
            });
            if (response.data) {
                // Older Method setting data to localstorage vs in global state
                // localStorage.setItem("SocietyCentralToken", response.data.token);
                // localStorage.setItem(
                //     "SocietyCentralUsername",
                //     response.data.username
                // );
                // localStorage.setItem("SocietyCentralAvatar", response.data.avatar);

                // Pushing the data (type:login and data:response.data [could be any name])
                // back to main.js via dispatch
                appDispatch({ type: "login", data: response.data });

                // Create flash message to show logged in
                appDispatch({
                    type: "flashMessage",
                    value: "You have successfully logged in.",
                });
            } else {
                console.log("Incorrect username / password");
                // Create flash message to show something went wrong
                appDispatch({
                    type: "flashMessage",
                    value: "Something went wrong with your login.",
                });
            }
        } catch (e) {
            console.log("There was a problem.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        className="form-control form-control-sm input-dark"
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                    />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        className="form-control form-control-sm input-dark"
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    );
}

export default HeaderLoggedOut;
