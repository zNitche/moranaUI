import { describe, it, beforeEach, vi, expect } from "vitest";
import AppRoot from "../mocks/AppRoot.mock";
import { renderHook } from "@testing-library/react";
import { useRouter } from "@root/routing";

describe("useRouter() hook", () => {
    beforeEach(() => {
        vi.stubGlobal("location", {
            ...window.location,
            href: `https://127.0.0.1`,
            pathname: `/home`,
        });
    });

    it("test router context", () => {
        const { result } = renderHook(
            () => useRouter(),
            {
                wrapper: ({ children }) => {
                    const ChildrenComponent = () => <>{children}</>;

                    return AppRoot({
                        Children: ChildrenComponent,
                        targetRoute: "/home",
                    });
                },
            },
        );

        const router = result.current.router;

        expect(router.path).toEqual("/home");
    });

    it("test router context (outside RouterContext)", () => {
        const { result } = renderHook(() =>
            useRouter(),
        );

        expect(result.current?.router.path).toEqual("");
    });
});
