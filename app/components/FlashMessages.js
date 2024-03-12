import React, { useEffect } from "react";

function FlashMessages(props) {
    // Pull flashMessages state and output the alertMsg and index
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
