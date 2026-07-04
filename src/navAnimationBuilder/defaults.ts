import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import classes from "./defaults.module.css";
import type { AnimationWrapperRef } from "@root/types/NavAnimationBuilder";
import { sleep } from "@root/utils";
import type { NavigationTransitionDirection } from "@root/types/NavigationTransitionDirection";

export const defaultSlideNavAnimationBuilder: NavAnimationBuilder = {
    route: {
        includeDefaultCssClasses: false,
        // eslint-disable-next-line @typescript-eslint/require-await
        onEnterAnimation: async (
            routeRef: AnimationWrapperRef,
            direction: NavigationTransitionDirection | undefined,
        ) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.remove(classes.defaultAwayRoute);
            ref.classList.remove(classes.parked);

            ref.classList.add(classes.defaultCurrentRoute);
            ref.classList.add(classes.defaultRouteEnterAnimation);

            if (direction === "back") {
                ref.classList.add(classes.back);
            }
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        onExitAnimation: async (
            routeRef: AnimationWrapperRef,
            direction: NavigationTransitionDirection | undefined,
        ) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.remove(classes.defaultCurrentRoute);
            ref.classList.add(classes.defaultAwayRoute);

            ref.classList.add(classes.defaultRouteExitAnimation);

            if (direction === "back") {
                ref.classList.add(classes.back);
            }
        },
        onAnimationCleanup: async (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            await sleep(600);

            if (ref.classList.contains(classes.defaultAwayRoute)) {
                ref.classList.add(classes.parked);
            }

            ref.classList.remove(classes.defaultRouteExitAnimation);

            ref.classList.remove(classes.defaultRouteEnterAnimation);
            ref.classList.remove(classes.back);
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

            ref.classList.remove(classes.defaultFadeInAnimation);
            ref.classList.remove(classes.defaultFadeOutAnimation);
        },
    },
};
