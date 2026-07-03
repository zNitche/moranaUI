import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import classes from "./defaults.module.css";
import type { AnimationWrapperRef } from "@root/types/NavAnimationBuilder";
import { sleep } from "@root/utils";

export const defaultSlideNavAnimationBuilder: NavAnimationBuilder = {
    route: {
        includeDefaultCssClasses: false,
        // eslint-disable-next-line @typescript-eslint/require-await
        onEnterAnimation: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.add(classes.routeTransition);

            ref.classList.remove(classes.defaultAwayRoute);
            ref.classList.remove(classes.parked);

            ref.classList.add(classes.defaultCurrentRoute);
            ref.classList.add(classes.defaultRouteEnterAnimation);
        },
        onExitAnimation: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.remove(classes.defaultCurrentRoute);
            ref.classList.add(classes.defaultAwayRoute);

            ref.classList.add(classes.defaultRouteExitAnimation);

            await sleep(300);

            ref.classList.add(classes.parked);
        },
        onAnimationCleanup: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            await sleep(300);

            ref.classList.remove(classes.routeTransition);
            ref.classList.remove(classes.defaultRouteExitAnimation);
            ref.classList.remove(classes.defaultRouteEnterAnimation);
        },
    },
};

export const defaultFadeNavAnimationBuilder: NavAnimationBuilder = {
    route: {
        includeDefaultCssClasses: false,
        // eslint-disable-next-line @typescript-eslint/require-await
        onEnterAnimation: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.remove(classes.defaultAwayRouteFade);
            ref.classList.remove(classes.hidden);

            ref.classList.add(classes.defaultCurrentRouteFade);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        onExitAnimation: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.remove(classes.defaultCurrentRouteFade);
            ref.classList.add(classes.defaultAwayRouteFade);
        },
        onAnimationCleanup: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            await sleep(300);

            if (ref.classList.contains(classes.defaultAwayRouteFade)) {
                ref.classList.add(classes.hidden);
            }
        },
    },
    page: {
        // eslint-disable-next-line @typescript-eslint/require-await
        onEnterAnimation: async (pageRef: AnimationWrapperRef) => {
            const ref = pageRef.current;

            if (!ref) {
                return;
            }

            ref.classList.add(classes.defaultFadeInAnimation);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        onExitAnimation: async (pageRef: AnimationWrapperRef) => {
            const ref = pageRef.current;

            if (!ref) {
                return;
            }

            ref.classList.add(classes.defaultFadeOutAnimation);
        },
        onAnimationCleanup: async (pageRef: AnimationWrapperRef) => {
            const ref = pageRef.current;

            if (!ref) {
                return;
            }

            await sleep(300);

            ref.classList.remove(classes.defaultFadeInAnimation)
            ref.classList.remove(classes.defaultFadeOutAnimation)
        },
    },
};
