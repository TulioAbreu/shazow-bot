import { createErrorResult, createResult } from ".";

describe("Result", () => {
    describe("createErrorResult", () => {
        it("should create an error result", () => {
            const result = createErrorResult("test error");
            expect(result.hasValue()).toBeFalsy();
            expect(result.getErrorMessage()).toBe("test error");
        });
    });

    describe("createResult", () => {
        it("should create a result", () => {
            const result = createResult(10);
            expect(result.unwrap()).toBe(10);
            expect(result.hasValue()).toBeTruthy();
            expect(result.getErrorMessage()).toBeFalsy();
        });
    });
});
