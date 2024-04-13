import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ViewSinglePost() {
    // Get id number from URL
    const { id } = useParams();
    // State for initial loading of post
    const [isLoading, setIsLoading] = useState(true);
    // Updates the post on the page
    const [post, setPost] = useState(true);

    // Pull post from db server via Axios
    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`);
                setPost(response.data);
                setIsLoading(false); // set setIsLoading to false skip loading... screen
            } catch (e) {
                console.log("There was a problem fetching posts!");
            }
        }
        fetchPost();
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
                <span className="pt-2">
                    <a href="#" className="text-primary mr-2" title="Edit">
                        <i className="fas fa-edit"></i>
                    </a>
                    <a
                        className="delete-post-button text-danger"
                        title="Delete"
                    >
                        <i className="fas fa-trash"></i>
                    </a>
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

            <div className="body-content">{post.body}</div>
        </Page>
    );
}

export default ViewSinglePost;
