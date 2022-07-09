import { executeGenericCommand } from ".";
import { ExecutableCommand } from "../command";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import { ActionId, Source } from "chat";

describe("Generic Command", () => {
    it("should execute", async () => {
        jest.spyOn(GenericCommandDb, "findOne").mockImplementationOnce(async () => ({
            name: "ping",
            createdAt: new Date(),
            output: "pong",
            serverId: "fakeServerId",
            source: Source.Discord,
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
        jest.spyOn(GenericCommandDb, "findOne").mockImplementationOnce(async () => ({
            name: "redirect",
            createdAt: new Date(),
            output: "redirect to %args0",
            serverId: "fakeServerId",
            source: Source.Twitch,
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
        jest.spyOn(GenericCommandDb, "findOne").mockImplementationOnce(async () => ({
            name: "redirect",
            createdAt: new Date(),
            output: "redirect from %args0 to %args1",
            serverId: "fakeServerId",
            source: Source.Discord, // TODO: Check why ts-jest can't access enums
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
