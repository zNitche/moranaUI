import type { NavigationTransitionDirection } from "./NavigationTransitionDirection";

export default interface RouterNavigationStackItem {
    routeUUID: string;
    previousRouteUUID?: string;
    originDirection?: NavigationTransitionDirection;
}
