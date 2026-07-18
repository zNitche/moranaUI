import useSearchParams from "@root/routing/hooks/useSearchParams";
import { describe, it, beforeEach, vi, expect } from "vitest";
import AppRoot from "../mocks/AppRoot.mock";
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
                wrapper: ({ children }) => AppRoot(children),
            },
        );

        expect(result.current?.qparam).toEqual("testv");
    });
});
