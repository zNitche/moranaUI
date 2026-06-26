import type { PropsWithChildren } from "react";
import classes from "./MoranaHeader.module.css";
import { clsx } from "@root/utils";

interface MoranaHeaderProps {
    readonly className?: string;
}

export default function MoranaHeader({
    children,
    className,
}: PropsWithChildren<MoranaHeaderProps>) {
    return (
        <div className={clsx(classes.moranaHeader, className)}>{children}</div>
    );
}
