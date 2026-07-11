import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import classes from "./MoranaDrawer.module.css";
import { clsx } from "@root/utils";
import { createPortal } from "react-dom";

interface MoranaDrawerProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
    readonly className?: string;
    readonly overlayClassName?: string;
    readonly contentWrapperClassName?: string;
}

export default function MoranaDrawer({
    children,
    isOpen,
    setIsOpen,
    className,
    overlayClassName,
    contentWrapperClassName,
}: PropsWithChildren<MoranaDrawerProps>) {
    const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInternalIsOpen(isOpen);
        }
    }, [isOpen]);

    const isClosing = useMemo(
        () => Boolean(!isOpen && internalIsOpen),
        [isOpen, internalIsOpen],
    );

    return (
        internalIsOpen &&
        createPortal(
            <div className={clsx(classes.moranaDrawer, className)}>
                <div
                    onAnimationEnd={() => {
                        if (isClosing) {
                            setInternalIsOpen(false);
                        }
                    }}
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
