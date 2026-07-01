import type { RefObject } from "react";

export type AnimationWrapperRef = RefObject<HTMLDivElement | null>;

export default interface NavAnimationBuilder {
    transitionDuration?: {
        pre: number;
        post: number;
        navDebounce?: number;
        cleanupDelay?: number;
    };
    
    pageWrapperClassName?: string;
    onPageEnterAnimation?: (pageRef: AnimationWrapperRef) => void;
    onPageExitAnimation?: (pageRef: AnimationWrapperRef) => void;
    onPageAnimationCleanup?: (pageRef: AnimationWrapperRef) => void;

    routeWrapperClassName?: string;
    onRouteEnterAnimation?: (routeRef: AnimationWrapperRef) => void;
    onRouteExitAnimation?: (routeRef: AnimationWrapperRef) => void;
    onRouteAnimationCleanup?: (routeRef: AnimationWrapperRef) => void;
}
