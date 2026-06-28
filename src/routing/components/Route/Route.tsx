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

interface RouteProps {
    readonly url: string;
    readonly component: ComponentType;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
}

export default function Route({
    url,
    component,
    wrapper = Fragment,
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

        __addToRouterCache(routeUUID);

        const Component = component;
        const Wrapper = wrapper;

        return (
            <div
                className={classes.route}
                id={routeUUID}
                key={routeUUID}
                style={{ display: isCurrentRoute ? "block" : "none" }}
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
    ]);

    return routeComponent;
}
