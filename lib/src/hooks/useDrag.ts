import {
    useCallback,
    useMemo,
    useState,
    type PointerEvent,
    type PointerEventHandler,
} from "react";

type EventPosition = { x: number; y: number } | undefined;

export default function useDrag<T>() {
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

    const onDragStart = useCallback((e: PointerEvent<T>) => {
        setIsActive(true);

        setDragInProgress(true);

        setStartPosition({ x: e.clientX, y: e.clientY });
    }, []);

    const onPointerDown: PointerEventHandler<T> = useCallback(
        (event: PointerEvent<T>) => {
            onDragStart(event);
        },
        [onDragStart],
    );

    const onPointerUp: PointerEventHandler<T> = useCallback(
        (_event: PointerEvent<T>) => {
            onDragEnd();
        },
        [onDragEnd],
    );

    const onPointerMove: PointerEventHandler<T> = useCallback(
        (event: PointerEvent<T>) => {
            if (!isActive || !dragInProgress) {
                return;
            }

            onMove({ x: event.clientX, y: event.clientY });
        },
        [dragInProgress, isActive, onMove],
    );

    return {
        dragInProgress,
        isActive,
        startPosition,
        currentPosition,
        dragDetails,
        binds: { onPointerDown, onPointerUp, onPointerMove },
    };
}
