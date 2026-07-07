import type { NavigationTransitionDirection } from "./NavigationTransitionDirection";

export default interface NavigationTransitionDetails {
    detected: boolean;
    isCurrentlyEntering: boolean;
    isCurrentlyExiting: boolean;
    direction?: NavigationTransitionDirection;
}
