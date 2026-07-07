import useRouteContext from "@root/routing/hooks/useRouteContext";

export default function useIsPageActive() {
    const { isCurrentRoute } = useRouteContext();

    return isCurrentRoute
}