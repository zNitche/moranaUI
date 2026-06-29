import type NavigationState from "./NavigationState";
import type RouterCurrentRoute from "./RouterCurrentRoute";

export default interface RouterProps {
    currentRoute?: RouterCurrentRoute;
    path: string;
    search?: string;
    navigationState?: NavigationState;
}
