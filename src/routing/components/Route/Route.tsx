import {
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
    type ComponentType,
    type ReactNode,
} from "react";
import classes from "./Route.module.css";
import useRouterContext from "@root/routing/hooks/useRouterContext";
import { generateUUID } from "@root/utils";
import type RouteContextType from "@root/types/RouteContextType";
import { RouteContext } from "@root/routing/context";

interface RouteProps {
    readonly url: string;
    readonly component: ComponentType;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
    readonly cacheable?: boolean;
}

export default function Route({
    url,
    component,
    wrapper = Fragment,
    cacheable = true,
}: RouteProps) {
    const routeUUID = useMemo(() => generateUUID(), []);

    const { __addRoute, router, routerCache, __addToRouterCache } =
        useRouterContext();

    useEffect(() => {
        __addRoute({ uuid: routeUUID, url, component });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isCurrentRoute = useMemo(
        () => Boolean(routeUUID === router.currentRoute?.uuid),
        [routeUUID, router.currentRoute?.uuid],
    );
    const inCache = useMemo(
        () => routerCache.includes(routeUUID),
        [routeUUID, routerCache],
    );

    const routeComponent = useMemo(() => {
        if (!inCache && !isCurrentRoute) {
            return;
        }

        if (cacheable) {
            __addToRouterCache(routeUUID);
        }

        const Component = component;
        const Wrapper = wrapper;

        return (
            <div
                className={classes.route}
                id={routeUUID}
                key={routeUUID}
                style={{
                    display: isCurrentRoute ? "block" : "none",
                }}
            >
                <Wrapper>
                    <Component />
                </Wrapper>
            </div>
        );
    }, [
        __addToRouterCache,
        component,
        inCache,
        isCurrentRoute,
        routeUUID,
        wrapper,
        cacheable,
    ]);

    const [lifecycleHooks, setLifecycleHooks] = useState<
        | {
              onEnter?: () => void;
              onExit?: () => void;
          }
        | undefined
    >(undefined);

    const registerLifecycleHook = useCallback(
        (type: "enter" | "exit", callback: () => void) => {
            switch (type) {
                case "enter":
                    setLifecycleHooks((current) => {
                        return { ...current, onEnter: callback };
                    });
                    return;

                case "exit":
                    setLifecycleHooks((current) => {
                        return { ...current, onExit: callback };
                    });
                    return;

                default:
                    return;
            }
        },
        [],
    );

    useLayoutEffect(() => {
        if (routeUUID !== router.currentRoute?.uuid) {
            return;
        }

        switch (router.navigationState?.type) {
            case "enter":
                lifecycleHooks?.onEnter?.();
                return;

            case "exit":
                lifecycleHooks?.onExit?.();
                return;

            default:
                return;
        }
    }, [
        router.navigationState,
        router.currentRoute?.uuid,
        routeUUID,
        lifecycleHooks,
    ]);

    const contextValues: RouteContextType = useMemo(() => {
        return { routeUUID, registerLifecycleHook, isCurrentRoute };
    }, [routeUUID, registerLifecycleHook, isCurrentRoute]);

    return (
        <RouteContext.Provider value={contextValues}>
            {routeComponent}
        </RouteContext.Provider>
    );
}
