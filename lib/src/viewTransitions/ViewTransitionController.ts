type TransitionViewState = "inMove" | "active" | "parked";
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
        state,
        target,
    }: {
        state: TransitionViewState;
        target?: ViewTransitionTarget;
    }) {
        const stateKey = "moranaViewTransitionState";
        const targetKey = "moranaViewTransitionTarget";

        switch (state) {
            case "inMove":
                if (target) {
                    this.viewElement.dataset[targetKey] = target;
                } else {
                    delete this.viewElement.dataset[targetKey];
                }

                this.viewElement.dataset[stateKey] = state;

                return;

            case "active":
            case "parked":
                this.viewElement.dataset[stateKey] = state;
                delete this.viewElement.dataset[targetKey];
                return;

            default:
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
        this.setElementTransitionMetadata({ state: "inMove", target });

        queueMicrotask(() => {
            this.nextTick(target);
        });
    }
}
