import { describe, expect, it, test, vi } from "vitest";
import clsx from "../src/utils/clsx";
import { generateUUID } from "../src/utils/crypto";
import { range } from "../src/utils/range";
import {
    splitPath,
    tokenizeUrl,
    buildUrl,
    matchTokenizedUrl,
} from "../src/utils/url";
import clamp from "#root/utils/clamp";
import { sleep } from "#root/utils";

describe("generateUUID()", () => {
    it("does not throw", () => {
        const r = () => {
            generateUUID();
        };

        expect(r).not.toThrow();
    });

    it("generated unique ids", () => {
        const uuids = new Set(range(100).map(() => generateUUID()));
        expect(uuids.size).toBe(100);
    });
});

describe("clsx", () => {
    test("generate combined string for css handling, should omit undefines", () => {
        const EXPECTED = "testclass test";
        const s = clsx("testclass", undefined, "test", false, undefined);

        expect(s).toBe(EXPECTED);
        expect(s).toHaveLength(EXPECTED.length);
    });
});

describe("range()", () => {
    test("test range() utils", () => {
        const s = range(10);

        expect(s).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(s).toHaveLength(10);
    });
});

describe("url utils", () => {
    test("splitPath()", () => {
        const s = splitPath("/test/route/123?query=123");

        expect(s).toStrictEqual(["test", "route", "123"]);
        expect(s).toHaveLength(3);
    });

    test("buildUrl()", () => {
        const s = buildUrl("/test/route/123", { query: "123" });

        expect(s).toEqual("/test/route/123?query=123");
    });

    test("tokenizeUrl()", () => {
        const s = tokenizeUrl("/test/:val/details?query=123");

        expect(s).toStrictEqual([
            {
                isPathParam: false,
                pathParamName: undefined,
                token: "test",
            },
            {
                isPathParam: true,
                pathParamName: "val",
                token: ":val",
            },
            {
                isPathParam: false,
                pathParamName: undefined,
                token: "details",
            },
        ]);
        expect(s).toHaveLength(3);
    });
});

describe("clamp", () => {
    test("test clamp()", () => {
        expect(clamp(101, 0, 100)).toEqual(100);
        expect(clamp(50, 0, 100)).toEqual(50);
        expect(clamp(-2, -2, 100)).toEqual(-2);
    });
});

describe("sleep", () => {
    it("resolved after given time", async () => {
        vi.useFakeTimers()
        const resolved = vi.fn()
        void sleep(125).then(resolved);

        await vi.advanceTimersByTimeAsync(100);

        expect(resolved).not.toHaveBeenCalled();
        
        await vi.advanceTimersByTimeAsync(25);
        expect(resolved).toHaveBeenCalledOnce();
    })
});

describe("matchTokenizedUrl()", () => {
    const matchAlias = (route: string, url: string) => {
        return matchTokenizedUrl(tokenizeUrl(route)!, url);
    };

    it("runs tokenizeUrl()", () => {
        const resultTokens = tokenizeUrl("/test/:val/details?query=123");
        expect(resultTokens).toBeDefined();

        expect(resultTokens).toStrictEqual([
            {
                token: "test",
                pathParamName: undefined,
                isPathParam: false,
            },
            {
                token: ":val",
                pathParamName: "val",
                isPathParam: true,
            },
            {
                token: "details",
                pathParamName: undefined,
                isPathParam: false,
            },
        ]);
    });

    it("matches the same url", () => {
        expect(matchAlias("/", "/")).toEqual({
            isMatching: true,
            pathParams: {},
        });
        expect(matchAlias("/abc", "/abc")).toEqual({
            isMatching: true,
            pathParams: {},
        });
        expect(matchAlias("/a/bb/c", "/a/bb/c")).toEqual({
            isMatching: true,
            pathParams: {},
        });
    });

    it("doesn't match different url", () => {
        expect(matchAlias("/a", "/")).toEqual({
            isMatching: false,
            pathParams: undefined,
        });
        expect(matchAlias("/abc", "/abc/1").isMatching).toBe(false);
        expect(matchAlias("/a/bb/c/2", "/a/bb/c").isMatching).toBe(false);
    });

    it("ignores seach params (query string)", () => {
        expect(matchAlias("/a?tab=home", "/a")).toEqual({
            isMatching: true,
            pathParams: {},
        });
    });

    it("requires path param to be filled before matching", () => {
        expect(matchAlias("/:page/a/", "/home/a/")).toEqual({
            isMatching: true,
            pathParams: { page: "home" },
        });
    });
});
