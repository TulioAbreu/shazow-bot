import { executeGenericCommand } from ".";
import { ExecutableCommand } from "../command";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import { ActionId } from "chat";

describe("Generic Command", () => {
    it("should execute", async () => {
        jest.spyOn(GenericCommandDb, "findOne")
            .mockImplementationOnce(async () => ({
                name: "ping",
                createdAt: new Date(),
                isCacheable: true,
                output: "pong",
            }));

        const command: Partial<ExecutableCommand> = {
            name: "ping",
            arguments: [],
        };
        const result = await executeGenericCommand(command as ExecutableCommand);
        expect(result).toBeDefined();
        expect(result?.id).toBe(ActionId.Reply);
        expect(result?.body).toBe("pong");
    });

    it("should execute with one argument", async () => {
        jest.spyOn(GenericCommandDb, "findOne")
            .mockImplementationOnce(async () => ({
                name: "redirect",
                createdAt: new Date(),
                isCacheable: false,
                output: "redirect to %args0",
            }));

        const command: Partial<ExecutableCommand> = {
            name: "redirect",
            arguments: ["testArg"],
        };
        const result = await executeGenericCommand(command as ExecutableCommand);
        expect(result).toBeDefined();
        expect(result?.id).toBe(ActionId.Reply);
        expect(result?.body).toBe("redirect to testArg");
    });

    it("should execute with multiple arguments", async () => {
        jest.spyOn(GenericCommandDb, "findOne")
            .mockImplementationOnce(async () => ({
                name: "redirect",
                createdAt: new Date(),
                isCacheable: false,
                output: "redirect from %args0 to %args1",
            }));

        const command: Partial<ExecutableCommand> = {
            name: "redirect",
            arguments: ["testArgOne", "testArgTwo"],
        };
        const result = await executeGenericCommand(command as ExecutableCommand);
        expect(result).toBeDefined();
        expect(result?.id).toBe(ActionId.Reply);
        expect(result?.body).toBe("redirect from testArgOne to testArgTwo");
    });
});
