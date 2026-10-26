import {
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import classes from "./MoranaFullScreenOverlay.module.css";
import { clsx } from "#root/utils";
import { createPortal } from "react-dom";
import useAnimatedPresence from "#root/core/hooks/useAnimatedPresence";

interface MoranaFullScreenOverlayProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
    readonly className?: string;
    readonly overlayClassName?: string;
    readonly contentWrapperClassName?: string;
}

export default function MoranaFullScreenOverlay({
    children,
    isOpen,
    setIsOpen,
    className,
    overlayClassName,
    contentWrapperClassName,
}: PropsWithChildren<MoranaFullScreenOverlayProps>) {
    const { internalIsOpen, setElementRef, isClosing, elementsProps } =
        useAnimatedPresence({ isOpen: isOpen });

    return (
        internalIsOpen &&
        createPortal(
            <div
                className={clsx(classes.moranaFullScreenOverlay, className)}
                ref={setElementRef}
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
