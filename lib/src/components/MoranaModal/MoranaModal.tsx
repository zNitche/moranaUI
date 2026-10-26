import {
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import classes from "./MoranaModal.module.css";
import { clsx } from "#root/utils";
import { createPortal } from "react-dom";
import useAnimatedPresence from "#root/core/hooks/useAnimatedPresence";

interface MoranaModalProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
    readonly className?: string;
    readonly overlayClassName?: string;
    readonly contentWrapperClassName?: string;
}

export default function MoranaModal({
    children,
    isOpen,
    setIsOpen,
    className,
    overlayClassName,
    contentWrapperClassName,
}: PropsWithChildren<MoranaModalProps>) {
    const { internalIsOpen, setElementRef, isClosing, elementsProps } =
        useAnimatedPresence({ isOpen: isOpen });

    return (
        internalIsOpen &&
        createPortal(
            <div
                ref={setElementRef}
                className={clsx(classes.moranaModal, className)}
            >
                <div
                    {...elementsProps}
                    className={clsx(
                        classes.content,
                        isClosing && classes.close,
                        isOpen && classes.open,
                        contentWrapperClassName,
                    )}
                >
                    {children}
                </div>
                <div
                    className={clsx(
                        classes.overlay,
                        isOpen && classes.open,
                        overlayClassName,
                    )}
                    onClick={() => setIsOpen(false)}
                />
            </div>,
            document.body,
        )
    );
}
