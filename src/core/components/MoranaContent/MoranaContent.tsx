import { type PropsWithChildren } from "react";
import classes from "./MoranaContent.module.css";
import { clsx } from "@root/utils";
import useMoranaPageContext from "@root/core/hooks/useMoranaPageContext";
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
    const { classForNavState, shouldAnimatePage } = useMoranaPageContext();

    useRegisterPageComponent({ componentType: "content" });

    return (
        <div className={clsx(classes.moranaContent, className)}>
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
