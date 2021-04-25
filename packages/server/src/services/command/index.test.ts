import { Source } from "chat";
import { ExecutableCommand, execute } from ".";

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
            const result = await execute(command);
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
            const result = await execute(command);
            expect(result).toBeUndefined();
        });
    });
});
