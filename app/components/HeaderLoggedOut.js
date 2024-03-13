import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
// import ExampleContext from "../ExampleContext";
import DispatchContext from "../DispatchContext";

function HeaderLoggedOut(props) {
    // Update state of user and pw
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    // No longer using props, but pulling state from Context
    const appDispatch = useContext(DispatchContext);
    // const {setLoggedIn} = useContext(ExampleContext); no longer needed due to useReducer

    async function handleSubmit(e) {
        e.preventDefault();
        // Contact server backend using Axios
        try {
            const response = await Axios.post("/login", {
                username,
                password,
            });
            if (response.data) {
                // If successfully saved data to db, save data to LS
                localStorage.setItem("complexAppToken", response.data.token);
                localStorage.setItem(
                    "complexAppUsername",
                    response.data.username
                );
                localStorage.setItem("complexAppAvatar", response.data.avatar);
                // setLoggedIn(true); - no longer needed due to useReducer
                // Using Dispatch to hanlde the login
                appDispatch({ type: "login" });
            } else {
                // Throw error in console if not load to db
                console.log("Incorrect username / password");
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
