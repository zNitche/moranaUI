import { useEffect } from "react";
import useDrag from "./useDrag";

interface HookUseOnSwipeProps {
    readonly onSwipe?: () => void;
    readonly minMaxAngle: { min: number; max: number };
    readonly minDragDistance: number;
}

export default function useOnSwipe({
    onSwipe,
    minMaxAngle,
    minDragDistance,
}: HookUseOnSwipeProps) {
    const { setRef, dragDetails, dragInProgress } = useDrag({});

    useEffect(() => {
        if (!dragInProgress || !dragDetails) {
            return;
        }

        if (dragDetails.distanceFromStart >= minDragDistance) {
            if (
                dragDetails.angleDiff >= minMaxAngle.min &&
                dragDetails.angleDiff <= minMaxAngle.max
            ) {
                onSwipe?.();
            }
        }
    }, [
        dragDetails,
        dragInProgress,
        minDragDistance,
        minMaxAngle.max,
        minMaxAngle.min,
        onSwipe,
    ]);

    return { setRef };
}
