import {
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type ComponentType,
    type ReactNode,
} from "react";
import classes from "./Route.module.css";
import useRouterContext from "@root/routing/hooks/useRouterContext";
import { clsx, generateUUID } from "@root/utils";
import type RouteContextType from "@root/types/RouteContextType";
import { RouteContext } from "@root/routing/context";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";

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
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { __addRoute, router, routerCache, __addToRouterCache } =
        useRouterContext();
    const { navAnimationBuilder } = useMoranaAppContext();

    const [lifecycleHooks, setLifecycleHooks] = useState<
        | {
              onEnter?: () => void;
              onExit?: () => void;
          }
        | undefined
    >(undefined);

    useEffect(() => {
        __addRoute({ uuid: routeUUID, url, component });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isCurrentRoute = useMemo(
        () => Boolean(routeUUID === router.currentRoute?.uuid),
        [routeUUID, router.currentRoute?.uuid],
    );
    const inCache = useMemo(
        () => Object.keys(routerCache).includes(routeUUID),
        [routeUUID, routerCache],
    );

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

    const routeComponent = useMemo(() => {
        if (!inCache && !isCurrentRoute) {
            return;
        }

        if (cacheable) {
            // eslint-disable-next-line react-hooks/refs
            __addToRouterCache(routeUUID, wrapperRef);
        }

        const Component = component;
        const Wrapper = wrapper;

        return (
            <div
                ref={wrapperRef}
                className={clsx(
                    classes.route,
                    navAnimationBuilder?.routeWrapperClassName,
                )}
                id={routeUUID}
                key={routeUUID}
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
        navAnimationBuilder,
    ]);

    const contextValues: RouteContextType = useMemo(() => {
        return {
            routeUUID,
            registerLifecycleHook,
            isCurrentRoute,
        };
    }, [routeUUID, registerLifecycleHook, isCurrentRoute]);

    return (
        <RouteContext.Provider value={contextValues}>
            {routeComponent}
        </RouteContext.Provider>
    );
}
