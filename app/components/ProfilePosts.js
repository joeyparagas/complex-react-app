// Show a list of posts of the user in their profile page /profile/user

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function ProfilePosts() {
    const { username } = useParams();
    // Create state to check if Axios is still loading
    const [isLoading, setIsLoading] = useState(true);
    // State data for posts
    const [posts, setPosts] = useState([]);

    // Fetch data from db via Axios
    useEffect(() => {
        // Create variable to cancel Axios request
        const ourRequest = Axios.CancelToken.source();

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, {
                    cancelToken: ourRequest.token,
                }); // used to cancel getting info from server
                setIsLoading(false);
                setPosts(response.data);
            } catch (e) {
                console.log(
                    "There was a problem fetching a post or request was cancelled"
                );
            }
        }
        fetchPosts();
        // If user navigates away before Axios loads data, unmount Axios
        return () => {
            ourRequest.cancel();
        };
    }, []);

    // If Axios is still loading, show loading text or graphic instead of output
    if (isLoading) return <LoadingDotsIcon />;

    return (
        <div className="list-group">
            {/* Loop through all the posts via array.map() */}
            {posts.map((post) => {
                // remove post author on own post results page
                return <Post noAuthor={true} post={post} key={post._id} />;
            })}
        </div>
    );
}

export default ProfilePosts;
