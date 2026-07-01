import { type PropsWithChildren } from "react";
import classes from "./MoranaContent.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaContentProps {
    readonly className?: string;
    readonly childrenClassName?: string;
}

export default function MoranaContent({
    children,
    className,
    childrenClassName,
}: PropsWithChildren<MoranaContentProps>) {
    useRegisterPageComponent({ componentType: "content" });

    return (
        <div className={clsx(classes.moranaContent, className)}>
            <div className={clsx(childrenClassName)}>{children}</div>
        </div>
    );
}
