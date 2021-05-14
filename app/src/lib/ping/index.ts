import { Action, createChatReply } from "chat";

export default function Ping(): Action {
    return createChatReply("pong!");
}
