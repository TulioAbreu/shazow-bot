import { Action, Maybe, Message } from "../types";

export type OnMessageCallback = (
    client: ChatClient,
    message: Message
) => Promise<Maybe<Action>>;

export interface ChatClient {
    authenticate(credentials: ChatCredentials): Promise<Maybe<ChatClient>>;
    listen(): void;
}

export interface ChatCredentials {
    username?: string;
    token?: string;
    channels?: string[];
}
