// Search Component found in Header

import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";

function Search() {
    const appDispatch = useContext(DispatchContext); // globalDispatch

    // Single State for search and results instead of different useStates for each section
    // A mix of using a reducer and state in one
    const [state, setState] = useImmer({
        searchTerm: "", // stores what the user types in search box
        results: [], // shows json server results in search results section
        show: "neither", // shows the loading screen in search results section
        requestCount: 0, // counts number of requests
    });

    function handleCloseIcon(e) {
        e.preventDefault;
        appDispatch({ type: "closeSearch" });
    }

    // Listen for keypress up on load of Search component
    useEffect(() => {
        document.addEventListener("keyup", searchKeyPressHandler);

        // Remove listener once Search is closed
        return () => {
            document.removeEventListener("keyup", searchKeyPressHandler);
        };
    }, []);

    // Show state search result when state is updated
    useEffect(() => {
        // Trim empty white space
        // .trim() prevents state.searchTerm from changing
        if (state.searchTerm.trim()) {
            // Show loading icon
            setState((draft) => {
                draft.show = "loading";
            });

            // set a delay to results 750 milliseconds after typing
            const delay = setTimeout(() => {
                // increase requestCount by 1 if letters are input into search box
                setState((draft) => {
                    // if (state.searchTerm.length) {
                    draft.requestCount++;
                    // }
                });
            }, 750);

            // return function will run before state.SearchTerm gets next update (user typing)
            // removes delay function and shows the current state.searchTerm
            return () => {
                clearTimeout(delay);
            };
        } else {
            setState((draft) => {
                draft.show = "neither";
            });
        }
    }, [state.searchTerm]);

    // // Check when reqeustCount has been udpated
    useEffect(() => {
        // Make sure requestCount > 0, meaning its on the search page
        if (state.requestCount) {
            // Create variable to cancel Axios request
            const ourRequest = Axios.CancelToken.source();
            // Send Axios get request to server
            // This only searches user posts not names or anything else
            async function fetchResults() {
                try {
                    const response = await Axios.post(
                        "/search",
                        { searchTerm: state.searchTerm },
                        { cancelToken: ourRequest.token }
                    );
                    setState((draft) => {
                        draft.results = response.data;
                        // if results exist, update state to show html
                        draft.show = "results";
                    });
                } catch (e) {
                    console.log(
                        "There was a problem returning search results from db."
                    );
                }
            }
            fetchResults();
            // Unmount Axios when complete
            return () => {
                ourRequest.cancel();
            };
        }
    }, [state.requestCount]);

    // Use ESC key to close search
    function searchKeyPressHandler(e) {
        // Check if ESC is is pressed
        if (e.keyCode == 27) {
            appDispatch({ type: "closeSearch" });
        }
    }

    // Run when user types something in search box, put it into state
    function handleInput(e) {
        const value = e.target.value;
        // Create a "draft" to mutate setState
        // Similar to using a reducer but skips straight to editing the state
        setState((draft) => {
            draft.searchTerm = value;
        });
    }

    return (
        <div className="search-overlay">
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label
                        htmlFor="live-search-field"
                        className="search-overlay-icon"
                    >
                        <i className="fas fa-search"></i>
                    </label>
                    <input
                        onChange={handleInput}
                        autoFocus
                        type="text"
                        autoComplete="off"
                        id="live-search-field"
                        className="live-search-field"
                        placeholder="What are you interested in?"
                    />
                    <span
                        onClick={handleCloseIcon}
                        className="close-live-search"
                    >
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    {/* Conditional loading animation */}
                    <div
                        className={
                            "circle-loader " +
                            (state.show == "loading"
                                ? "circle-loader--visible"
                                : "")
                        }
                    ></div>

                    {/* Conditional show results */}
                    <div
                        className={
                            "live-search-results" +
                            (state.show == "results"
                                ? "alive-search-results--visible"
                                : "")
                        }
                    >
                        {Boolean(state.results.length) && (
                            <div className="list-group shadow-sm">
                                <div className="list-group-item active">
                                    <strong>Search Results</strong> (
                                    {/*Dynamic search results*/}
                                    {state.results.length}{" "}
                                    {state.results.length > 1
                                        ? "items"
                                        : "item"}{" "}
                                    found)
                                </div>
                                {state.results.map((post) => {
                                    // Get and format post dates
                                    const date = new Date(post.createdDate);
                                    const dateFormatted = `${
                                        date.getMonth() + 1
                                    }/${date.getDate()}/${date.getFullYear()}`;

                                    return (
                                        <Link
                                            // Close search on click
                                            onClick={() =>
                                                appDispatch({
                                                    type: "closeSearch",
                                                })
                                            }
                                            key={post._id}
                                            to={`/post/${post._id}`}
                                            className="list-group-item list-group-item-action"
                                        >
                                            <img
                                                className="avatar-tiny"
                                                src={post.author.avatar}
                                            />
                                            <strong>{post.title}</strong>
                                            <span className="text-muted small">
                                                {" "}
                                                by {
                                                    post.author.username
                                                } on {dateFormatted}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        {!Boolean(state.results.length) && (
                            <p className="alert alert-danger text-center shadow-sm">
                                No results found when searching for:
                                <br /> <em>{state.searchTerm}</em>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
