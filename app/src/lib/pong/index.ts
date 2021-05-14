import { Action, createChatReply } from "chat";

export default function Pong(): Action {
    return createChatReply("ping!");
}
