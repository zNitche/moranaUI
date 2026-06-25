import type RouteData from "./RouteData";
import type RouterProps from "./RouterProps";

export default interface RouterContextType {
    router: RouterProps;
    __addRoute: (route: RouteData) => void;
    navigateTo: (url: string, replace: boolean ) => void;
    navigateBack: () => void;
}
