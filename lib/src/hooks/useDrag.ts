import type DragDetail from "@root/types/DragDetails";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type EventPosition = { x: number; y: number } | undefined;

export default function useDrag() {
    const [refElement, setRefElement] = useState<HTMLElement | null>(null);

    const setRef = useCallback((e: HTMLElement | null) => {
        setRefElement(e);
    }, []);

    const [dragInProgress, setDragInProgress] = useState<boolean>(false);
    const dragInProgressRef = useRef<boolean>(dragInProgress);

    const [startPosition, setStartPosition] =
        useState<EventPosition>(undefined);
    const [currentPosition, setCurrentPosition] =
        useState<EventPosition>(undefined);

    useEffect(() => {
        dragInProgressRef.current = dragInProgress;
    }, [dragInProgress]);

    const dragDetails: DragDetail | undefined = useMemo(() => {
        if (!dragInProgress) {
            return;
        }

        if (!startPosition || !currentPosition) {
            return;
        }

        const positionDiff = {
            x: startPosition.x - currentPosition.x,
            y: startPosition.y - currentPosition.y,
        };

        const dx = currentPosition.x - startPosition.x;
        const dy = currentPosition.y - startPosition.y;

        const distanceFromStart = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        const angleDiff = (Math.atan2(dy, dx) * 180) / Math.PI;

        return {
            positionDiff,
            distanceFromStart,
            angleDiff,
        };
    }, [currentPosition, dragInProgress, startPosition]);

    const onDragEnd = useCallback(() => {
        setDragInProgress(false);

        setStartPosition(undefined);
        setCurrentPosition(undefined);
    }, []);

    const onDragStart = useCallback((e: TouchEvent) => {
        setDragInProgress(true);

        const touch = e.touches.item(0);

        if (!touch) {
            return;
        }

        setStartPosition({ x: touch.clientX, y: touch.clientY });
    }, []);

    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            onDragStart(e);
        },
        [onDragStart],
    );

    const onTouchEnd = useCallback(
        (_e: TouchEvent) => {
            if (dragInProgressRef.current) {
                onDragEnd();
            }
        },
        [onDragEnd],
    );

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (!dragInProgressRef.current) {
            return;
        }

        const touch = e.touches.item(0);

        if (!touch) {
            return;
        }

        setCurrentPosition({ x: touch.clientX, y: touch.clientY });
    }, []);

    useEffect(() => {
        if (!refElement) {
            return;
        }

        refElement.addEventListener("touchend", onTouchEnd);
        refElement.addEventListener("touchstart", onTouchStart);
        refElement.addEventListener("touchmove", onTouchMove);
        refElement.addEventListener("touchcancel", onTouchEnd);

        return () => {
            if (refElement) {
                refElement.removeEventListener("touchend", onTouchEnd);
                refElement.removeEventListener("touchstart", onTouchStart);
                refElement.removeEventListener("touchmove", onTouchMove);
                refElement.removeEventListener("touchcancel", onTouchEnd);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refElement]);

    return {
        dragInProgress,
        startPosition,
        currentPosition,
        dragDetails,
        setRef,
    };
}
