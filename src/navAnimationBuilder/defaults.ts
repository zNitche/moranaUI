import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import classes from "./defaults.module.css";
import type { AnimationWrapperRef } from "@root/types/NavAnimationBuilder";

export const defaultSlideNavAnimationBuilder: NavAnimationBuilder = {
    transitionDuration: {
        pre: 0,
        post: 0,
        navDebounce: 1500,
        cleanupDelay: 100,
    },
    route: {
        wrapperClassName: classes.routeTransition,
        onEnterAnimation: (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.remove(classes.routeTransition);
            ref.classList.remove(classes.defaultAwayRoute);
            ref.classList.add(classes.defaultCurrentRoute);

            ref.classList.add(classes.defaultRouteEnterAnimation);
        },
        onExitAnimation: (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            ref.classList.add(classes.routeTransition);

            ref.classList.remove(classes.defaultCurrentRoute);
            ref.classList.add(classes.defaultAwayRoute);

            ref.classList.add(classes.defaultRouteExitAnimation);
        },

        onAnimationCleanup: (routeRef: AnimationWrapperRef) => {
            const ref = routeRef.current;

            if (!ref) {
                return;
            }

            setTimeout(() => {
                ref.classList.remove(classes.defaultRouteExitAnimation);
                ref.classList.remove(classes.defaultRouteEnterAnimation);
            }, 200);
        },
    },
};
