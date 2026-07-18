import { describe, it, beforeEach, vi, expect } from "vitest";
import AppRoot from "../mocks/AppRoot.mock";
import { renderHook } from "@testing-library/react";
import { usePathParams } from "@root/routing";

describe("usePathParams() hook", () => {
    beforeEach(() => {
        vi.stubGlobal("location", {
            ...window.location,
            href: `https://127.0.0.1`,
            pathname: `/params/${123}/path/${"test2Param"}`,
        });
    });

    it("get path params", () => {
        const { result } = renderHook(
            () => usePathParams<{ id: string; id2: string }>(),
            {
                wrapper: ({ children }) => {
                    const ChildrenComponent = () => <>{children}</>;

                    return AppRoot({
                        Children: ChildrenComponent,
                        targetRoute: "/params",
                    });
                },
            },
        );

        expect(result.current?.id).toEqual("123");
        expect(result.current?.id2).toEqual("test2Param");
    });

    it("get path params (outside RouterContext)", () => {
        const { result } = renderHook(() =>
            usePathParams<{ id: string; id2: string }>(),
        );

        expect(result.current?.id).toEqual(undefined);
        expect(result.current?.id2).toEqual(undefined);
    });
});
