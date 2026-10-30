import type { NavigationTransitionDirection } from "#root/types/NavigationTransitionDirection";

type TransitionViewState = "inMove" | "active" | "parked";
type ViewTransitionTarget = "in" | "out";

interface ViewTransitionControllerArgs {
    viewElement: HTMLElement;
}

export default class ViewTransitionController {
    private viewElement: HTMLElement;
    private abortController: AbortController | null = null;

    private onDone?: () => void = undefined;

    constructor({ viewElement }: ViewTransitionControllerArgs) {
        this.viewElement = viewElement;
    }

    private gatherAnimations(element: HTMLElement): Animation[] {
        return element.getAnimations({});
    }

    private setElementTransitionMetadata({
        state,
        target,
        transitionDirection,
    }: {
        state: TransitionViewState;
        target?: ViewTransitionTarget;
        transitionDirection?: NavigationTransitionDirection;
    }) {
        const stateKey = "moranaViewTransitionState";
        const targetKey = "moranaViewTransitionTarget";
        const transitionDirectionKey = "moranaViewTransitionDirection";

        switch (state) {
            case "inMove":
                if (target) {
                    this.viewElement.dataset[targetKey] = target;
                } else {
                    delete this.viewElement.dataset[targetKey];
                }

                this.viewElement.dataset[transitionDirectionKey] =
                    transitionDirection;
                this.viewElement.dataset[stateKey] = state;

                return;

            case "active":
            case "parked":
                this.viewElement.dataset[stateKey] = state;
                delete this.viewElement.dataset[targetKey];
                delete this.viewElement.dataset[transitionDirectionKey];
                return;

            default:
                delete this.viewElement.dataset[transitionDirectionKey];
                delete this.viewElement.dataset[targetKey];
                this.viewElement.dataset[stateKey] = "parked";
                return;
        }
    }

    private settle(target: ViewTransitionTarget) {
        this.setElementTransitionMetadata({
            state: target === "in" ? "active" : "parked",
        });
        this.abortController = null;

        try {
            this.onDone?.();
        } catch (error) {
            console.error(error);
        }

        this.onDone = undefined;
    }

    private nextTick(
        target: ViewTransitionTarget,
        partnerViewElement?: HTMLElement,
    ) {
        if (!this.abortController) {
            this.settle(target);
            return;
        }

        const abortSignal = this.abortController.signal;

        const currentAnimations = this.gatherAnimations(this.viewElement);

        if (partnerViewElement) {
            currentAnimations.push(
                ...this.gatherAnimations(partnerViewElement),
            );
        }

        let animationsCount = currentAnimations.length;

        if (animationsCount === 0) {
            this.settle(target);
            return;
        }

        const onDone = () => {
            animationsCount = animationsCount - 1;

            if (animationsCount <= 0) {
                this.settle(target);
                return;
            }
        };

        for (const animation of currentAnimations) {
            animation.addEventListener("remove", onDone, {
                signal: abortSignal,
            });
            animation.addEventListener("finish", onDone, {
                signal: abortSignal,
            });
        }
    }

    public abort(postTarget: ViewTransitionTarget) {
        if (!this.abortController) {
            return;
        }

        this.abortController.abort();
        this.abortController = null;

        this.settle(postTarget);
    }

    public start({
        target,
        partnerViewElement,
        transitionDirection = "forward",
        onDone,
    }: {
        target: ViewTransitionTarget;
        partnerViewElement?: HTMLElement;
        transitionDirection?: NavigationTransitionDirection;
        onDone?: () => void;
    }) {
        this.abort(target);

        this.abortController = new AbortController();
        this.onDone = onDone;

        this.setElementTransitionMetadata({
            state: "inMove",
            target,
            transitionDirection,
        });

        queueMicrotask(() => {
            this.nextTick(target, partnerViewElement);
        });
    }
}
