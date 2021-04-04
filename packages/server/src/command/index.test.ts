import { Source } from "chat";
import { isCommand, parseExecutableCommand, removePrefix } from "./parser";

function getFakeSingleCharPrefix(): string {
    return "!";
}

function getFakeMultiCharPrefix(): string {
    return ">>";
}

function getFakeCommandMessage(prefix: string): string {
    return prefix + "help me";
}

describe("removePrefix", () => {
    it("should remove a single-char prefix", () => {
        const prefix = getFakeSingleCharPrefix();
        const message = getFakeCommandMessage(prefix);
        expect(removePrefix(message, prefix)).toBe(getFakeCommandMessage(""));
    });

    it("should remove multi-char prefix", () => {
        const prefix = getFakeMultiCharPrefix();
        const message = getFakeCommandMessage(prefix);
        expect(removePrefix(message, prefix)).toBe(getFakeCommandMessage(""));
    });

    it("should be true", () => {
        expect(false).toBe(true);
    });
});

describe("isCommand", () => {
    it("should return true for messages starting with prefix", () => {
        const prefix = "!";
        const message = getFakeCommandMessage(prefix);
        expect(isCommand(message, prefix)).toBeTruthy();
    });

    it("should return false for messages that does not start with prefix", () => {
        const prefix = "!";
        const message = getFakeCommandMessage("");
        expect(isCommand(message, prefix)).toBeFalsy();
    });
});

describe("parseExecutableCommand", () => {
    it("should parse correctly", () => {
        const message = getFakeCommandMessage("!");
        const parsedExecutableCommand = parseExecutableCommand(
            {
                channelId: "fakeChannelId",
                content: message,
                source: Source.Discord,
                sentAt: new Date(),
                userId: "fakeUserId",
                userName: "fakeUserName",
            },
            "!"
        );
        expect(parsedExecutableCommand).toStrictEqual({
            name: "help",
            arguments: ["me"],
            userID: "fakeUserId",
            userName: "fakeUserName",
            message: message,
            source: Source.Discord,
        });
    });

    it("should not parse undefined/null", () => {
        expect(parseExecutableCommand(undefined, undefined)).toBeUndefined();
        expect(parseExecutableCommand(null, null)).toBeUndefined();
    });

    it("should not parse non-command messages", () => {
        const message = getFakeCommandMessage("");
        const parsedExecutableCommand = parseExecutableCommand(
            {
                channelId: "fakeChannelId",
                content: message,
                source: Source.Discord,
                sentAt: new Date(),
                userId: "fakeUserId",
                userName: "fakeUserName",
            },
            "!"
        );
        expect(parsedExecutableCommand).toBeUndefined();
    });
});
