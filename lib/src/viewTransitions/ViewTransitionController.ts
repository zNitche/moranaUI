type ViewTransitionStage = "inProgress" | "done";
type TransitionViewState = "active" | "parked";
type ViewTransitionTarget = "in" | "out";

interface ViewTransitionControllerArgs {
    viewRef: HTMLDivElement;
}

export default class ViewTransitionController {
    private viewElement: HTMLDivElement;
    private abortController: AbortController | null = null;

    constructor({ viewRef }: ViewTransitionControllerArgs) {
        this.viewElement = viewRef;
    }

    private gatherAnimations(): Animation[] {
        return this.viewElement.getAnimations({});
    }

    private cancelAnimations() {
        for (const animation of this.gatherAnimations()) {
            animation.cancel();
        }
    }

    private setElementTransitionMetadata({
        stage,
        state,
        target,
    }: {
        stage?: ViewTransitionStage;
        target?: ViewTransitionTarget;
        state?: TransitionViewState;
    }) {
        if (!stage) {
            delete this.viewElement.dataset.moranaViewTransitionStage;
        } else {
            this.viewElement.dataset.moranaViewTransitionStage = stage;
        }

        if (!state) {
            delete this.viewElement.dataset.moranaViewTransitionState;
        } else {
            this.viewElement.dataset.moranaViewTransitionState = state;
        }

        if (!target) {
            delete this.viewElement.dataset.moranaViewTransitionTarget;
        } else {
            this.viewElement.dataset.moranaViewTransitionTarget = target;
        }
    }

    private settle(target: ViewTransitionTarget) {
        this.setElementTransitionMetadata({
            state: target === "in" ? "active" : "parked",
            stage: "done",
        });
        this.abortController = null;
    }

    private nextTick(target: ViewTransitionTarget) {
        if (!this.abortController) {
            return;
        }

        const abortSignal = this.abortController.signal;

        const currentAnimations = this.gatherAnimations();
        let animationsCount = currentAnimations.length;

        if (animationsCount === 0) {
            this.settle(target);
            return;
        }

        const onDone = () => {
            animationsCount--;

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

    public start({ target }: { target: ViewTransitionTarget }) {
        this.cancelAnimations();

        this.abortController = new AbortController();
        this.setElementTransitionMetadata({ stage: "inProgress", target });

        queueMicrotask(() => {
            this.nextTick(target);
        });
    }
}
