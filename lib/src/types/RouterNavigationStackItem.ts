import type { NavigationTransitionDirection } from "./NavigationTransitionDirection";

export default interface RouterNavigationStackItem {
    routeUUID: string;
    originDirection?: NavigationTransitionDirection;
}
