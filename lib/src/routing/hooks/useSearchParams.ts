import { useLayoutEffect, useRef } from "react";
import useRouteContext from "./useRouteContext";
import useRouterContext from "./useRouterContext";
import { useInitialRef } from "#root/hooks";

export default function useSearchParams<T>() {
    const paramsRef = useRef<T>(null);

    const routerContext = useRouterContext();
    const routeContext = useRouteContext();

    const initialRouteUUIDRef = useInitialRef(routeContext.routeUUID);

    useLayoutEffect(() => {
        if (!routerContext?.router || !routeContext) {
            throw new Error("useSearchParams can't be called outside Route");
        }

        const currentRouteUUID = routerContext.router.currentRoute?.uuid;

        if (currentRouteUUID !== initialRouteUUIDRef.current) {
            return;
        }

        const searchParams = new URLSearchParams(routerContext.router?.search);
        paramsRef.current = Object.fromEntries(searchParams) as T;
    }, [initialRouteUUIDRef, routeContext, routerContext.router]);

    // eslint-disable-next-line react-hooks/refs
    return paramsRef.current;
}
