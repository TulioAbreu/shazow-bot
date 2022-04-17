import { ChatClient, Source } from "chat";
import { UserSettings } from "database/dist/models/user-settings";
import { ExecutableCommand, execute } from ".";

describe("Command", () => {
    describe("it should ignore", () => {
        test("troll commands", async () => {
            const command: ExecutableCommand = {
                name: "teste",
                arguments: [],
                source: Source.Discord,
                message:
                    "!teste 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                userID: "",
                channelId: "",
                serverId: "fakeServerId",
                userName: "",
            };
            const result = await execute({} as ChatClient, {} as UserSettings, command);
            expect(result).toBeUndefined();
        });
    });
});
