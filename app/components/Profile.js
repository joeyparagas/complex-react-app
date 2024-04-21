// Profile page showing username, (un)follow button, posts, etc

import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";
import { useImmer } from "use-immer";

function Profile() {
    const { username } = useParams(); // get parameters from URL - in this case gets username
    const appState = useContext(StateContext);

    // *** To make use of Follow button, using a useImmer/setState instead of useState *** //
    // // Create State of default placeholder data to fill DOM before Axios populates data
    // const [profileData, setProfileData] = useState({
    //     profileUsername: "...",
    //     profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    //     isFollowing: false,
    //     counts: { postCount: "", followerCount: "", followingCount: "" },
    // });

    // Using useImmer instead of useState for profile default on load
    const [state, setState] = useImmer({
        // following state
        followActionLoading: false, // determines if follow button is disabled
        startFollowingRequestCount: 0,
        stopFollowingRequestCount: 0,
        // default profile data
        profileData: {
            profileUsername: "...",
            profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
            isFollowing: false,
            counts: { postCount: "", followerCount: "", followingCount: "" },
        },
    });

    // Fetch data via Axios from DB
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();

        async function fetchData() {
            try {
                const response = await Axios.post(
                    `/profile/${username}`,
                    { token: appState.user.token },
                    { cancelToken: ourRequest.token }
                );

                // Push response data into State which will update DOM
                // setProfileData(response.data); // older method using useState

                // Use useImmer method instead
                setState((draft) => {
                    draft.profileData = response.data;
                });
            } catch (e) {
                console.log("There was a problem fetching user data.");
            }
        }
        fetchData();
        // Unmount Axios when complete
        return () => {
            ourRequest.cancel();
        };
    }, [username]); // runs when username url is updated

    // Fetch post when Follow button is clicked
    useEffect(() => {
        // Run if state.startFollowingRequestCount > 0
        if (state.startFollowingRequestCount) {
            // Disable Follow Button
            setState((draft) => {
                draft.followActionLoading = true;
            });

            const ourRequest = Axios.CancelToken.source();

            async function fetchData() {
                try {
                    const response = await Axios.post(
                        `/addFollow/${state.profileData.profileUsername}`,
                        { token: appState.user.token },
                        { cancelToken: ourRequest.token }
                    );

                    // Once following is clicked, update state
                    setState((draft) => {
                        draft.profileData.isFollowing = true; // update following this user
                        draft.profileData.counts.followerCount++; // update # of followers
                        draft.followActionLoading = false; // disable follow button
                    });
                } catch (e) {
                    console.log("There was a problem fetching user data.");
                }
            }

            fetchData();
            // Unmount Axios when complete
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.startFollowingRequestCount]);

    // Fetch post when Unfollow button is clicked
    useEffect(() => {
        // Run if state.stopFollowingRequestCount > 0
        if (state.stopFollowingRequestCount) {
            // Disable Follow Button
            setState((draft) => {
                draft.followActionLoading = true;
            });

            const ourRequest = Axios.CancelToken.source();

            async function fetchData() {
                try {
                    const response = await Axios.post(
                        `/removeFollow/${state.profileData.profileUsername}`,
                        { token: appState.user.token },
                        { cancelToken: ourRequest.token }
                    );

                    // Once following is clicked, update state
                    setState((draft) => {
                        draft.profileData.isFollowing = false; // update following this user
                        draft.profileData.counts.followerCount--; // update # of followers
                        draft.followActionLoading = false; // disable follow button
                    });
                } catch (e) {
                    console.log("There was a problem fetching user data.");
                }
            }

            fetchData();
            // Unmount Axios when complete
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.stopFollowingRequestCount]);

    // Function to handle Follow button click
    function startFollowing() {
        setState((draft) => {
            draft.startFollowingRequestCount++;
        });
    }

    // Function to handle Unfollow button click
    function stopFollowing() {
        setState((draft) => {
            draft.stopFollowingRequestCount++;
        });
    }

    return (
        <Page title="Profile Screen">
            <h2>
                <img
                    className="avatar-small"
                    src={state.profileData.profileAvatar}
                />
                {state.profileData.profileUsername}

                {/* Follow Button */}
                {
                    // Show button condition when:
                    // currently logged in
                    appState.loggedIn &&
                        // !currently following
                        !state.profileData.isFollowing &&
                        // !follow self
                        appState.user.username !=
                            state.profileData.profileUsername &&
                        // !pre-loading
                        state.profileData.profileUsername != "..." && (
                            <button
                                onClick={startFollowing}
                                disabled={state.followActionLoading}
                                className="btn btn-primary btn-sm ml-2"
                            >
                                Follow <i className="fas fa-user-plus"></i>
                            </button>
                        )
                }

                {/* Unfollow Button */}
                {
                    // Show button condition when:
                    // currently logged in
                    appState.loggedIn &&
                        // currently following
                        state.profileData.isFollowing &&
                        // !follow self
                        appState.user.username !=
                            state.profileData.profileUsername &&
                        // !pre-loading
                        state.profileData.profileUsername != "..." && (
                            <button
                                onClick={stopFollowing}
                                disabled={state.followActionLoading}
                                className="btn btn-danger btn-sm ml-2"
                            >
                                Unfollow <i className="fas fa-user-times"></i>
                            </button>
                        )
                }
            </h2>
            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                {/* Navigation Tabs - NavLink */}

                <NavLink to="" end className="nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </NavLink>
                <NavLink to="followers" className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </NavLink>
                <NavLink to="following" className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>

            <Routes>
                <Route path="" element={<ProfilePosts />} />
                <Route path="followers" element={<ProfileFollowers />} />
                <Route path="following" element={<ProfileFollowing />} />
            </Routes>
        </Page>
    );
}

export default Profile;
