import type RouterCurrentRoute from "./RouterCurrentRoute";
import type RouterNavigationStackItem from "./RouterNavigationStackItem";

export default interface RouterProps {
    currentRoute?: RouterCurrentRoute;
    path: string;
    search?: string;
    navigationStack: RouterNavigationStackItem[];
}
