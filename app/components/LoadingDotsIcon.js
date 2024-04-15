// Loading page that displays during Axios fetching data

import React, { useEffect } from "react";

// Creates loading screen via CSS
function LoadingDotsIcon() {
    return (
        <div className="dots-loading">
            <div></div>
        </div>
    );
}

export default LoadingDotsIcon;
