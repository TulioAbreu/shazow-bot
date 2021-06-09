import { ExecutableCommand } from "../../services/command";
import Random from ".";
import { ActionId, ChatClient } from "chat";

describe("Random", () => {
    describe("with defined interval", () => {
        test("should return 4", () => {
            jest.spyOn(Math, "random").mockReturnValueOnce(0);
            const command: Partial<ExecutableCommand> = {
                name: "random",
                arguments: ["4", "10"],
            };
            const result = Random({} as ChatClient, command as ExecutableCommand);
            expect(result.id).toBe(ActionId.Reply);
            expect(result.body).toBe("4");
        });

        test("should return 10", () => {
            jest.spyOn(Math, "random").mockReturnValueOnce(1);
            const command: Partial<ExecutableCommand> = {
                name: "random",
                arguments: ["4", "10"],
            };
            const result = Random({} as ChatClient, command as ExecutableCommand);
            expect(result.id).toBe(ActionId.Reply);
            expect(result.body).toBe("10");
        });
    });

    describe("with default interval", () => {
        test("should return 0", () => {
            jest.spyOn(Math, "random").mockReturnValueOnce(0);
            const command: Partial<ExecutableCommand> = {
                name: "random",
                arguments: [],
            };
            const result = Random({} as ChatClient, command as ExecutableCommand);
            expect(result.id).toBe(ActionId.Reply);
            expect(result.body).toBe("0");
        });

        test("should return 1000", () => {
            jest.spyOn(Math, "random").mockReturnValueOnce(1);
            const command: Partial<ExecutableCommand> = {
                name: "random",
                arguments: [],
            };
            const result = Random({} as ChatClient, command as ExecutableCommand);
            expect(result.id).toBe(ActionId.Reply);
            expect(result.body).toBe("1000");
        });
    });

    describe("ignores NaN arguments", () => {
        test("should return 0", () => {
            jest.spyOn(Math, "random").mockReturnValueOnce(0);
            const command: Partial<ExecutableCommand> = {
                name: "random",
                arguments: ["not", "number"],
            };
            const result = Random({} as ChatClient, command as ExecutableCommand);
            expect(result.id).toBe(ActionId.Reply);
            expect(result.body).toBe("0");
        });

        test("should return 1000", () => {
            jest.spyOn(Math, "random").mockReturnValueOnce(1);
            const command: Partial<ExecutableCommand> = {
                name: "random",
                arguments: ["not", "number"],
            };
            const result = Random({} as ChatClient, command as ExecutableCommand);
            expect(result.id).toBe(ActionId.Reply);
            expect(result.body).toBe("1000");
        });
    });
});
