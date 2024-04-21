// Page showing the full post data

import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import { Tooltip as ReactTooltip } from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSinglePost() {
    // Crate instance of Global state
    const appState = useContext(StateContext);
    // Crate instance of Global Dispatch
    const appDispatch = useContext(DispatchContext);
    // Create instance to redirect user back to posts page
    const navigate = useNavigate();
    // Get id number from URL
    const { id } = useParams();
    // State for initial loading of post
    const [isLoading, setIsLoading] = useState(true);
    // Updates the post on the page
    const [post, setPost] = useState(true);

    // Pull post from db server via Axios
    useEffect(() => {
        // Create variable to cancel Axios request
        const ourRequest = Axios.CancelToken.source();

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, {
                    cancelToken: ourRequest.token, // used to cancel getting info from server
                });
                setPost(response.data); //show data from db
                setIsLoading(false); // set setIsLoading to false skip loading... screen
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
    }, [id]); // id makes it dependent on search result

    // If it's not loading and post !exist, show this 404 page
    if (!isLoading && !post) {
        return <NotFound />;
    }

    // Initial loading of page
    if (isLoading) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        );
    }

    // Get and format post dates
    const date = new Date(post.createdDate);
    const dateFormatted = `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    // Check if author is logged in
    function isOwner() {
        if (appState.loggedIn) {
            // return true if current username matches global
            return appState.user.username == post.author.username;
        }
        return false;
    }

    // Delete post confirmation notice
    async function deleteHandler() {
        const areYouSure = window.confirm(
            "Do you really want to delete this post?"
        );

        if (areYouSure) {
            // Axios delete
            try {
                const response = await Axios.delete(`/post/${id}`, {
                    // confirm that the user token matches
                    data: { token: appState.user.token },
                });

                if (response.data == "Success") {
                    // Display flashMessage to confirming deleted post
                    appDispatch({
                        type: "flashMessage",
                        value: "Post was successfully deleted.",
                    });
                    // Redirect to profile page
                    navigate(`/profile/${appState.user.username}`);
                }
            } catch (e) {
                console.log("There was a problem deleting the post.");
            }
        }
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>

                {/* Show Edit/Delete buttons if author is logged in */}
                {isOwner() && (
                    <span className="pt-2">
                        <Link
                            to={`/post/${post._id}/edit`}
                            data-tooltip-content="Edit Post"
                            data-tooltip-id="edit"
                            className="text-primary mr-2"
                        >
                            <i className="fas fa-edit"></i>
                        </Link>
                        <ReactTooltip id="edit" className="custom-tooltip" />{" "}
                        <a
                            onClick={deleteHandler}
                            data-tooltip-content="Delete Post"
                            data-tooltip-id="delete"
                            className="delete-post-button text-danger"
                        >
                            <i className="fas fa-trash"></i>
                        </a>
                        <ReactTooltip id="delete" className="custom-tooltip" />
                    </span>
                )}
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by{" "}
                <Link to={`/profile/${post.author.username}`}>
                    {post.author.username}
                </Link>{" "}
                on {dateFormatted}
            </p>

            <div className="body-content">
                <ReactMarkdown
                    children={post.body}
                    allowedElements={[
                        "p",
                        "br",
                        "strong",
                        "em",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "ul",
                        "li",
                        "ol",
                        "a",
                    ]}
                />
            </div>
        </Page>
    );
}

export default ViewSinglePost;
