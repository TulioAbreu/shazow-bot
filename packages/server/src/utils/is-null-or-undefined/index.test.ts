import { isNullOrUndefined } from ".";

describe("isNullOrUndefined", () => {
    it("should return true for undefined", () => {
        expect(isNullOrUndefined(undefined)).toBeTruthy();
    });

    it("should return true for null", () => {
        expect(isNullOrUndefined(null)).toBeTruthy();
    });

    it("should return false for not null/undefined values", () => {
        expect(isNullOrUndefined(10)).toBeFalsy();
        expect(isNullOrUndefined("")).toBeFalsy();
        expect(isNullOrUndefined(false)).toBeFalsy();
        expect(isNullOrUndefined(true)).toBeFalsy();
        expect(isNullOrUndefined([])).toBeFalsy();
        expect(isNullOrUndefined({})).toBeFalsy();
    });
});
