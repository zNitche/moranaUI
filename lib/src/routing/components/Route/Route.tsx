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
import useRouterContext from "#root/routing/hooks/useRouterContext";
import { clsx, generateUUID } from "#root/utils";
import type RouteContextType from "#root/types/RouteContextType";
import { RouteContext } from "#root/routing/context";
import useDetectTransition from "#root/core/hooks/useDetectTransition";
import useMoranaAppContext from "#root/core/hooks/context/useMoranaAppContext";
import type { RouteLifecycleHookType } from "#root/types/RouteLifecycleHookType";
import type RouteLifecycleCallbacks from "#root/types/RouteLifecycleCallbacks";
import type NavigationTransitionDetails from "#root/types/NavigationTransitionDetails";
import ViewTransitionController from "#root/viewTransitions/ViewTransitionController";

interface RouteProps {
    readonly url: string;
    readonly component: ComponentType;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
    readonly cacheable?: boolean;
    readonly name?: string;
    readonly navbarVisible?: boolean;
}

export default function Route({
    url,
    component,
    name,
    wrapper = Fragment,
    cacheable = true,
    navbarVisible = true,
}: RouteProps) {
    const { setIsNavbarVisible } = useMoranaAppContext();

    const routeUUID = useMemo(() => generateUUID(), []);
    const routeWrapperRef = useRef<HTMLDivElement>(null);

    const markedForCacheRemovalRef = useRef<boolean>(false);

    const lifecycleCallbackCalled = useRef<{
        onExit: boolean;
        onEnter: boolean;
    }>({ onEnter: false, onExit: false });

    const {
        __addRoute,
        router,
        routerCache,
        __addToRouterCache,
        __removeFromRouterCache,
    } = useRouterContext();

    const { navAnimationBuilder } = useMoranaAppContext();

    const [lifecycleHooks, setLifecycleHooks] = useState<
        RouteLifecycleCallbacks | undefined
    >(undefined);

    const { transitionDetails } = useDetectTransition(routeUUID);

    useLayoutEffect(() => {
        __addRoute({
            uuid: routeUUID,
            name: name,
            url,
            component,
            wrapperElementRef: routeWrapperRef,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentRouteStats = useMemo(() => {
        const currentRouteInCache = Object.keys(routerCache).includes(routeUUID)
            ? routerCache[routeUUID]
            : undefined;

        return {
            isCurrentRoute: Boolean(routeUUID === router.currentRoute?.uuid),
            inCache: !!currentRouteInCache,
            markedForRemoval: currentRouteInCache?.markedForRemoval ?? false,
        };
    }, [routeUUID, routerCache, router.currentRoute]);

    useLayoutEffect(() => {
        markedForCacheRemovalRef.current = currentRouteStats.markedForRemoval;
    }, [currentRouteStats.markedForRemoval]);

    const registerLifecycleHook = useCallback(
        (type: RouteLifecycleHookType, callback: () => void) => {
            const hooksMap: Record<RouteLifecycleHookType, string> = {
                enter: "onEnter",
                exit: "onExit",
            } as const;

            setLifecycleHooks((current) => {
                return { ...current, [hooksMap[type]]: callback };
            });
        },
        [],
    );

    const __callLifecycleHooks = useCallback(() => {
        if (transitionDetails.isCurrentlyEntering) {
            if (!lifecycleCallbackCalled.current.onEnter) {
                if (!lifecycleHooks?.onEnter) {
                    return;
                }

                lifecycleHooks.onEnter();
                lifecycleCallbackCalled.current.onEnter = true;
            }

            lifecycleCallbackCalled.current.onEnter = false;
        } else {
            if (!lifecycleCallbackCalled.current.onExit) {
                if (!lifecycleHooks?.onExit) {
                    return;
                }

                lifecycleHooks.onExit();
                lifecycleCallbackCalled.current.onExit = true;
            }

            lifecycleCallbackCalled.current.onExit = false;
        }
    }, [lifecycleHooks, transitionDetails.isCurrentlyEntering]);

    const __handleNavbarState = useCallback(
        (transitionDetails: NavigationTransitionDetails) => {
            if (transitionDetails.isCurrentlyEntering) {
                setIsNavbarVisible?.(navbarVisible);
                return;
            }
        },
        [navbarVisible, setIsNavbarVisible],
    );

    useEffect(() => {
        if (!transitionDetails.detected) {
            return;
        }

        __handleNavbarState(transitionDetails);
        __callLifecycleHooks();
    }, [
        __callLifecycleHooks,
        __handleNavbarState,
        transitionDetails,
        transitionDetails.detected,
    ]);

    // transitions handling
    useLayoutEffect(() => {
        if (!transitionDetails.detected) {
            return;
        }

        if (!routeWrapperRef.current) {
            return;
        }

        const vc = new ViewTransitionController({
            viewElement: routeWrapperRef.current,
            partnerViewElement: transitionDetails.tranitionPartnerElement
        });

        vc.start({
            target: transitionDetails.isCurrentlyEntering ? "in" : "out",
        });

        // void handleTransitionAnimation({
        //     transitionDetails: transitionDetails,
        //     onAnimationCleanup: navAnimationBuilder?.route?.onAnimationCleanup,
        //     onEnterAnimation: navAnimationBuilder?.route?.onEnterAnimation,
        //     onExitAnimation: navAnimationBuilder?.route?.onExitAnimation,
        //     wrapperRef: routeWrapperRef,
        // }).finally(() => {
        //     if (transitionDetails.isCurrentlyEntering) {
        //         return;
        //     }

        //     if (!cacheable || markedForCacheRemovalRef.current) {
        //         __removeFromRouterCache(routeUUID);
        //     }
        // });
    }, [
        __removeFromRouterCache,
        cacheable,
        navAnimationBuilder?.route,
        routeUUID,
        transitionDetails,
    ]);

    const shouldRenderRouteComponent = Boolean(
        currentRouteStats.inCache || currentRouteStats.isCurrentRoute,
    );

    useLayoutEffect(() => {
        if (shouldRenderRouteComponent) {
            __addToRouterCache(routeUUID, routeWrapperRef);
        }
    }, [__addToRouterCache, routeUUID, shouldRenderRouteComponent]);

    const routeComponent = useMemo(() => {
        if (!shouldRenderRouteComponent) {
            return;
        }

        const builtInCssClasses: (string | undefined)[] = [];

        // if (navAnimationBuilder?.route?.includeDefaultCssClasses) {
        //     builtInCssClasses.push(classes.hidden);
        // }

        const Component = component;
        const Wrapper = wrapper;

        return (
            <div
                ref={routeWrapperRef}
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
        shouldRenderRouteComponent,
        routeUUID,
        navAnimationBuilder?.route?.wrapperClassName,
        component,
        wrapper,
    ]);

    const contextValues: RouteContextType = useMemo(() => {
        return {
            routeUUID,
            registerLifecycleHook,
            isCurrentRoute: currentRouteStats.isCurrentRoute,
        };
    }, [routeUUID, registerLifecycleHook, currentRouteStats]);

    return (
        <RouteContext.Provider value={contextValues}>
            {routeComponent}
        </RouteContext.Provider>
    );
}
