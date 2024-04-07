import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useParams } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";

function Profile() {
    const { username } = useParams(); // get parameters from URL - in this case gets username
    const appState = useContext(StateContext);

    // Create State of default placeholder data to fill DOM before Axios populates data
    const [profileData, setProfileData] = useState({
        profileUsername: "...",
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        isFollowing: false,
        counts: { postCount: "", followerCount: "", followingCount: "" },
    });

    // Fetch data via Axios from DB
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, {
                    token: appState.user.token,
                });

                // Push data into DOM
                // console.log(response);
                setProfileData(response.data);
            } catch (e) {
                console.log("There was a problem fetching user data.");
            }
        }
        fetchData();
    }, []);

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={profileData.profileAvatar} />
                {profileData.profileUsername}
                <button className="btn btn-primary btn-sm ml-2">
                    Follow <i className="fas fa-user-plus"></i>
                </button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {profileData.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {profileData.counts.followingCount}
                </a>
            </div>

            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action">
                    <img
                        className="avatar-tiny"
                        src={profileData.profileAvatar}
                    />{" "}
                    <strong>Example Post #1</strong>
                    <span className="text-muted small">on 2/10/2020 </span>
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                    <img
                        className="avatar-tiny"
                        src={profileData.profileAvatar}
                    />{" "}
                    <strong>Example Post #2</strong>
                    <span className="text-muted small">on 2/10/2020 </span>
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                    <img
                        className="avatar-tiny"
                        src={profileData.profileAvatar}
                    />{" "}
                    <strong>Example Post #3</strong>
                    <span className="text-muted small">on 2/10/2020 </span>
                </a>
            </div>
        </Page>
    );
}

export default Profile;
