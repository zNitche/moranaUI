import useRouterContext from "#root/routing/hooks/useRouterContext";
import type NavigationTransitionDetails from "#root/types/NavigationTransitionDetails";
import { useMemo } from "react";

export default function useDetectTransition(routeUUID: string) {
    const { router, getRouteWrapperElementByUUID } = useRouterContext();

    const nextNavigationStackItem = router.navigationStack.at(-1);

    const transitionDetails = useMemo((): NavigationTransitionDetails => {
        const ret: NavigationTransitionDetails = {
            detected: false,
            isCurrentlyEntering: false,
            isCurrentlyExiting: false,
        };

        if (!nextNavigationStackItem?.previousRouteUUID) {
            return ret;
        }

        if (router.navigationStack.length < 2) {
            return ret;
        }

        const isCurrentlyEntering =
            nextNavigationStackItem.routeUUID === routeUUID;
        const isCurrentlyExiting =
            nextNavigationStackItem.previousRouteUUID === routeUUID;

        if (!isCurrentlyEntering && !isCurrentlyExiting) {
            return ret;
        }

        if (nextNavigationStackItem.originDirection) {
            ret.direction = nextNavigationStackItem.originDirection;
        }

        ret.detected = true;
        ret.isCurrentlyEntering = isCurrentlyEntering;
        ret.isCurrentlyExiting = isCurrentlyExiting;

        const routeTransitionPartnerUUID = ret.isCurrentlyEntering
            ? nextNavigationStackItem.previousRouteUUID
            : nextNavigationStackItem.routeUUID;

        ret.tranitionPartnerElement = getRouteWrapperElementByUUID(
            routeTransitionPartnerUUID,
        );

        return ret;
    }, [
        getRouteWrapperElementByUUID,
        nextNavigationStackItem,
        routeUUID,
        router.navigationStack.length,
    ]);

    return { transitionDetails };
}
