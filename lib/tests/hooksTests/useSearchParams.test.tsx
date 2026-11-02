import useSearchParams from "#root/routing/hooks/useSearchParams";
import { describe, it, beforeEach, vi, expect } from "vitest";
import AppCustomizableRoot from "../mocks/AppCustomizableRoot.mock";
import { renderHook } from "@testing-library/react";

describe("useSearchParams() hook", () => {
    beforeEach(() => {
        vi.stubGlobal("location", {
            ...window.location,
            href: "https://127.0.0.1",
            search: "?qparam=testv",
        });
    });

    it("get search params", () => {
        const { result } = renderHook(
            () => useSearchParams<{ qparam: string }>(),
            {
                wrapper: ({ children }) => {
                    const ChildrenComponent = () => <>{children}</>;

                    return AppCustomizableRoot({
                        Children: ChildrenComponent,
                        targetRoute: "/",
                    });
                },
            },
        );

        expect(result.current?.qparam).toEqual("testv");
    });

    it("get search params (outside RouterContext)", () => {
        expect(() => {
            renderHook(() => useSearchParams<{ qparam: string }>());
        }).toThrow("useRouterContext can't be called outside Router's context");
    });
});
