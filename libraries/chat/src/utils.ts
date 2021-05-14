import { Action, ActionId } from "./types";

export async function getDummyCallback(): Promise<Action> {
    return {
        id: ActionId.None,
    };
}
