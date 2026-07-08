import classes from "./Content.module.css";
import type { PropsWithChildren } from "react";

export default function Content({ children }: PropsWithChildren) {
    return (
        <div className={classes.content}>{children}</div>
    );
}
