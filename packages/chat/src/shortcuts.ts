import { Action, ActionId } from "./types";

export function createChatReply(body: string): Action {
    return {
        id: ActionId.Reply,
        body,
    };
}
