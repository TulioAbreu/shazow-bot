import { ActionId } from "chat";
import Ping from ".";

describe("Ping Command", () => {
    test("should return a pong", () => {
        const response = Ping();
        expect(response.id).toBe(ActionId.Reply);
        expect(response.body).toBe("pong!");
    });
});
