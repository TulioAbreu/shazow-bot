import { Message, Source } from "chat";
import { parseExecutableCommand } from "./parser";

describe("parseExecutableCommnad", () => {
    describe("should ignore", () => {
        test("undefined messages", () => {
            const message: Message = undefined;
            const command = parseExecutableCommand(message, "!");
            expect(command).toBeUndefined();
        });

        test("messages without prefix", () => {
            const message = {
                content: "test",
            } as Message;
            const command = parseExecutableCommand(message, "!");
            expect(command).toBeUndefined();
        });
    });

    describe("should parse", () => {
        test("simple command", () => {
            const date = new Date();
            const message: Message = {
                channelId: "000000000000000000",
                content: "!test",
                sentAt: date,
                source: Source.Discord,
                userId: "000000000000000000",
                userName: "fakeUserName",
            };
            const command = parseExecutableCommand(message, "!");
            expect(command.name).toBe("test");
            expect(command.message).toBe("!test");
            expect(command.source).toBe(Source.Discord);
            expect(command.arguments).toStrictEqual([]);
            expect(command.userID).toBe("000000000000000000");
        });

        test("command with arguments", () => {
            const date = new Date();
            const message: Message = {
                channelId: "000000000000000000",
                content: "!test argument_1 argument_2",
                sentAt: date,
                source: Source.Discord,
                userId: "000000000000000000",
                userName: "fakeUserName",
            };
            const command = parseExecutableCommand(message, "!");
            expect(command.name).toBe("test");
            expect(command.message).toBe("!test argument_1 argument_2");
            expect(command.source).toBe(Source.Discord);
            expect(command.arguments).toStrictEqual([
                "argument_1",
                "argument_2",
            ]);
            expect(command.userID).toBe("000000000000000000");
        });
    });
});
