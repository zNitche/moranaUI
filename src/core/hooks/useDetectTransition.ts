import useRouterContext from "@root/routing/hooks/useRouterContext";
import type NavigationTransitionDetails from "@root/types/NavigationTransitionDetails";
import { useMemo } from "react";

export default function useDetectTransition(routeUUID: string) {
    const { router } = useRouterContext();

    const transitionDetails = useMemo((): NavigationTransitionDetails => {
        const ret: NavigationTransitionDetails = {
            detected: false,
            isCurrentlyEntering: false,
            isCurrentlyExiting: false,
            direction: undefined,
        };

        if (router.navigationStack.length < 2) {
            return ret;
        }

        const nextStackItem = router.navigationStack.at(-1);
        const currentStackItemStackItem = router.navigationStack.at(-2);

        const isCurrentlyEntering = nextStackItem?.routeUUID === routeUUID;
        const isCurrentlyExiting =
            currentStackItemStackItem?.routeUUID === routeUUID;

        if (!isCurrentlyEntering && !isCurrentlyExiting) {
            return ret;
        }

        if (router.navigationStack.length >= 3) {
            const backTargetItem = router.navigationStack.at(-3);

            if (backTargetItem?.routeUUID === nextStackItem?.routeUUID) {
                ret.direction = "back";
            } else {
                ret.direction = "forward";
            }
        }

        ret.detected = true;
        ret.isCurrentlyEntering = isCurrentlyEntering;
        ret.isCurrentlyExiting = isCurrentlyExiting;

        return ret;
    }, [routeUUID, router]);

    return { transitionDetails };
}
