import {
    useEffect,
    useMemo,
    useState,
    type CSSProperties,
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import classes from "./Modal.module.css";
import { clsx } from "@root/utils";
import { createPortal } from "react-dom";

interface ModalProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
    readonly className?: string;
    readonly overlayClassName?: string;
    readonly contentWrapperClassName?: string;
}

export default function Modal({
    children,
    isOpen,
    setIsOpen,
    className,
    overlayClassName,
    contentWrapperClassName,
}: PropsWithChildren<ModalProps>) {
    const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);
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
            <div
                ref={(ref) => setModalRef(ref)}
                className={clsx(classes.modal, className)}
                style={
                    {
                        "--base-height": `${modalRef?.clientHeight}px`,
                    } as CSSProperties
                }
            >
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
