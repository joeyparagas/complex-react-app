import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

// Pointers needed when using useContext and/or in combination with useReducer
// import ExampleContext from "./ExampleContext"; no longer needed with useReducer
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
    // Using useReducer - state parameter that will hold all the state instances in one location
    const initialState = {
        // pulls from localStorage to see if user is logged in
        loggedIn: Boolean(localStorage.getItem("complexAppToken")),

        // data will be inserted pending the status
        flashMessages: [],
    };
    // Using useReducer - function parameter - how the state data will change depending on the actions of this function
    function ourReducer(state, action) {
        // switch case returns data depending on the type of action being used
        // note that login/logout currently do not have messages
        switch (action.type) {
            case "login":
                return { loggedIn: true, flashMessages: state.flashMessages };
            case "logout":
                return { loggedIn: false, flashMessages: state.flashMessages };
            case "flashMessage":
                return {
                    loggedIn: state.loggedIn,
                    flashMessages: state.flashMessages.concat(action.value),
                };
        }
    }
    const [state, dispatch] = useReducer(ourReducer, initialState);

    // No longer needed when using useReducer
    // const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexAppToken")),);
    // const [flashMessages, setFlashMessages] = useState([]);
    // function addFlashMessage(alertMsg) {
    //     setFlashMessages((prev) => prev.concat(alertMsg));
    // }

    // StateContext & DispatchContext are separated instead of value={state, dispatch}
    // This is becuase not all routes need both state and dispatch all the time
    // <Header loggedIn={loggedIn} />
    // Prop is not needed since state is no longer being passed via prop
    // Instead using useContext/useReducer combination

    // <StateContext.Provider value={state}> and
    // <DispatchContext.Provider value={dispatch}>
    // Pulls from useReducer array which points to initialState & ourReducer

    // <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
    // This is no longer being passed as a prop but part of the Reducer state
    // See below to use proper syntax to call Reducer state
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
