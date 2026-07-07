import type { PropsWithChildren } from "react";
import classes from "./RouterContent.module.css";

export default function RouterContent({ children }: PropsWithChildren) {
    return <div className={classes.moranaRouterContent}>{children}</div>;
}
