import { useRef, type PropsWithChildren } from "react";
import classes from "./MoranaContent.module.css";
import { clsx } from "@root/utils";
import useRegisterPageComponent from "@root/core/hooks/useRegisterPageComponent";

interface MoranaContentProps {
    readonly className?: string;
    readonly childrenClassName?: string;
}

export default function MoranaContent({
    children,
    className,
    childrenClassName,
}: PropsWithChildren<MoranaContentProps>) {
    const contentRef = useRef<HTMLDivElement>(null);

    useRegisterPageComponent({
        componentType: "content",
        componentRef: contentRef,
    });

    return (
        <div className={clsx(classes.moranaContent, className)}>
            <div
                ref={contentRef}
                className={clsx(childrenClassName)}
            >
                {children}
            </div>
        </div>
    );
}
