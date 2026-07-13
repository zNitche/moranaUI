import { useRef, type PropsWithChildren } from "react";
import classes from "./MoranaContent.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaContentProps {
    readonly className?: string;
    readonly blockScrollY?: boolean;
}

export default function MoranaContent({
    children,
    className,
    blockScrollY = false,
}: PropsWithChildren<MoranaContentProps>) {
    const elemRef = useRef<HTMLDivElement>(null);

    useRegisterPageComponent({
        componentType: "content",
        componentRef: elemRef,
    });

    return (
        <div
            ref={elemRef}
            className={clsx(
                classes.moranaContent,
                blockScrollY && classes.blockScrollY,
                className,
            )}
        >
            {children}
        </div>
    );
}
