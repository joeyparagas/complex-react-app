// Flash Message of when a post is created

import React, { useEffect } from "react";

function FlashMessages(props) {
    return (
        <div className="floating-alerts">
            {props.messages.map((alertMsg, index) => {
                return (
                    <div
                        key={index}
                        className="alert alert-success text-center floating-alert shadow-sm"
                    >
                        {alertMsg}
                    </div>
                );
            })}
        </div>
    );
}

export default FlashMessages;
