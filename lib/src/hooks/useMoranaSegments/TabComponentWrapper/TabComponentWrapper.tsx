import { type AnimationEvent, type PropsWithChildren } from "react";
import classes from "./TabComponentWrapper.module.css";
import { clsx } from "#root/utils";

interface TabComponentWrapperProps {
    readonly className?: string;
    readonly isLeaving?: boolean;
    readonly onAnimationEndCallback?: () => void;
}

export default function TabComponentWrapper({
    children,
    className,
    isLeaving,
    onAnimationEndCallback,
}: PropsWithChildren<TabComponentWrapperProps>) {
    return (
        <div
            className={clsx(
                classes.tabComponentWrapper,
                isLeaving && classes.animateOut,
                isLeaving && classes.leaving,
                className,
            )}
            onAnimationEnd={(event: AnimationEvent<HTMLDivElement>) => {
                if (event.target !== event.currentTarget) {
                    return;
                }

                if (isLeaving) {
                    onAnimationEndCallback?.();
                }
            }}
        >
            {children}
        </div>
    );
}
