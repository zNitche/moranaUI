import { expect, test } from "vitest";
import clsx from "../src/utils/clsx";
import { generateUUID } from "../src/utils/crypto";
import { range } from "../src/utils/range";
import {
    splitPath,
    tokenizeUrl,
    buildUrl,
    matchTokenizedUrl,
} from "../src/utils/url";

test("generate UUID", () => {
    const r = () => {
        generateUUID();
    };

    expect(r).not.toThrow();
});

test("generate combined string for css handling, should omit undefines", () => {
    const s = clsx("testclass", undefined, "test", false, undefined);

    expect(s).toBe("testclass test");
    expect(s).toHaveLength(14);
});

test("test range() utils", () => {
    const s = range(10);

    expect(s).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(s).toHaveLength(10);
});

test("test url utils - splitPath()", () => {
    const s = splitPath("/test/route/123?query=123");

    expect(s).toStrictEqual(["test", "route", "123"]);
    expect(s).toHaveLength(3);
});

test("test url utils - buildUrl()", () => {
    const s = buildUrl("/test/route/123", { query: "123" });

    expect(s).toEqual("/test/route/123?query=123");
});

test("test url utils - tokenizeUrl()", () => {
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

test("test url utils - matchTokenizedUrl()", () => {
    const tokenizedUrl = tokenizeUrl("/test/:val/details?query=123");

    expect(tokenizeUrl).toBeDefined();

    const matchingUrl = matchTokenizedUrl(tokenizedUrl!, "/test/123/details");
    const notMatchingUrl = matchTokenizedUrl(tokenizedUrl!, "/test/details");

    expect(matchingUrl).toStrictEqual({
        isMatching: true,
        pathParams: {
            val: "123",
        },
    });

    expect(notMatchingUrl).toStrictEqual({
        isMatching: false,
        pathParams: undefined,
    });
});
