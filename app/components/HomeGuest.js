// Default Sign In landing page for unregistered user

import React, { useState, useEffect } from "react";
import Page from "./Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

function HomeGuest() {
    // Old Method 1 to register a new user
    // Create state for username, email and pass
    // const [username, setUsername] = useState();
    // const [email, setEmail] = useState();
    // const [password, setPassword] = useState();

    // async function handleSubmit(e) {
    //     e.preventDefault();

    //     // Register new user with updated state
    //     try {
    //         await Axios.post("/register", {
    //             username,
    //             email,
    //             password,
    //         });
    //         console.log("User created.");
    //     } catch (e) {
    //         console.log(
    //             "There was an error or password must be 12+ characters."
    //         );
    //     }
    // }

    // Method 2 to register a user with validation
    // Crate state of registration
    const initialState = {
        username: {
            value: "",
            hasErrors: false,
            message: "", // error message to post
            isUnique: false, // chekc if username is unique
            checkCount: 0, // keep a count in Axios if username is unique
        },
        email: {
            value: "",
            hasErrors: false,
            message: "", // error message to post
            isUnique: false, // chekc if username is unique
            checkCount: 0, // keep a count in Axios if username is unique
        },
        password: {
            value: "",
            hasErrors: false,
            message: "", // error message to post
        },
        submitCount: 0,
    };

    function ourReducer(draft, action) {
        switch (action.type) {
            // checks after every keystroke
            case "usernameImmediately":
                draft.username.hasErrors = false;
                draft.username.value = action.value;
                // Check if username is not longer than 30 characters
                if (draft.username.value.length > 30) {
                    draft.username.hasErrors = true;
                    draft.username.message =
                        "Username needs to be less than 30 characters";
                }

                // Check if username contains only alpha-numeric characters using regex
                if (
                    draft.username.value &&
                    !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
                ) {
                    draft.username.hasErrors = true;
                    draft.username.message =
                        "Username can only use letters and nubmer";
                }
                return;
            case "usernameAfterDelay":
                // Run error if username is under 3 characters & show after 3 seconds
                if (draft.username.value.length < 3) {
                    draft.username.hasErrors = true;
                    draft.username.message =
                        "Username needs to be at least 3 characters";
                }

                // If no errors, check db if username exists by incrementing checkCount
                if (!draft.username.hasErrors) {
                    draft.username.checkCount++;
                }
                return;
            case "usernameUniqueResults":
                // If returned db value exists, then return error
                if (action.value) {
                    draft.username.hasErrors = true;
                    draft.username.isUnique = false;
                    draft.username.message = "Username already exists";
                } else {
                    draft.username.isUnique = true;
                }
                return;
            case "emailImmediately":
                draft.email.hasErrors = false;
                draft.email.value = action.value;
                return;
            case "emailAfterDelay":
                // Check if standard email patter with regex
                if (!/^\S+@\S+$/.test(draft.email.value)) {
                    draft.email.hasErrors = true;
                    draft.email.message = "Not a valid email";
                }
                // If no errors, check db if email exists by incrementing checkCount
                if (!draft.email.hasErrors) {
                    draft.email.checkCount++;
                }
                return;
            case "emailUniqueResults":
                if (action.value) {
                    draft.email.hasErrors = true;
                    draft.email.isUnique = false;
                    draft.email.message = "Email already exists";
                } else {
                    draft.email.isUnique = true;
                }
                return;
            case "passwordImmediately":
                draft.password.hasErrors = false;
                draft.password.value = action.value;
                // Check if pw is over 50 characters
                if (draft.password.value.length > 50) {
                    draft.password.hasErrors = true;
                    draft.password.message =
                        "Password needs to be less than 50 characters";
                }
                return;
            case "passwordAfterDelay":
                // Check if pw is less than 12 characters
                if (draft.password.value.length < 12) {
                    draft.password.hasErrors = true;
                    draft.password.message =
                        "Password needs to be more than than 12 characters";
                }
                return;
            case "submitForm":
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState);

    // Check if minimum 3 character username/email/pw and delay 3 seconds till error shows
    useEffect(() => {
        if (state.username.value) {
            const delay = setTimeout(() => {
                dispatch({ type: "usernameAfterDelay" });
            }, 800);

            // cleanup and remove Timeout
            return clearTimeout;
        }
    }, [state.username.value]);
    useEffect(() => {
        if (state.email.value) {
            const delay = setTimeout(() => {
                dispatch({ type: "emailAfterDelay" });
            }, 800);

            // cleanup and remove Timeout
            return clearTimeout;
        }
    }, [state.email.value]);
    useEffect(() => {
        if (state.password.value) {
            const delay = setTimeout(() => {
                dispatch({ type: "passwordAfterDelay" });
            }, 800);

            // cleanup and remove Timeout
            return clearTimeout;
        }
    }, [state.password.value]);

    // Check if username exists and run when checkCount has been udpated
    useEffect(() => {
        // Make sure checkCount exists
        if (state.username.checkCount) {
            // Create variable to cancel Axios request
            const ourRequest = Axios.CancelToken.source();
            // Send Axios get request to server to get usernames
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/doesUsernameExist",
                        { username: state.username.value },
                        { cancelToken: ourRequest.token }
                    );
                    dispatch({
                        type: "usernameUniqueResults",
                        value: response.data,
                    });
                } catch (e) {
                    console.log(
                        "There was a problem checking if username exists."
                    );
                }
            }

            fetchResults();
            // Unmount Axios when complete
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.username.checkCount]);

    // Check if email exists and run when checkCount has been udpated
    useEffect(() => {
        // Make sure checkCount exists
        if (state.email.checkCount) {
            // Create variable to cancel Axios request
            const ourRequest = Axios.CancelToken.source();
            // Send Axios get request to server to get email
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/doesEmailExist",
                        { email: state.email.value },
                        { cancelToken: ourRequest.token }
                    );
                    dispatch({
                        type: "emailUniqueResults",
                        value: response.data,
                    });
                } catch (e) {
                    console.log(
                        "There was a problem checking if email exists."
                    );
                }
            }

            fetchResults();
            // Unmount Axios when complete
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.email.checkCount]);

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <Page title="Welcome!" wide={true}>
            <div className="row align-items-center">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">
                        Are you sick of short tweets and impersonal
                        &ldquo;shared&rdquo; posts that are reminiscent of the
                        late 90&rsquo;s email forwards? We believe getting back
                        to actually writing is the key to enjoying the internet
                        again.
                    </p>
                </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label
                                htmlFor="username-register"
                                className="text-muted mb-1"
                            >
                                <small>Username</small>
                            </label>
                            {/* Create Error field */}
                            <CSSTransition
                                in={state.username.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {state.username.message}
                                </div>
                            </CSSTransition>
                            <input
                                // onChange={(e) => setUsername(e.target.value)} // Method 1
                                onChange={(e) =>
                                    dispatch({
                                        type: "usernameImmediately",
                                        value: e.target.value,
                                    })
                                }
                                id="username-register"
                                name="username"
                                className="form-control"
                                type="text"
                                placeholder="Pick a username"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="email-register"
                                className="text-muted mb-1"
                            >
                                <small>Email</small>
                            </label>

                            {/* Create Error field */}
                            <CSSTransition
                                in={state.email.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {state.email.message}
                                </div>
                            </CSSTransition>
                            <input
                                // onChange={(e) => setEmail(e.target.value)} // Method 1
                                onChange={(e) =>
                                    dispatch({
                                        type: "emailImmediately",
                                        value: e.target.value,
                                    })
                                }
                                id="email-register"
                                name="email"
                                className="form-control"
                                type="text"
                                placeholder="you@example.com"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="password-register"
                                className="text-muted mb-1"
                            >
                                <small>Password</small>
                            </label>

                            {/* Create Error field */}
                            <CSSTransition
                                in={state.password.hasErrors}
                                timeout={330}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {state.password.message}
                                </div>
                            </CSSTransition>
                            <input
                                // onChange={(e) => setPassword(e.target.value)} // Method 1
                                onChange={(e) =>
                                    dispatch({
                                        type: "passwordImmediately",
                                        value: e.target.value,
                                    })
                                }
                                id="password-register"
                                name="password"
                                className="form-control"
                                type="password"
                                placeholder="Create a password 12+ characters"
                            />
                        </div>
                        <button
                            type="submit"
                            className="py-3 mt-4 btn btn-lg btn-success btn-block"
                        >
                            Sign up for Society Central
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    );
}

export default HomeGuest;
