import type RouterData from "./RouteData";
import type Router from "./Router";

export default interface RouterContextType {
    router: Router;
    addRoute: (route: RouterData) => void;
    navigateTo: (url: string) => void;
    navigateBack: () => void;
}
