import { Action, Message } from "../types";

export type OnMessageCallback = (client: ChatClient, message: Message) => Promise<Action>;

export interface ChatClient {
    authenticate(credentials: ChatCredentials): Promise<ChatClient>;
    listen(): void;
}

export interface ChatCredentials {
    username?: string;
    token?: string;
    channels?: string[];
}
