import { asArray } from ".";

describe("asArray", () => {
    it("should ignore input", () => {
        const result = asArray<string>(["a", "b"]);
        expect(result).toStrictEqual(["a", "b"]);
    });

    it("should parse to array", () => {
        const result = asArray<string>("a");
        expect(result).toStrictEqual(["a"]);
    });
});
