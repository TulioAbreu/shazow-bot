import { ChatClient, Source } from "chat";
import { UserSettings } from "database/dist/models/user-settings";
import { ExecutableCommand, execute } from ".";

function getFakeClient(): ChatClient {
    return {} as unknown as ChatClient;
}

function getFakeUserSettings(): UserSettings {
    return {} as unknown as UserSettings;
}

describe("Command", () => {
    describe("it should ignore", () => {
        test("empty commands", async () => {
            const command: ExecutableCommand = {
                name: "",
                arguments: [],
                source: Source.Discord,
                userID: "",
                userName: "",
                message: "",
            };
            const result = await execute(getFakeClient(), getFakeUserSettings(), command);
            expect(result).toBeUndefined();
        });

        test("troll commands", async () => {
            const command: ExecutableCommand = {
                name: "teste",
                arguments: [],
                source: Source.Discord,
                message:
                    "!teste 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                userID: "",
                userName: "",
            };
            const result = await execute(getFakeClient(), getFakeUserSettings(), command);
            expect(result).toBeUndefined();
        });
    });
});
