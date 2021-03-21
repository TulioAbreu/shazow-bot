import { Action, ActionId } from "chat";

export default function Ping(): Action {
    return {
        id: ActionId.Reply,
        body: "pong!",
    };
}
