import classes from "./Content.module.css";
import type { HTMLAttributes, PropsWithChildren } from "react";

interface ContentProps {
    readonly ref?: (node: HTMLElement | null) => void;
}

export default function Content({
    children,
    ref,
    ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & ContentProps>) {
    return (
        <div
            {...props}
            ref={ref}
            className={classes.content}
        >
            {children}
        </div>
    );
}
