// 404 Page

import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Page title="Page Not Found">
            <div className="text-center">
                <h1>Error 404: Page Not Found</h1>
                <p className="lead text-muted">
                    Please visit the <Link to="/">homepage</Link>.
                </p>
            </div>
        </Page>
    );
}

export default NotFound;
