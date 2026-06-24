import type RouteData from "./RouteData";
import type Router from "./Router";

export default interface RouterContextType {
    router: Router;
    __addRoute: (route: RouteData) => void;
    navigateTo: (url: string) => void;
    navigateBack: () => void;
}
