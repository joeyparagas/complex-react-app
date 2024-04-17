// Editing an existing post.
// Pull data from db and push it back using Immer Reducer

import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditPost() {
    // Create instance to redirect user to homepage
    const navigate = useNavigate();

    // Pull user token from global state using useContext & StateContext
    const appState = useContext(StateContext); // make sure to use global name of appState

    // Get global alert flashMessage
    const appDispatch = useContext(DispatchContext); // make sure to use global name of appDispatch

    // Default value of state of Form with Validation & Error handeling
    const originalState = {
        title: {
            value: "",
            hasErrors: false, // check for errors such as no title
            message: "", // display message during an error
        },
        body: {
            value: "",
            hasErrors: false, // check for errors such as no title
            message: "", // display message during an error
        },
        isFetching: {
            saving: true, // checks to see if initial post data is fetching
        },
        isSaving: {
            saving: false, // checks if update post button is clicked and saving data
            buttonText: "Update Post", // default buttonText value
        },
        id: useParams().id, // pulls id from URL
        sendCount: 0, // Axios request counter
        notFound: false, // When post does not exist
    };

    // Use Immer Reducer/dispatch to handle updating state from pulling Axios data from db
    function ourReducer(draft, action) {
        switch (action.type) {
            case "fetchComplete":
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isFetching = false;
                return;
            case "titleChange":
                draft.title.value = action.value;
                draft.title.hasErrors = false; // remove error if title input box has text
                return;
            case "bodyChange":
                draft.body.value = action.value;
                draft.body.hasErrors = false; // remove error if body textbox has text
                return;
            case "submitRequest":
                // if title and body input boxes are empty, then don't submit
                if (!draft.title.hasErrors && !draft.body.hasErrors) {
                    draft.sendCount++;
                }
                return;
            case "saveRequestStarted":
                draft.isSaving.saving = true;
                draft.isSaving.buttonText = action.value;
                return;
            case "saveRequestFinished":
                draft.isSaving.saving = false;
                draft.isSaving.buttonText = action.value;
                return;
            case "titleRules":
                // check if input box is empty minus white space
                if (!action.value.trim()) {
                    draft.title.hasErrors = true;
                    draft.title.message = "You must provide a title.";
                }
                return;
            case "bodyRules":
                // check if body textbox is empty minus white space
                if (!action.value.trim()) {
                    draft.body.hasErrors = true;
                    draft.body.message = "You must provide body text.";
                }
                return;
            case "notFound":
                // when id in db does not exist
                draft.notFound = true;
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, originalState); // create dispatch instance

    // onSubmit do the following
    function submitHandler(e) {
        e.preventDefault();
        dispatch({ type: "submitRequest" }); // update sendCount->triggers update State
        dispatch({ type: "titleRules", value: state.title.value }); // check if title input box is !empty
        dispatch({ type: "bodyRules", value: state.body.value }); // check if body copy input box is !empty
    }

    // Pull post data from db server via Axios to put into input boxes
    useEffect(() => {
        // Create variable to cancel Axios request
        const ourRequest = Axios.CancelToken.source();

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, {
                    cancelToken: ourRequest.token, // used to cancel getting info from server
                });
                // Create condition to check if id exists in db
                if (response.data) {
                    // Call dispatch to update data in state once Axios receives data
                    dispatch({ type: "fetchComplete", value: response.data });
                    // Check if correct user is editing post
                    if (
                        appState.user.username != response.data.author.username
                    ) {
                        dispatch({
                            type: "flasthMessage",
                            value: "You do not have permission to edit this post.",
                        });
                        // Redirect to homepage
                        navigate("/");
                    }
                } else {
                    dispatch({ type: "notFound" });
                }
            } catch (e) {
                console.log(
                    "There was a problem fetching a post or request was cancelled."
                );
            }
        }
        fetchPost();

        // If user navigates away before Axios loads data, unmount Axios
        return () => {
            ourRequest.cancel();
        };
    }, []);

    // When state.SendCount updated, push new data to database
    useEffect(() => {
        // To prevent running on initial page load, check if state.SendCount > 0
        if (state.sendCount) {
            // On button click, disable button, and change buttonText
            dispatch({ type: "saveRequestStarted", value: "Updating..." });

            // Create variable to cancel Axios request
            const ourRequest = Axios.CancelToken.source();

            async function fetchPost() {
                try {
                    const response = await Axios.post(
                        `/post/${state.id}/edit`,
                        {
                            title: state.title.value, // update title text
                            body: state.body.value, // update body text
                            token: appState.user.token, // pulls from global state token
                        },
                        {
                            cancelToken: ourRequest.token, // used to cancel getting info from server
                        }
                    );
                    // Call dispatch to update data in state once Axios receives data
                    // dispatch({ type: "fetchComplete", value: response.data });

                    // Create an alert to show update has completed and enable Update Post button
                    dispatch({
                        type: "saveRequestFinished",
                        value: state.isSaving.buttonText,
                    });
                    appDispatch({
                        type: "flashMessage",
                        value: "Post was updated.",
                    });
                } catch (e) {
                    console.log(
                        "There was a problem fetching a post or request was cancelled."
                    );
                }
            }
            fetchPost();
            // If user navigates away before Axios loads data, unmount Axios
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.sendCount]); // Run when state.sendCount is updated

    // If id does not exist, show this 404 page
    if (state.notFound) {
        return <NotFound />;
    }

    // Initial loading of page using current state
    if (state.isFetching) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        );
    }

    return (
        <Page title="Edit Post">
            <Link className="small font-weight-bold" to={`/post/${state.id}`}>
                &laquo; Back to post.
            </Link>

            <form className="mt-3" onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        // Run when input has lost focus
                        onBlur={(e) =>
                            dispatch({
                                type: "titleRules",
                                value: e.target.value,
                            })
                        }
                        // Call dispatch when user edits field
                        onChange={(e) =>
                            dispatch({
                                type: "titleChange",
                                value: e.target.value,
                            })
                        }
                        value={state.title.value}
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                    />
                    {/*Show error if title is blank*/}
                    {state.title.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">
                            {state.title.message}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block"
                    >
                        <small>Body Content</small>
                    </label>
                    <textarea
                        // Run when input has lost focus
                        onBlur={(e) =>
                            dispatch({
                                type: "bodyRules",
                                value: e.target.value,
                            })
                        }
                        // Call dispatch when user edits field
                        onChange={(e) =>
                            dispatch({
                                type: "bodyChange",
                                value: e.target.value,
                            })
                        }
                        value={state.body.value}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                    />
                    {/*Show error if body content is blank*/}
                    {state.body.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">
                            {state.body.message}
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    disabled={state.isSaving.saving}
                >
                    {state.isSaving.buttonText}
                </button>
            </form>
        </Page>
    );
}

export default EditPost;
