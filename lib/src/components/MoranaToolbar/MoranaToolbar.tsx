import { type CSSProperties, type PropsWithChildren } from "react";
import classes from "./MoranaToolbar.module.css";
import { clsx } from "#root/utils";
import { useElementHeight } from "#root/hooks";

interface MoranaToolbarProps {
    readonly className?: string;
    readonly fixedPosition?: boolean;
    readonly hidden?: boolean;
}

export default function MoranaToolbar({
    className,
    fixedPosition = false,
    hidden = false,
    children,
}: PropsWithChildren<MoranaToolbarProps>) {
    const { setElementRef, elementHeight } = useElementHeight();

    return (
        <div
            ref={(element) => setElementRef(element)}
            className={clsx(
                classes.moranaToolbar,
                fixedPosition && classes.fixedPosition,
                hidden && classes.hidden,
                className,
            )}
            style={
                {
                    "--height": `${elementHeight ?? 0}px`,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
}
