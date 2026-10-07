export default interface RouteLifecycleCallbacks {
    onEnter?: () => void
    onExit?: () => void
    onMount?: () => void
    onUnmount?: () => void
}
