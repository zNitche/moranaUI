import { useLayoutEffect, type PropsWithChildren } from "react";
import classes from "./MoranaHeader.module.css";
import { clsx } from "@root/utils";
import useMoranaPageContext from "@root/core/hooks/useMoranaPageContext";

interface MoranaHeaderProps {
    readonly className?: string;
    readonly childrenClassName?: string;
}

export default function MoranaHeader({
    children,
    className,
    childrenClassName,
}: PropsWithChildren<MoranaHeaderProps>) {
    const {
        classForNavState,
        shouldAnimatePage,
        updatePageStructuralComponentsRegistry,
    } = useMoranaPageContext();

    useLayoutEffect(() => {
        updatePageStructuralComponentsRegistry("header", true);

        return () => updatePageStructuralComponentsRegistry("header", false);
    }, []);

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
