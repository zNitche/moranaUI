import { useState, useEffect, useMemo } from "react";

interface AnimatedPresenceProps {
    readonly isOpen: boolean;
}

export default function useAnimatedPresence({ isOpen }: AnimatedPresenceProps) {
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
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

    const elementsProps = useMemo(() => {
        return {
            onAnimationEnd: () => {
                if (isClosing) {
                    setInternalIsOpen(false);
                }
            },
        };
    }, [isClosing]);

    return {
        internalIsOpen,
        elementRef,
        setElementRef,
        isClosing,
        elementsProps,
    };
}
