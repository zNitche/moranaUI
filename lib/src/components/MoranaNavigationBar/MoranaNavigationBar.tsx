import { useRef, type CSSProperties, type PropsWithChildren } from "react";
import classes from "./MoranaNavigationBar.module.css";
import { clsx } from "@root/utils";
import useMoranaAppContext from "@root/core/hooks/context/useMoranaAppContext";

interface MoranaNavigationBarProps {
    readonly className?: string;
}

export default function MoranaNavigationBar({
    className,
    children,
}: PropsWithChildren<MoranaNavigationBarProps>) {
    const { isNavbarVisible } = useMoranaAppContext();

    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            className={clsx(
                classes.moranaNavigationBar,
                className,
                !isNavbarVisible && classes.hidden,
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
