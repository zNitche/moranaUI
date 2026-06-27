import { type PropsWithChildren } from "react";
import classes from "./MoranaHeader.module.css";
import { clsx } from "@root/utils";
import useMoranaPageContext from "@root/core/hooks/useMoranaPageContext";
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
    const { classForNavState, shouldAnimatePage } = useMoranaPageContext();

    useRegisterPageComponent({ componentType: "header" });

    return (
        <div className={clsx(classes.moranaHeader, className)}>
            <div
                className={clsx(
                    !shouldAnimatePage && classForNavState,
                    childrenClassName,
                )}
            >
                {children}
            </div>
        </div>
    );
}
