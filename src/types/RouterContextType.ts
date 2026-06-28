import type RouteData from "./RouteData";
import type { RouterCache } from "./RouterCache";
import type RouterProps from "./RouterProps";

export default interface RouterContextType {
    router: RouterProps;
    __addRoute: (route: RouteData) => void;
    routerCache: RouterCache;
    __addToRouterCache: (uuid: string) => void;
    clearRouterCache: () => void;
    navigateTo: (url: string, replace: boolean) => void;
    navigateBack: () => void;
}
