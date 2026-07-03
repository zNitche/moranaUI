import type { RefObject } from "react";

export type AnimationWrapperRef = RefObject<HTMLDivElement | null>;
export type AnimationStageCallback =
    | ((wrapperRef: AnimationWrapperRef) => Promise<void>)
    | undefined;

export default interface NavAnimationBuilder {
    page?: {
        wrapperClassName?: string;
        onEnterAnimation: AnimationStageCallback;
        onExitAnimation: AnimationStageCallback;
        onAnimationCleanup: AnimationStageCallback;
    };
    route?: {
        wrapperClassName?: string;
        includeDefaultCssClasses: boolean;
        onEnterAnimation: AnimationStageCallback;
        onExitAnimation: AnimationStageCallback;
        onAnimationCleanup: AnimationStageCallback;
    };
}
