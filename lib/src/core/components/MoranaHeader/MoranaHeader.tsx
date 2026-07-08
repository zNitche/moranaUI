import { useRef, type PropsWithChildren } from "react";
import classes from "./MoranaHeader.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaHeaderProps {
    readonly className?: string;
}

export default function MoranaHeader({
    children,
    className,
}: PropsWithChildren<MoranaHeaderProps>) {
    const elemRef = useRef<HTMLDivElement>(null);

    useRegisterPageComponent({
        componentType: "header",
        componentRef: elemRef,
    });

    return (
        <div
            ref={elemRef}
            className={clsx(classes.moranaHeader, className)}
        >
            {children}
        </div>
    );
}
