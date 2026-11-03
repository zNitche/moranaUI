import { useRouter } from "#root/routing";
import { act, cleanup, render, screen } from "@testing-library/react";
import AppRootMock from "./mocks/AppRoot.mock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type RouterContextType from "#root/types/RouterContextType";

let routerHook: ReturnType<typeof useRouter> | undefined;

function RouterPlugin() {
    // eslint-disable-next-line react-hooks/globals
    routerHook = useRouter();

    return null;
}

function navigateTo(
    path: string,
    args: Omit<Parameters<RouterContextType["navigateTo"]>[0], "path"> = {},
) {
    act(() => {
        routerHook?.navigateTo({ path, ...args });
    });
}

function renderApp(initialUrl: string) {
    window.history.replaceState({}, "", initialUrl);

    return render(<AppRootMock plugins={[RouterPlugin]} />);
}

function run_cleanup() {
    routerHook = undefined;
    cleanup();
}

function expect_is_current_page(url: string, name: string) {
    expect(window.location.pathname).toEqual(url);

    expect(routerHook?.router.path).toEqual(url);
    expect(routerHook?.router.currentRoute?.uuid).toEqual(
        routerHook?.getRouteUUIDByName(name),
    );
}

function expect_is_current_page_in_display(
    testId: string,
    url: string,
    name: string,
) {
    expect(screen.getByTestId(testId)).toBeTruthy();
    expect_is_current_page(url, name);
}

beforeEach(() => {
    window.history.replaceState({}, "", "/");
});

afterEach(() => {
    run_cleanup();
});

describe("router - routes", () => {
    it("renders route matching the url", () => {
        renderApp("/home");

        expect(screen.queryByTestId("init-page")).toBeNull();
        expect(screen.getByTestId("home-page")).toBeTruthy();
    });

    it("exposes current route data", () => {
        renderApp("/home");

        expect_is_current_page("/home", "home");
    });

    it("falls back to catch call route", () => {
        renderApp("/non-existent");

        expect(screen.getByTestId("not-found-page")).toBeTruthy();
    });
});

describe("router - navigation", () => {
    it("navigates between routes", () => {
        renderApp("/home");

        const historyLen = window.history.length;

        expect_is_current_page_in_display("home-page", "/home", "home");
        navigateTo("/");

        expect(window.history.length).toBe(historyLen + 1);
        expect_is_current_page_in_display("init-page", "/", "init");
    });

    it("don't navigate to current route", () => {
        renderApp("/home");

        const historyLen = window.history.length;
        navigateTo("/home");

        expect(window.history.length).toBe(historyLen);
        expect_is_current_page_in_display("home-page", "/home", "home");
    });

    it("navitateTo doesn't add new history entry while 'replace' param is in use", () => {
        renderApp("/home");

        const historyLen = window.history.length;
        navigateTo("/home", { replace: true });

        expect(window.history.length).toBe(historyLen);
        expect_is_current_page_in_display("home-page", "/home", "home");
    });

    it("navigation can be chained", () => {
        renderApp("/home");

        navigateTo("/");
        navigateTo("/home");

        expect(window.history.length).toBe(4);
        expect_is_current_page_in_display("home-page", "/home", "home");
    });
});
