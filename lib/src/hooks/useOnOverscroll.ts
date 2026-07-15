import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useLayoutEffect,
} from "react";
import useDrag from "./useDrag";
import type DragDetail from "@root/types/DragDetails";

interface HookUseOnOverscrollProps {
    readonly onOverscrollStartCallback?: (
        dragDetails: DragDetail | undefined,
    ) => void;
    readonly onOverscrollEndCallback?: () => void;
}

export default function useOnOverscroll({
    onOverscrollStartCallback,
    onOverscrollEndCallback,
}: HookUseOnOverscrollProps) {
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(
        null,
    );
    const [isScrolling, setIsScrolling] = useState<boolean>(false);

    const elementRef = useRef<HTMLElement>(null);

    const [overscrollDetected, setOverscrollDetected] =
        useState<boolean>(false);

    const {
        setRef: setDragRef,
        dragDetails,
        dragInProgress,
    } = useDrag({});

    useEffect(() => {
        elementRef.current = targetElement;
    }, [targetElement]);

    const setRef = useCallback(
        (e: HTMLElement | null) => {
            setTargetElement(e);
            setDragRef(e);
        },
        [setDragRef],
    );

    const onScroll = useCallback((_event: Event) => {
        setIsScrolling(true);
        setOverscrollDetected(false);
    }, []);

    const onScrollEnd = useCallback((_event: Event) => {
        setTimeout(() => setIsScrolling(false), 1000);
        setOverscrollDetected(false);
    }, []);

    useEffect(() => {
        if (overscrollDetected) {
            onOverscrollStartCallback?.(dragDetails);
        } else {
            onOverscrollEndCallback?.();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overscrollDetected])

    useEffect(() => {
        if (isScrolling) {
            return;
        }

        if (targetElement?.scrollTop !== 0) {
            return;
        }

        if (!dragInProgress || !dragDetails) {
            return;
        }

        if (dragDetails.angleDiff >= 80 && dragDetails.angleDiff <= 100) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOverscrollDetected(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragInProgress, dragDetails]);

    useLayoutEffect(() => {
        if (!targetElement) {
            return;
        }

        targetElement.addEventListener("scroll", onScroll, { passive: true });
        targetElement.addEventListener("scrollend", onScrollEnd, {
            passive: true,
        });

        return () => {
            if (targetElement) {
                targetElement.removeEventListener("scroll", onScroll);
                targetElement.addEventListener("scrollend", onScrollEnd);
            }
        };
    }, [onScroll, onScrollEnd, targetElement]);

    return { setRef, overscrollDetected, dragDetails, dragInProgress };
}
