import { GenericCommand } from "../../models/generic-command";
import { executeGenericCommand } from ".";
import { ExecutableCommand } from "../command";

jest.mock("../../repositories/generic-command", () => ({
    findOne: jest
        .fn()
        .mockReturnValueOnce({
            name: "ping",
            createdAt: new Date(),
            isCacheable: true,
            output: "pong",
        } as GenericCommand)
        .mockReturnValueOnce({
            name: "redirect",
            createdAt: new Date(),
            isCacheable: false,
            output: "redirect to %args0",
        } as GenericCommand)
        .mockReturnValueOnce({
            name: "redirect",
            createdAt: new Date(),
            isCacheable: false,
            output: "redirect from %args0 to %args1",
        } as GenericCommand),
}));

describe("Generic Command", () => {
    it("should execute", async () => {
        const result = await executeGenericCommand({
            name: "ping",
            arguments: [],
        } as ExecutableCommand);
        expect(result.body).toBe("pong");
    });

    it("should execute with one argument", async () => {
        const result = await executeGenericCommand({
            name: "redirect",
            arguments: ["testArg"],
        } as ExecutableCommand);
        expect(result.body).toBe("redirect to testArg");
    });

    it("should execute with multiple arguments", async () => {
        const result = await executeGenericCommand({
            name: "redirect",
            arguments: ["testArgOne", "testArgTwo"],
        } as ExecutableCommand);
        expect(result.body).toBe("redirect from testArgOne to testArgTwo");
    });
});
