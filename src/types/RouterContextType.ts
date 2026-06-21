import type RouterData from "./RouteData";

export default interface RouterContextType {
    addRoute: (route: RouterData) => void;
    path: string;
    navigateTo: (url: string) => void;
}
