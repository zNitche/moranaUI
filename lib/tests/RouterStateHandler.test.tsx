import RouterStateHandler from "#root/routing/RouterStateHandler";
import type { RefObject } from "react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

describe("RouterStateHandler", () => {
    let stateHandler: RouterStateHandler;

    const subscribe_to_handler = (): Mock => {
        const listener = vi.fn();
        stateHandler.subscribeTo(listener);

        return listener;
    };

    beforeEach(() => {
        stateHandler = new RouterStateHandler({ maxStackItems: 3 });
    });

    it("inits empty", () => {
        expect(stateHandler.routerState).toEqual({
            routerCache: {},
            navigationStack: [],
        });
    });

    it("produces new state object on every update", () => {
        stateHandler.setNavigationStack([
            {
                routeUUID: "test1",
            },
            {
                routeUUID: "test2",
            },
        ]);

        const baseline = stateHandler.routerState;
        expect(stateHandler.routerState).toBe(baseline);

        stateHandler.updateNavigationStack("test3");
        expect(Object.is(stateHandler.routerState, baseline)).toBe(false);
    });

    describe("notifications", () => {
        it("notifies its listeners on state change", () => {
            const listener = subscribe_to_handler();
            expect(listener).toHaveBeenCalledTimes(0);

            stateHandler.updateNavigationStack("item");

            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe("navigation stack", () => {
        it("adds to stack", () => {
            stateHandler.updateNavigationStack("route1");
            expect(stateHandler.routerState.navigationStack).toEqual([
                {
                    originDirection: "forward",
                    previousRouteUUID: undefined,
                    routeUUID: "route1",
                },
            ]);
        });

        it("updates whole stack", () => {
            const mock = [{ routeUUID: "route1" }, { routeUUID: "route2" }];

            stateHandler.setNavigationStack([...mock]);
            expect(stateHandler.routerState.navigationStack).toEqual([
                {
                    routeUUID: "route1",
                },
                {
                    routeUUID: "route2",
                },
            ]);
        });

        it("drops oldest when stack size is exceeded", () => {
            for (const uuid of ["a", "b", "c", "d"]) {
                stateHandler.updateNavigationStack(uuid);
            }

            expect(
                stateHandler.routerState.navigationStack.map(
                    (i) => i.routeUUID,
                ),
            ).toEqual(["b", "c", "d"]);
        });

        it("keeps previous route uuid reference", () => {
            for (const uuid of ["a", "b", "c"]) {
                stateHandler.updateNavigationStack(uuid);
            }

            expect(stateHandler.routerState.navigationStack[1]).toMatchObject({
                routeUUID: "b",
                previousRouteUUID: "a",
            });
        });
    });

    describe("router cache", () => {
        const mockRef: RefObject<HTMLElement | null> = { current: null };

        it("adds to router's cache", () => {
            stateHandler.addToRouterCache("123", mockRef);
            expect(stateHandler.routerState.routerCache["123"]).toEqual({
                ref: mockRef,
            });
        });

        it("ignores already added route", () => {
            const listener = subscribe_to_handler();

            stateHandler.addToRouterCache("1", mockRef);
            expect(listener).toHaveBeenCalledTimes(1);

            stateHandler.addToRouterCache("2", mockRef);
            expect(listener).toHaveBeenCalledTimes(2);
            stateHandler.addToRouterCache("2", mockRef);
            expect(listener).toHaveBeenCalledTimes(2);

            expect(
                Object.keys(stateHandler.routerState.routerCache).length,
            ).toEqual(2);
        });

        it("marks route as ready for removal", () => {
            stateHandler.addToRouterCache("123", mockRef);
            stateHandler.markRouteAsRemovableFromCache("123");

            expect(stateHandler.routerState.routerCache["123"]).toEqual({
                ref: mockRef,
                markedForRemoval: true,
            });
        });

        it("ignores non cached route marking as ready for removal", () => {
            const listener = subscribe_to_handler();

            stateHandler.addToRouterCache("123", mockRef);
            expect(listener).toHaveBeenCalledTimes(1);

            stateHandler.markRouteAsRemovableFromCache("missing");
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it("ignores removing non cached route", () => {
            const listener = subscribe_to_handler();

            stateHandler.addToRouterCache("123", mockRef);
            expect(listener).toHaveBeenCalledTimes(1);

            stateHandler.removeFromRouterCache("missing");
            expect(listener).toHaveBeenCalledTimes(1);

            expect(stateHandler.routerState.routerCache).toEqual({
                "123": {
                    ref: mockRef,
                },
            });
        });

        it("clears itself", () => {
            stateHandler.addToRouterCache("123", mockRef);
            expect(stateHandler.routerState.routerCache).toEqual({
                "123": {
                    ref: mockRef,
                },
            });

            stateHandler.clearRouterCache();

            expect(stateHandler.routerState.routerCache).toEqual({});
        });
    });
});
