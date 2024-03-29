import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexAppToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexAppToken"),
            username: localStorage.getItem("complexAppUsername"),
            avatar: localStorage.getItem("complexAppAvatar"),
        },
    };

    // Using Immer Reducer
    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                // In the case of login, response.data (user login info) is being passed via HeaderLoggedOut.js
                // Set the user login info to state (draft.user)
                draft.user = action.data;
                // Option: you can set the action.data to localStorage from here,
                // but it's best separate that and use useEffect (see below)
                return;
            case "logout":
                draft.loggedIn = false;
                return;
            case "flashMessage":
                draft.flashMessages.push(action.value);
                return;
        }
    }
    const [state, dispatch] = useImmerReducer(ourReducer, initialState);

    // Take the draft.user state from ourReducer "loggedIn" state and copy it to localStorage
    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("complexAppToken", state.user.token);
            localStorage.setItem("complexAppUsername", state.user.username);
            localStorage.setItem("complexAppAvatar", state.user.avatar);
        } else {
            // when logged out, remove from localStorage
            localStorage.removeItem("complexAppToken");
            localStorage.removeItem("complexAppUsername");
            localStorage.removeItem("complexAppAvatar");
        }
    }, [state.loggedIn]);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Routes>
                        <Route
                            path="/"
                            element={state.loggedIn ? <Home /> : <HomeGuest />}
                        />
                        <Route path="/post/:id" element={<ViewSinglePost />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/terms" element={<Terms />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
    module.hot.accept();
}
