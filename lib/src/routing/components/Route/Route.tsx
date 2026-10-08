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
import type { RouteLifecycleHookType } from "@root/types/RouteLifecycleHookType";
import type RouteLifecycleCallbacks from "@root/types/RouteLifecycleCallbacks";

interface RouteProps {
    readonly url: string;
    readonly component: ComponentType;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
    readonly cacheable?: boolean;
    readonly name?: string;
}

export default function Route({
    url,
    component,
    wrapper = Fragment,
    cacheable = true,
    name,
}: RouteProps) {
    const routeUUID = useMemo(() => generateUUID(), []);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const onEnterLifecycleCallbackCalled = useRef<boolean>(false);
    const onExitLifecycleCallbackCalled = useRef<boolean>(false);
    const onMountLifecycleCallbackCalled = useRef<boolean>(false);
    const onUnmountLifecycleCallbackCalled = useRef<boolean>(false);

    const { __addRoute, router, routerCache, __addToRouterCache } =
        useRouterContext();

    const { navAnimationBuilder } = useMoranaAppContext();

    const [lifecycleHooks, setLifecycleHooks] = useState<
        RouteLifecycleCallbacks | undefined
    >(undefined);

    const { transitionDetails } = useDetectTransition(routeUUID);
    const { handleTransitionAnimation } = useHandleTransitionAnimation();

    useEffect(() => {
        __addRoute({ uuid: routeUUID, name: name, url, component });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            !onMountLifecycleCallbackCalled.current &&
            lifecycleHooks?.onMount !== undefined
        ) {
            lifecycleHooks.onMount();

            onMountLifecycleCallbackCalled.current = true;
        }

        return () => {
            if (!onUnmountLifecycleCallbackCalled.current) {
                lifecycleHooks?.onUnmount?.();

                onUnmountLifecycleCallbackCalled.current = true;
            }
        };
    }, [lifecycleHooks]);

    const isCurrentRoute = useMemo(
        () => Boolean(routeUUID === router.currentRoute?.uuid),
        [routeUUID, router.currentRoute?.uuid],
    );
    const inCache = useMemo(
        () => Object.keys(routerCache).includes(routeUUID),
        [routeUUID, routerCache],
    );

    const registerLifecycleHook = useCallback(
        (type: RouteLifecycleHookType, callback: () => void) => {
            const hooksMap: Record<RouteLifecycleHookType, string> = {
                enter: "onEnter",
                exit: "onExit",
                mount: "onMount",
                unmount: "onUnmount",
            } as const;

            setLifecycleHooks((current) => {
                return { ...current, [hooksMap[type]]: callback };
            });
        },
        [],
    );

    const __callLifecycleHooks = useCallback(() => {
        if (transitionDetails.isCurrentlyEntering) {
            if (!onEnterLifecycleCallbackCalled.current) {
                if (!lifecycleHooks?.onEnter) {
                    return
                }

                lifecycleHooks?.onEnter?.();
                onEnterLifecycleCallbackCalled.current = true;
            }

            onExitLifecycleCallbackCalled.current = false;
        } else {
            if (!onExitLifecycleCallbackCalled.current) {
                if (!lifecycleHooks?.onExit) {
                    return
                }

                lifecycleHooks?.onExit?.();
                onExitLifecycleCallbackCalled.current = true;
            }

            onEnterLifecycleCallbackCalled.current = false;
        }
    }, [lifecycleHooks, transitionDetails.isCurrentlyEntering]);

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
    }, [handleTransitionAnimation, lifecycleHooks, navAnimationBuilder?.route,
        routeUUID, router, transitionDetails]);

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
