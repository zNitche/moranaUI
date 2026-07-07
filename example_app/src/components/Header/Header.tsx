import { MoranaHeader } from "moranaui";
import classes from "./Header.module.css";
import type { PropsWithChildren } from "react";

export default function Header({ children }: PropsWithChildren) {
    return <MoranaHeader className={classes.header}>{children}</MoranaHeader>;
}
