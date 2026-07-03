import useRouterContext from "@root/routing/hooks/useRouterContext";
import type NavigationTransitionDetails from "@root/types/NavigationTransitionDetails";
import { useMemo } from "react";

export default function useDetectTransition(routeUUID: string) {
    const { router } = useRouterContext();

    const transitionDetails = useMemo((): NavigationTransitionDetails => {
        const ret = {
            detected: false,
            isCurrentlyEntering: false,
            isCurrentlyExiting: false,
        };

        if (router.navigationStack.length < 2) {
            return ret;
        }

        const isCurrentlyEntering = router.navigationStack.at(-1) === routeUUID;
        const isCurrentlyExiting = router.navigationStack.at(-2) === routeUUID;

        if (!isCurrentlyEntering && !isCurrentlyExiting) {
            return ret;
        }

        ret.detected = true;
        ret.isCurrentlyEntering = isCurrentlyEntering;
        ret.isCurrentlyExiting = isCurrentlyExiting;

        return ret;
    }, [routeUUID, router]);

    return { transitionDetails };
}
