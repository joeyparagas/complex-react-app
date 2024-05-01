// Libraries & APIs
import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

// Global State and Dispatch
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
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";

function Main() {
    // Global initial State
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("SocietyCentralToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("SocietyCentralToken"),
            username: localStorage.getItem("SocietyCentralUsername"),
            avatar: localStorage.getItem("SocietyCentralAvatar"),
        },
        isSearchOpen: false, // default search closed
        isChatOpen: false, // default chat closed
        unreadChatCount: 0, // count number of chat messages unread
    };

    // Using Global Immer Reducer/dispatch
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
            case "openSearch":
                draft.isSearchOpen = true;
                return;
            case "closeSearch":
                draft.isSearchOpen = false;
                return;
            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen;
                return;
            case "closeChat":
                draft.isChatOpen = false;
                return;
            case "incrementUnreadChatCount":
                draft.unreadChatCount++;
                return;
            case "clearUnreadChatCount":
                draft.unreadChatCount = 0;
                return;
        }
    }
    const [state, dispatch] = useImmerReducer(ourReducer, initialState);

    // Take the draft.user state from ourReducer "loggedIn" state and copy it to localStorage
    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("SocietyCentralToken", state.user.token);
            localStorage.setItem("SocietyCentralUsername", state.user.username);
            localStorage.setItem("SocietyCentralAvatar", state.user.avatar);
        } else {
            // when logged out, remove from localStorage
            localStorage.removeItem("SocietyCentralToken");
            localStorage.removeItem("SocietyCentralUsername");
            localStorage.removeItem("SocietyCentralAvatar");
        }
    }, [state.loggedIn]);

    // Contains FlashMessages (alerts), Header, Routes, and  Footer
    return (
        // StateContext wraps around to use Global State (appState)
        // DispatchContext wraps around to use Global Dispatch (appDispatch)
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Routes>
                        <Route
                            path="/profile/:username/*"
                            element={<Profile />}
                        />
                        <Route
                            path="/"
                            element={state.loggedIn ? <Home /> : <HomeGuest />}
                        />
                        <Route path="/post/:id" element={<ViewSinglePost />} />
                        <Route path="/post/:id/edit" element={<EditPost />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/terms" element={<Terms />} />
                        {/* 404 NotFound route has to be the last "catch-all" route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <CSSTransition
                        timeout={330} // timeout 330ms
                        in={state.isSearchOpen} // conditional check to show <Search />
                        classNames="search-overlay"
                        unmountOnExit // unmount entire component when closed
                    >
                        <Search />
                    </CSSTransition>
                    {
                        // This is an older method not using CSSTransition
                        // {state.isSearchOpen ? <Search /> : ""}
                    }
                    <Chat />
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
