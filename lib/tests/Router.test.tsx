import { useRouter } from "#root/routing";
import { sleep } from "#root/utils";
import { act, cleanup, render, screen } from "@testing-library/react";
import AppRootMock from "./mocks/AppRoot.mock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let routerHook: ReturnType<typeof useRouter> | undefined;
// let routerContext: RouterContextType | undefined;

function RouterPlugin() {
    // eslint-disable-next-line react-hooks/globals
    routerHook = useRouter();
    // eslint-disable-next-line react-hooks/globals
    // routerContext = useRouterContext();

    return null;
}

async function navigateTo(path: string, args: Record<string, unknown> = {}) {
    act(() => {
        routerHook?.navigateTo({ path, ...args });
    });

    await flush();
}

async function flush() {
    await act(async () => await sleep(0));
}

function renderApp(initialUrl: string) {
    window.history.replaceState({}, "", initialUrl);

    return render(<AppRootMock plugins={[RouterPlugin]} />);
}

function run_cleanup() {
    routerHook = undefined;
    // routerContext = undefined;

    cleanup();
}

beforeEach(() => {
    window.history.replaceState({}, "", "/");
});

afterEach(() => {
    run_cleanup();
});

describe("router - routes", () => {
    it("renders route matching the url", async () => {
        renderApp("/home");
        await flush();

        expect(screen.queryByTestId("init-page")).toBeNull();
        expect(screen.getByTestId("home-page")).toBeTruthy();
    });

    it("exposes current route data", async () => {
        renderApp("/home");
        await flush();

        expect(routerHook?.router.path).toEqual("/home");
        expect(routerHook?.router.currentRoute?.uuid).toEqual(
            routerHook?.getRouteUUIDByName("home"),
        );
    });

    it("falls back to catch call route", async () => {
        renderApp("/non-existent");
        await flush();

        expect(screen.getByTestId("not-found-page")).toBeTruthy();
    });
});

describe("router - navigation", () => {
    it("navigates between routes", async () => {
        renderApp("/home");
        await flush();

        expect(screen.getByTestId("home-page")).toBeTruthy();
        expect(routerHook?.router.currentRoute?.uuid).toEqual(
            routerHook?.getRouteUUIDByName("home"),
        );

        await navigateTo("/");

        expect(screen.getByTestId("init-page")).toBeTruthy();
        expect(routerHook?.router.currentRoute?.uuid).toEqual(
            routerHook?.getRouteUUIDByName("init"),
        );
    });
});
