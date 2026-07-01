export default interface RouteContextType {
    routeUUID: string;
    registerLifecycleHook: (
        type: "enter" | "exit",
        callback: () => void,
    ) => void;
    isCurrentRoute: boolean;
}
