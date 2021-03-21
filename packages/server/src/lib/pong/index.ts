import { Action, ActionId } from "chat";

export default function Pong(): Action {
    return {
        id: ActionId.Reply,
        body: "ping!",
    };
}
