// Chatbox located in bottom right corner of page

import React, { useEffect, useContext, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import io from "socket.io-client";

// Establish Socket.io connection w/ browser and backend server
// const socket = io("http://localhost:8080");

function Chat() {
    const socket = useRef(null);
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);
    const chatField = useRef(null);
    const chatLog = useRef(null);
    const [state, setState] = useImmer({
        fieldValue: "",
        chatMessages: [],
    });

    // Check when chat window is opened
    useEffect(() => {
        // Autofocus on Chat input box when Chat is open
        // Can't use autofocus due to it always being in DOM (unlike Search)
        if (appState.isChatOpen) {
            // focus on input element w/useRef
            chatField.current.focus();

            // set chat count number = 0
            appDispatch({ type: "clearUnreadChatCount" });
        }
    }, [appState.isChatOpen]);

    // Check when chatMessages is updated
    useEffect(() => {
        // Auto scroll chat window down to latest chat message when overflow
        // Get the current height of chatLog div and
        // set it equal to the amount of pixels to scroll down from the top
        chatLog.current.scrollTop = chatLog.current.scrollHeight;

        // Check for unread chat messages:
        // Check if message array exists (means there are new messages) and if chat is closed
        if (state.chatMessages.length && !appState.isChatOpen) {
            // Increment chat count by 1
            appDispatch({ type: "incrementUnreadChatCount" });
        }
    }, [state.chatMessages]);

    // Function to check state on chat input box
    function handleFieldChange(e) {
        // Create value variable instead of setting
        // it directly equal do to second level interior function
        const value = e.target.value;
        setState((draft) => {
            draft.fieldValue = value;
        });
    }

    // Function to check submitting chat text (click enter)
    function handleSubmit(e) {
        e.preventDefault();

        // Send message to chat server.
        // "chatFromBrowser" is a specific name programmed into backend
        socket.current.emit("chatFromBrowser", {
            message: state.fieldValue,
            token: appState.user.token,
        });

        // Update state
        setState((draft) => {
            // Push each message into message array
            draft.chatMessages.push({
                message: draft.fieldValue,
                username: appState.user.username,
                avatar: appState.user.avatar,
            });
            draft.fieldValue = "";
        });
    }

    // Setup receiving state/data from chat server w/ socket.io
    useEffect(() => {
        // Establish Socket.io connection w/ browser and backend server on load
        socket.current = io(
            process.env.BACKENDURL ||
                "https://complex-react-app-backend-mo6p.onrender.com"
        );

        // "chatFromServer" is a specific name programmed into backend
        socket.current.on("chatFromServer", (message) => {
            setState((draft) => {
                draft.chatMessages.push(message);
            });
        });

        // Disconnect from socket when logged out
        return () => socket.current.disconnect();
    }, []);

    return (
        <div
            id="chat-wrapper"
            className={
                "chat-wrapper shadow border-top border-left border-right " +
                // add/remove "visible" class
                (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
            }
        >
            <div className="chat-title-bar bg-primary">
                Chat
                <span
                    onClick={() => {
                        appDispatch({ type: "closeChat" });
                    }}
                    className="chat-title-bar-close"
                >
                    <i className="fas fa-times-circle"></i>
                </span>
            </div>

            {/* Create chatLog reference to have chat auto-scroll down to latest message */}
            <div id="chat" className="chat-log" ref={chatLog}>
                {
                    // Loop through chat messages for primary user via map function
                    state.chatMessages.map((message, index) => {
                        // Check if the current/primary user is the same as app-wide user
                        if (message.username == appState.user.username) {
                            return (
                                <div key={index} className="chat-self">
                                    <div className="chat-message">
                                        <div className="chat-message-inner">
                                            {message.message}
                                        </div>
                                    </div>
                                    <img
                                        className="chat-avatar avatar-tiny"
                                        src={message.avatar}
                                    />
                                </div>
                            );
                        } else {
                            // if not primary user, then return other user
                            return (
                                <div key={index} className="chat-other">
                                    <Link to={`/profile/${message.username}`}>
                                        <img
                                            className="avatar-tiny"
                                            src={message.avatar}
                                        />
                                    </Link>
                                    <div className="chat-message">
                                        <div className="chat-message-inner">
                                            <Link
                                                to={`/profile/${message.username}`}
                                            >
                                                <strong>
                                                    {message.username}:{" "}
                                                </strong>
                                            </Link>
                                            {message.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })
                }
            </div>
            <form
                onSubmit={handleSubmit}
                id="chatForm"
                className="chat-form border-top"
            >
                <input
                    onChange={handleFieldChange}
                    ref={chatField}
                    type="text"
                    className="chat-field"
                    id="chatField"
                    placeholder="Type a message…"
                    autoComplete="off"
                    value={state.fieldValue}
                />
            </form>
        </div>
    );
}

export default Chat;
