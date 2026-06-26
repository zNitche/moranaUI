import type { PropsWithChildren } from "react";
import classes from "./MoranaContent.module.css";
import { clsx } from "@root/utils";

interface MoranaContentProps {
    readonly className?: string;
}

export default function MoranaContent({
    children,
    className,
}: PropsWithChildren<MoranaContentProps>) {
    return (
        <div className={clsx(classes.moranaContent, className)}>{children}</div>
    );
}
