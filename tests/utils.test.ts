import { expect, test } from "vitest";
import { clsx, generateUUID, range } from "../src/utils";

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
