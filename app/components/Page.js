// Template of a page with a container and document title

import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
    useEffect(() => {
        document.title = `${props.title} | Society Central`;
        window.scroll(0, 0);
    }, [props.title]);

    return <Container wide={props.wide}>{props.children}</Container>;
}

export default Page;
