import clsx from "@root/utils/clsx";
import classes from "./MoranaRefresher.module.css";
import type { CSSProperties } from "react";

interface MoranaRefresherProps {
    readonly className?: string;
    readonly internalsClassName?: string;
    readonly style?: CSSProperties;
    readonly dragProgress?: number;
    readonly active?: boolean;
}

export default function MoranaRefresher({
    className,
    internalsClassName,
    style,
    dragProgress = 0,
    active = false,
}: MoranaRefresherProps) {
    return (
        <div
            style={
                {
                    "--drag-progress": `${dragProgress}%`,
                    ...style,
                } as CSSProperties
            }
            className={clsx(classes.moranaRefresher, className)}
        >
            <div
                className={clsx(
                    classes.inner,
                    active && classes.active,
                    internalsClassName,
                )}
            ></div>
        </div>
    );
}
