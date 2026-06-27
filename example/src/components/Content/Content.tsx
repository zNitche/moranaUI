import { MoranaContent } from "moranaui";
import classes from "./Content.module.css";
import type { PropsWithChildren } from "react";

export default function Content({ children }: PropsWithChildren) {
    return (
        <MoranaContent className={classes.content}>{children}</MoranaContent>
    );
}
