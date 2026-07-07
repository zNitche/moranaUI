import type { PropsWithChildren } from "react";
import classes from "./MoranaRoutesWrapper.module.css";

export default function MoranaRoutesWrapper({ children }: PropsWithChildren) {
    return <div className={classes.moranaRoutesWrapper}>{children}</div>;
}
