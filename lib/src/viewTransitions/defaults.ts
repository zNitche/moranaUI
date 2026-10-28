import type NavAnimationBuilder from "#root/types/NavAnimationBuilder";
import classes from "./defaults.module.css";

export const defaultSlideNavAnimationBuilder: NavAnimationBuilder = {
    route: {
        wrapperClassName: classes.slide,
        // includeDefaultCssClasses: false,
        // // eslint-disable-next-line @typescript-eslint/require-await
        // onEnterAnimation: async (
        //     routeRef: AnimationWrapperRef,
        //     direction: NavigationTransitionDirection | undefined,
        // ) => {
        //     const ref = routeRef.current;

        //     if (!ref) {
        //         return;
        //     }

        //     ref.classList.remove(classes.defaultAwayRoute);
        //     ref.classList.remove(classes.parked);

        //     ref.classList.add(classes.defaultCurrentRoute);
        //     ref.classList.add(classes.defaultRouteEnterAnimation);

        //     if (direction === "back") {
        //         ref.classList.add(classes.back);
        //     }
        // },
        // // eslint-disable-next-line @typescript-eslint/require-await
        // onExitAnimation: async (
        //     routeRef: AnimationWrapperRef,
        //     direction: NavigationTransitionDirection | undefined,
        // ) => {
        //     const ref = routeRef.current;

        //     if (!ref) {
        //         return;
        //     }

        //     ref.classList.remove(classes.defaultCurrentRoute);
        //     ref.classList.add(classes.defaultAwayRoute);

        //     ref.classList.add(classes.defaultRouteExitAnimation);

        //     if (direction === "back") {
        //         ref.classList.add(classes.back);
        //     }
        // },
        // onAnimationCleanup: async (routeRef: AnimationWrapperRef) => {
        //     const ref = routeRef.current;

        //     if (!ref) {
        //         return;
        //     }

        //     await sleep(400);

        //     if (ref.classList.contains(classes.defaultAwayRoute)) {
        //         ref.classList.add(classes.parked);
        //     }

        //     ref.classList.remove(classes.defaultRouteExitAnimation);

        //     ref.classList.remove(classes.defaultRouteEnterAnimation);
        //     ref.classList.remove(classes.back);
        // },
    },
};
