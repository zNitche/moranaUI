import {
    useCallback,
    useMemo,
    useState,
    type TouchEvent,
    type TouchEventHandler,
} from "react";

type EventPosition = { x: number; y: number } | undefined;

export default function useDrag() {
    const [isActive, setIsActive] = useState<boolean>(false);

    const [dragInProgress, setDragInProgress] = useState<boolean>(false);

    const [startPosition, setStartPosition] =
        useState<EventPosition>(undefined);
    const [currentPosition, setCurrentPosition] =
        useState<EventPosition>(undefined);

    const dragDetails = useMemo(() => {
        if (!isActive) {
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
    }, [currentPosition, isActive, startPosition]);

    const onDragEnd = useCallback(() => {
        setDragInProgress(false);

        setStartPosition(undefined);
        setCurrentPosition(undefined);

        setIsActive(false);
    }, []);

    const onMove = useCallback(
        (pos: EventPosition) => {
            if (!isActive || !pos) {
                return;
            }

            setCurrentPosition({ x: pos.x, y: pos.y });
        },
        [isActive],
    );

    const onDragStart = useCallback((e: TouchEvent<HTMLElement>) => {
        setIsActive(true);
        setDragInProgress(true);

        const touch = e.touches.item(0);

        setStartPosition({ x: touch.clientX, y: touch.clientY });
    }, []);

    const onTouchStart: TouchEventHandler<HTMLElement> = useCallback(
        (e: TouchEvent<HTMLElement>) => {
            onDragStart(e);
        },
        [onDragStart],
    );

    const onTouchEnd: TouchEventHandler<HTMLElement> = useCallback(
        (_e: TouchEvent<HTMLElement>) => {
            if (isActive) {
                onDragEnd();
            }
        },
        [isActive, onDragEnd],
    );

    const onTouchMove: TouchEventHandler<HTMLElement> = useCallback(
        (e: TouchEvent<HTMLElement>) => {
            if (e.cancelable) {
                e.preventDefault();
            }

            if (!isActive || !dragInProgress) {
                return;
            }

            const touch = e.touches.item(0);
            onMove({ x: touch.clientX, y: touch.clientY });
        },
        [dragInProgress, isActive, onMove],
    );

    return {
        dragInProgress,
        isActive,
        startPosition,
        currentPosition,
        dragDetails,
        binds: {
            onTouchEnd,
            onTouchStart,
            onTouchMove,
            onTouchCancel: onTouchEnd,
        },
    };
}
