import { useRef, type PropsWithChildren } from "react";
import classes from "./MoranaContent.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaContentProps {
    readonly className?: string;
}

export default function MoranaContent({
    children,
    className,
}: PropsWithChildren<MoranaContentProps>) {
    const elemRef = useRef<HTMLDivElement>(null);

    useRegisterPageComponent({
        componentType: "content",
        componentRef: elemRef,
    });

    return (
        <div
            ref={elemRef}
            className={clsx(classes.moranaContent, className)}
        >
            {children}
        </div>
    );
}
