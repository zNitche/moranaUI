import type RouteUrlToken from "./RouteUrlToken";

export default interface RouteData {
    uuid: string;
    url: string;
    tokenizedUrl?: RouteUrlToken[];
    component: React.ComponentType;
}
