import { useEffect, useMemo, useState } from "react";
import useOnOverscroll from "./useOnOverscroll";
import { createPortal } from "react-dom";
import { MoranaRefresher } from "@root/components";
import clamp from "@root/utils/clamp";

interface HookUsePullToRefreshProps {
    readonly minDrag?: number;
    readonly callback?: () => Promise<void>;
}

export default function usePullToRefresh({
    minDrag = 100,
    callback,
}: HookUsePullToRefreshProps) {
    const [isIndicatorVisible, setIsIndicatorVisible] =
        useState<boolean>(false);
    const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false);

    const { setRef, dragDetails, dragInProgress, overscrollDetected } =
        useOnOverscroll({});

    useEffect(() => {
        if (refreshInProgress) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsIndicatorVisible(true);
            return;
        }

        if (overscrollDetected) {
            setIsIndicatorVisible(dragInProgress);
        }
    }, [dragInProgress, overscrollDetected, refreshInProgress]);

    useEffect(() => {
        if (refreshInProgress) {
            void callback?.().then(() => setRefreshInProgress(false));
        }
    }, [callback, refreshInProgress]);

    const dragProgressTillTrigger = useMemo(() => {
        if (refreshInProgress) {
            return 100;
        }

        if (!overscrollDetected) {
            return 0;
        }

        if (!dragDetails?.distanceFromStart) {
            return 0;
        }

        return clamp(
            Math.floor((dragDetails?.distanceFromStart * 100) / minDrag),
            0,
            100,
        );
    }, [
        dragDetails?.distanceFromStart,
        minDrag,
        overscrollDetected,
        refreshInProgress,
    ]);

    useEffect(() => {
        if (!isIndicatorVisible) {
            return;
        }

        if (dragProgressTillTrigger >= 100) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRefreshInProgress(true);
        }
    }, [dragProgressTillTrigger, isIndicatorVisible]);

    const refresherAnchor = useMemo(() => {
        if (!isIndicatorVisible) {
            return;
        }

        return createPortal(
            <MoranaRefresher
                dragProgress={dragProgressTillTrigger}
                active={refreshInProgress}
            />,
            document.body,
        );
    }, [dragProgressTillTrigger, isIndicatorVisible, refreshInProgress]);

    return { setRef, refreshInProgress, createPortal, refresherAnchor };
}
