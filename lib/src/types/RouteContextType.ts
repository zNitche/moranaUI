import type { RouteLifecycleHookType } from "./RouteLifecycleHookType";

export default interface RouteContextType {
    routeUUID: string;
    registerLifecycleHook: (
        type: RouteLifecycleHookType,
        callback: () => void,
    ) => void;
    isCurrentRoute: boolean;
}
