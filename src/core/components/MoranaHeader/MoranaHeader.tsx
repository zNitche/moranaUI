import { useRef, type PropsWithChildren } from "react";
import classes from "./MoranaHeader.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaHeaderProps {
    readonly className?: string;
    readonly childrenClassName?: string;
}

export default function MoranaHeader({
    children,
    className,
    childrenClassName,
}: PropsWithChildren<MoranaHeaderProps>) {
    const contentRef = useRef<HTMLDivElement>(null);

    useRegisterPageComponent({
        componentType: "header",
        componentRef: contentRef,
    });

    return (
        <div className={clsx(classes.moranaHeader, className)}>
            <div
                ref={contentRef}
                className={clsx(childrenClassName)}
            >
                {children}
            </div>
        </div>
    );
}
