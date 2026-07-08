import type { NavigationTransitionDirection } from "./NavigationTransitionDirection";

export interface RouterPath {
    path: string;
    search?: string;
    originDirection?: NavigationTransitionDirection;
}
