import { ActionId, Source } from "chat";
import Random from ".";
import { getFakeExecutableCommand } from "../../controllers/mocks";

describe("Random Command", () => {
    test("should return the same number", () => {
        const NUMBER = "1";
        const response = Random(
            getFakeExecutableCommand("random 1 1", Source.Discord)
        );
        expect(response.id).toBe(ActionId.Reply);
        expect(response.body).toBe(NUMBER);
    });
});
