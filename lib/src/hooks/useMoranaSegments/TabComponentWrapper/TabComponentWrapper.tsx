import {
    useEffect,
    useState,
    type AnimationEvent,
    type PropsWithChildren,
    type ReactNode,
} from "react";
import classes from "./TabComponentWrapper.module.css";
import { clsx } from "@root/utils";

interface TabComponentWrapperProps {
    readonly className?: string;
}

export default function TabComponentWrapper({
    children,
    className,
}: PropsWithChildren<TabComponentWrapperProps>) {
    const [isLeaving, setIsLeaving] = useState(false);
    const [currentChildren, setCurrentChildren] = useState<ReactNode | null>(
        children,
    );

    useEffect(() => {
        if (!currentChildren) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentChildren(children);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    useEffect(() => {
        if (!currentChildren) {
            return;
        }

        if (children !== currentChildren) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLeaving(true);
        }
    }, [children, currentChildren])

    return (
        <div
            className={clsx(
                classes.tabComponentWrapper,
                isLeaving && classes.animateOut,
                className,
            )}
            onAnimationEnd={(_event: AnimationEvent<HTMLDivElement>) => {
                setCurrentChildren(children);
                setIsLeaving(false);
            }}
        >
            {currentChildren}
        </div>
    );
}
