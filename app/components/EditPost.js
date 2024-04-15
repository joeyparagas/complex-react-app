// Editing an existing post.
// Pull data from db and push it back using Immer Reducer

import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";

function EditPost() {
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
        isFetching: true, // checks to see if initial post data is fetching
        isSaving: false, // checks if update post button is clicked and saving data
        id: useParams().id, // pulls id from URL
        sendCount: 0, // Axios request counter
    };

    // Use Immer Reducer/dispatch to handle updating state from pulling Axios data from db
    function ourReducer(draft, action) {
        switch (action.type) {
            case "fetchComplete":
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isFetching = false;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, originalState); // create dispatch instance

    // Pull post from db server via Axios
    useEffect(() => {
        // Create variable to cancel Axios request
        const ourRequest = Axios.CancelToken.source();

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, {
                    cancelToken: ourRequest.token, // used to cancel getting info from server
                });
                // Call dispatch to update data in state once Axios receives data
                dispatch({ type: "fetchComplete", value: response.data });
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
            <form>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        value={state.title.value}
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block"
                    >
                        <small>Body Content</small>
                    </label>
                    <textarea
                        value={state.body.value}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                    />
                </div>

                <button className="btn btn-primary">Update Post</button>
            </form>
        </Page>
    );
}

export default EditPost;
