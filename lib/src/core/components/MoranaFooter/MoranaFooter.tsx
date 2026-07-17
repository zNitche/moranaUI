import { useRef, type PropsWithChildren } from "react";
import classes from "./MoranaFooter.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaFooterProps {
    readonly className?: string;
}

export default function MoranaFooter({
    children,
    className,
}: PropsWithChildren<MoranaFooterProps>) {
    const elemRef = useRef<HTMLDivElement>(null);

    useRegisterPageComponent({
        componentType: "footer",
        componentRef: elemRef,
    });

    return (
        <div
            ref={elemRef}
            className={clsx(classes.moranaFooter, className)}
        >
            {children}
        </div>
    );
}
