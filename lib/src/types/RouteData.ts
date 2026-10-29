import type { RefObject } from "react";
import type RouteUrlToken from "./RouteUrlToken";

export default interface RouteData {
    uuid: string;
    name?: string;
    url: string;
    tokenizedUrl?: RouteUrlToken[];
    component: React.ComponentType;
    wrapperElementRef: RefObject<HTMLElement | null>;
}
