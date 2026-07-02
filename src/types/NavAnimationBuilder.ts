import type { RefObject } from "react";

export type AnimationWrapperRef = RefObject<HTMLDivElement | null>;

export default interface NavAnimationBuilder {
    transitionDuration?: {
        pre: number;
        post: number;
        navDebounce?: number;
        cleanupDelay?: number;
    };

    page?: {
        wrapperClassName?: string;
        onEnterAnimation?: (pageRef: AnimationWrapperRef) => Promise<void>;
        onExitAnimation?: (pageRef: AnimationWrapperRef) => Promise<void>;
    };
    route?: {
        wrapperClassName?: string;
        onEnterAnimation?: (routeRef: AnimationWrapperRef) => Promise<void>;
        onExitAnimation?: (routeRef: AnimationWrapperRef) => Promise<void>;
        onAnimationCleanup?: (routeRef: AnimationWrapperRef) => Promise<void>;
    };
}
