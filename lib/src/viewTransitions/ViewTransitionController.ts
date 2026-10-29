type TransitionViewState = "inMove" | "active" | "parked";
type ViewTransitionTarget = "in" | "out";

interface ViewTransitionControllerArgs {
    viewElement: HTMLElement;
    partnerViewElement?: HTMLElement;
}

export default class ViewTransitionController {
    private viewElement: HTMLElement;
    private partnerViewElement: HTMLElement | undefined;
    private abortController: AbortController | null = null;

    constructor({
        viewElement,
        partnerViewElement,
    }: ViewTransitionControllerArgs) {
        this.viewElement = viewElement;
        this.partnerViewElement = partnerViewElement;
    }

    private gatherAnimations(): Animation[] {
        const targets: HTMLElement[] = [this.viewElement];

        if (this.partnerViewElement) {
            targets.push(this.partnerViewElement);
        }

        return targets.flatMap((elem) => elem.getAnimations({}));
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

        // move somewhere else, avoid inline
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
        this.abortController?.abort();
        this.abortController = null;

        this.settle(postTarget);
    }

    public start({ target }: { target: ViewTransitionTarget }) {
        this.abortController = new AbortController();
        this.setElementTransitionMetadata({ state: "inMove", target });

        queueMicrotask(() => {
            this.nextTick(target);
        });
    }
}
