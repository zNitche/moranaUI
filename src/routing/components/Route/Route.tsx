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
import useDetectTransition from "@root/core/hooks/useDetectTransition";
import useHandleTransitionAnimation from "@root/core/hooks/useHandleTransitionAnimation";
import useMoranaAppContext from "@root/core/hooks/context/useMoranaAppContext";

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

    const { transitionDetails } = useDetectTransition(routeUUID);
    const { handleTransitionAnimation } = useHandleTransitionAnimation();

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
        if (!transitionDetails.detected) {
            return;
        }

        void handleTransitionAnimation({
            transitionDetails: transitionDetails,
            onAnimationCleanup: navAnimationBuilder?.route?.onAnimationCleanup,
            onEnterAnimation: navAnimationBuilder?.route?.onEnterAnimation,
            onExitAnimation: navAnimationBuilder?.route?.onExitAnimation,
            wrapperRef: wrapperRef,
        });

        if (transitionDetails.isCurrentlyEntering) {
            lifecycleHooks?.onEnter?.();
        } else {
            lifecycleHooks?.onExit?.();
        }
    }, [
        handleTransitionAnimation,
        lifecycleHooks,
        navAnimationBuilder?.route,
        routeUUID,
        router,
        transitionDetails,
    ]);

    const routeComponent = useMemo(() => {
        if (!inCache && !isCurrentRoute) {
            return;
        }

        if (cacheable) {
            // eslint-disable-next-line react-hooks/refs
            __addToRouterCache(routeUUID, wrapperRef);
        }

        const builtInCssClasses: (string | undefined)[] = [];

        if (navAnimationBuilder?.route?.includeDefaultCssClasses) {
            builtInCssClasses.push(classes.hidden);
        }

        const Component = component;
        const Wrapper = wrapper;

        return (
            <div
                ref={wrapperRef}
                className={clsx(
                    classes.route,
                    ...builtInCssClasses,
                    navAnimationBuilder?.route?.wrapperClassName,
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
