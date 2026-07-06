import type { PropsWithChildren } from "react";
import classes from "./MoranaNavigationBar.module.css";
import { clsx } from "@root/utils";

interface MoranaNavigationBarProps {
    readonly className?: string;
}

export default function MoranaNavigationBar({
    className,
    children,
}: PropsWithChildren<MoranaNavigationBarProps>) {
    return (
        <div className={clsx(classes.moranaNavigationBar, className)}>
            {children}
        </div>
    );
}
