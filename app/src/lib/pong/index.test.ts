import { ActionId } from "chat";
import Ping from ".";

describe("Pong Command", () => {
    test("should return a ping", () => {
        const response = Ping();
        expect(response.id).toBe(ActionId.Reply);
        expect(response.body).toBe("ping!");
    });
});
