import React, { useEffect, useContext, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";

function Chat() {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);
    const chatField = useRef(null);
    const [state, setState] = useImmer({
        fieldValue: "",
        chatMessages: [],
    });

    // Autofocus on Chat input box when Chat is open
    // Can't use autofocus due to it always being in DOM (unlike Search)
    useEffect(() => {
        // If Chat is open, focus on input element w/useRef
        if (appState.isChatOpen) {
            chatField.current.focus();
        }
    }, [appState.isChatOpen]);

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
        // Send message to chat server
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
            <div id="chat" className="chat-log">
                {
                    // Loop through chat messages for primary user via map function
                    state.chatMessages.map((message, index) => {
                        // Check if the current/primary user is the same as app-wide user
                        if (message.username == appState.user.username) {
                            return (
                                <div className="chat-self">
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
                                <div className="chat-other">
                                    <a href="#">
                                        <img
                                            className="avatar-tiny"
                                            src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
                                        />
                                    </a>
                                    <div className="chat-message">
                                        <div className="chat-message-inner">
                                            <a href="#">
                                                <strong>barksalot:</strong>
                                            </a>
                                            Hey, I am good, how about you?
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
