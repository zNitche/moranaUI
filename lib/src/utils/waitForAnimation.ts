export default function waitForAnimation(element: HTMLElement, animationName: string) {
    return new Promise<void>((resolve) => {
        const onAnimationCancelled = (event: AnimationEvent) => {
            if (event.target == element) {
                element.removeEventListener("animationcancel", onAnimationCancelled)
                resolve()
            }
        }

        const onAnimationEndCallback = (event: AnimationEvent) => {
            if (event.target !== element) {
                return
            }

            if (event.animationName == animationName) {
                element.removeEventListener("animationend", onAnimationEndCallback)
                resolve()
            }
        }

        element.addEventListener("animationend", onAnimationEndCallback)
        element.addEventListener("animationcancel", onAnimationCancelled)
    })
}