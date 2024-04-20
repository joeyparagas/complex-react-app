import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";

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

    // Show state search result when state is updated
    useEffect(() => {
        // set a delay to results 3 seconds after typing
        const delay = setTimeout(() => {
            // increase requestCount by 1
            setState((draft) => {
                draft.requestCount++;
            });
            console.log(state.requestCount);
        }, 3000);

        // return function will run before state.SearchTerm gets next update (user typing)
        // removes delay function and shows the current state.searchTerm
        return () => {
            console.log("done");
            clearTimeout(delay);
        };
    }, [state.searchTerm]);

    // Check when reqeustCount has been udpated
    useEffect(() => {
        // Make sure requestCount > 0
        if (state.requestCount) {
            // Send Axios get request to server
        }
    }, [state.requestCount]);

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
                        autofocus
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
                    <div className="live-search-results live-search-results--visible">
                        <div className="list-group shadow-sm">
                            <div className="list-group-item active">
                                <strong>Search Results</strong> (3 items found)
                            </div>
                            <a
                                href="#"
                                className="list-group-item list-group-item-action"
                            >
                                <img
                                    className="avatar-tiny"
                                    src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                                />{" "}
                                <strong>Example Post #1</strong>
                                <span className="text-muted small">
                                    by brad on 2/10/2020{" "}
                                </span>
                            </a>
                            <a
                                href="#"
                                className="list-group-item list-group-item-action"
                            >
                                <img
                                    className="avatar-tiny"
                                    src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
                                />{" "}
                                <strong>Example Post #2</strong>
                                <span className="text-muted small">
                                    by barksalot on 2/10/2020{" "}
                                </span>
                            </a>
                            <a
                                href="#"
                                className="list-group-item list-group-item-action"
                            >
                                <img
                                    className="avatar-tiny"
                                    src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                                />{" "}
                                <strong>Example Post #3</strong>
                                <span className="text-muted small">
                                    by brad on 2/10/2020{" "}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
