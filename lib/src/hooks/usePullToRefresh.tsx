import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

    const refreshInProgressRef = useRef<boolean>(false);

    const onOverscrollStartCallback = useCallback(() => {
        setIsIndicatorVisible(true);
    }, []);

    const onOverscrollEndCallback = useCallback(() => {
        if (!refreshInProgress) {
            setIsIndicatorVisible(false);
        }
    }, [refreshInProgress]);

    const { setRef, dragDetails, overscrollDetected } = useOnOverscroll({
        onOverscrollStartCallback,
        onOverscrollEndCallback,
    });

    useEffect(() => {
        if (refreshInProgressRef.current) {
            return;
        }

        if (refreshInProgress) {
            refreshInProgressRef.current = true;

            void callback?.().then(() => {
                setRefreshInProgress(false);
                refreshInProgressRef.current = false;
            });
        }
    }, [callback, refreshInProgress]);

    const dragProgressTillTrigger = useMemo(() => {
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
    }, [dragDetails?.distanceFromStart, minDrag, overscrollDetected]);

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
