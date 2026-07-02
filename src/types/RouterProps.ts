import type RouterCurrentRoute from "./RouterCurrentRoute";

export default interface RouterProps {
    currentRoute?: RouterCurrentRoute;
    path: string;
    search?: string;
    navigationStack: string[];
}
