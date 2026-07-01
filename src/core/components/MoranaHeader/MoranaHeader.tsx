import { type PropsWithChildren } from "react";
import classes from "./MoranaHeader.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaHeaderProps {
    readonly className?: string;
    readonly childrenClassName?: string;
}

export default function MoranaHeader({
    children,
    className,
    childrenClassName,
}: PropsWithChildren<MoranaHeaderProps>) {
    useRegisterPageComponent({ componentType: "header" });

    return (
        <div className={clsx(classes.moranaHeader, className)}>
            <div className={clsx(childrenClassName)}>{children}</div>
        </div>
    );
}
