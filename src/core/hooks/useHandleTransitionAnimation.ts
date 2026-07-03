import type { AnimationStageCallback } from "@root/types/NavAnimationBuilder";
import type NavigationTransitionDetails from "@root/types/NavigationTransitionDetails";
import { useCallback, type RefObject } from "react";

export default function useHandleTransitionAnimation() {
    const handleTransitionAnimation = useCallback(
        async ({
            transitionDetails,
            wrapperRef,
            onEnterAnimation,
            onExitAnimation,
            onAnimationCleanup,
        }: {
            transitionDetails: NavigationTransitionDetails;
            wrapperRef: RefObject<HTMLDivElement | null>;
            onEnterAnimation: AnimationStageCallback;
            onExitAnimation: AnimationStageCallback;
            onAnimationCleanup: AnimationStageCallback;
        }) => {
            if (!transitionDetails.detected) {
                return;
            }

            if (transitionDetails.isCurrentlyEntering) {
                await onEnterAnimation?.(wrapperRef);
            } else {
                await onExitAnimation?.(wrapperRef);
            }

            await onAnimationCleanup?.(wrapperRef);
        },
        [],
    );

    return { handleTransitionAnimation };
}
