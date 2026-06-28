import {
    Fragment,
    useEffect,
    useMemo,
    type ComponentType,
    type ReactNode,
} from "react";
import classes from "./Route.module.css";
import useRouterContext from "@root/routing/hooks/useRouterContext";
import { generateUUID } from "@root/utils";
import { MoranaPage } from "@root/core";

interface RouteProps {
    readonly url: string;
    readonly component: ComponentType;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
    readonly cacheable?: boolean;
    readonly wrapWithPage?: boolean;
}

export default function Route({
    url,
    component,
    wrapper = Fragment,
    cacheable = true,
    wrapWithPage = true,
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

        const CoreWrapper = wrapWithPage ? MoranaPage : Fragment;

        return (
            <div
                className={classes.route}
                id={routeUUID}
                key={routeUUID}
                style={{ display: isCurrentRoute ? "block" : "none" }}
            >
                <CoreWrapper
                    {...(wrapWithPage && { currentRouteUuid: routeUUID })}
                >
                    <Wrapper>
                        <Component />
                    </Wrapper>
                </CoreWrapper>
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
        wrapWithPage,
    ]);

    return routeComponent;
}
