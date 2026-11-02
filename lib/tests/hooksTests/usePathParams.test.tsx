import { describe, it, beforeEach, vi, expect } from "vitest";
import AppCustomizableRoot from "../mocks/AppCustomizableRoot.mock";
import { renderHook } from "@testing-library/react";
import { usePathParams } from "#root/routing";

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

                    return AppCustomizableRoot({
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
        expect(() =>
            renderHook(() => usePathParams<{ id: string; id2: string }>()),
        ).toThrow("usePathParams can't be called outside Router's context");
    });
});
