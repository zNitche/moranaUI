import type RouterData from "./RouteData";

export default interface RouterContextType {
    currentRoute: string;
    addRoute: (route: RouterData) => void;
    navigateTo: (url: string) => void;
    navigateBack: () => void;
}
