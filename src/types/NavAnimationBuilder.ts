export default interface NavAnimationBuilder {
    duration?: number;
    wrapperClassName?: string;
    enterAnimation?: string;
    exitAnimation?: string;
    animateWholePageOverride?: boolean;
}