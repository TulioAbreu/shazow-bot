import { isEmptyString } from ".";

describe("isEmptyString", () => {
    it("should return false for 'null'", () => {
        expect(isEmptyString(null)).toBeFalsy();
    });

    it("should return false for 'undefined'", () => {
        expect(isEmptyString(null)).toBeFalsy();
    });

    it("should return false for types that are not string", () => {
        expect(isEmptyString((13 as unknown) as string)).toBeFalsy();
        expect(isEmptyString((true as unknown) as string)).toBeFalsy();
        expect(isEmptyString(({} as unknown) as string)).toBeFalsy();
    });

    it("should return false for not string", () => {
        expect(isEmptyString("test")).toBeFalsy();
    });

    it("should return true for empty string", () => {
        expect(isEmptyString("")).toBeTruthy();
    });
});
