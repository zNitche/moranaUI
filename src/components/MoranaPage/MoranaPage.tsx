import { type PropsWithChildren } from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";

export default function MoranaPage({ children }: PropsWithChildren) {
    return (
        <div className={clsx(classes.moranaPage, classes.fadeIn)}>
            {children}
        </div>
    );
}
