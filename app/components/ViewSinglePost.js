// Page showing the full post data

import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import { Tooltip as ReactTooltip } from "react-tooltip";

function ViewSinglePost() {
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
    }, []);

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

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {/* Edit/Delete post*/}
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
                        data-tooltip-content="Delete Post"
                        data-tooltip-id="delete"
                        className="delete-post-button text-danger"
                    >
                        <i className="fas fa-trash"></i>
                    </a>
                    <ReactTooltip id="delete" className="custom-tooltip" />
                </span>
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
