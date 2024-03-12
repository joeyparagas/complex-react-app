import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import Page from "./Page";
import Axios from "axios";
import ExampleContext from "../ExampleContext";

function CreatePost(props) {
    // Create state for post title and body text
    const [title, setTitle] = useState();
    const [body, setBody] = useState();
    const navigate = useNavigate();
    const { addFlashMessage } = useContext(ExampleContext);

    // onSubmit post to database
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await Axios.post("/create-post", {
                title,
                body,
                token: localStorage.getItem("complexAppToken"),
            });
            // Run addFlashMessage() being passed as a prop
            // props.addFlashMessage("A new post has been created!");

            // Run addFlashMessage() while using Context
            addFlashMessage("A brand new post has been created!");
            // Redirect to new post url
            navigate(`/post/${response.data}`);
            console.log("New post created");
        } catch (e) {
            console.log("There was a problem");
        }
    }

    return (
        <Page title="Create New Post">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        // text input updates title state
                        onChange={(e) => setTitle(e.target.value)}
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
                        // text input updates body text state
                        onChange={(e) => setBody(e.target.value)}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                    ></textarea>
                </div>

                <button className="btn btn-primary">Save New Post</button>
            </form>
        </Page>
    );
}

export default CreatePost;
