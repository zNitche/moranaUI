import { useRef, type CSSProperties, type PropsWithChildren } from "react";
import classes from "./MoranaToolbar.module.css";
import { clsx } from "@root/utils";

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
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            className={clsx(
                classes.moranaToolbar,
                fixedPosition && classes.fixedPosition,
                hidden && classes.hidden,
                className,
            )}
            style={
                {
                    // eslint-disable-next-line react-hooks/refs
                    "--height": `${ref.current?.clientHeight}px`,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
}
