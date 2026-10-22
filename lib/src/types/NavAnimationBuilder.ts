import type { RefObject } from "react";
import type { NavigationTransitionDirection } from "./NavigationTransitionDirection";

export type AnimationWrapperRef = RefObject<HTMLDivElement | null>;
export type AnimationStageCallback =
    | ((
          wrapperRef: AnimationWrapperRef,
          direction: NavigationTransitionDirection | undefined,
      ) => Promise<void>)
    | undefined;

export default interface NavAnimationBuilder {
    route?: {
        wrapperClassName?: string;
        includeDefaultCssClasses: boolean;
        onEnterAnimation: AnimationStageCallback;
        onExitAnimation: AnimationStageCallback;
        onAnimationCleanup: AnimationStageCallback;
    };
}
