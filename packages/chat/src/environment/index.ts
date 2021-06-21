import { Action, Maybe, Message } from "../types";

export type OnMessageCallback = (client: ChatClient, message: Message) => Promise<Maybe<Action>>;

export enum ChatClientID {
    Twitch = "twitch",
    Discord = "discord",
}

export interface ChatClient {
    getID(): ChatClientID;
    authenticate(credentials: ChatCredentials): Promise<Maybe<ChatClient>>;
    listen(): void;
    sendMessage(id: string, messageContent: string): void;
    stop(): Promise<void>;
}

export type ChatCredentials = {
    username?: string;
    token?: string;
    channels?: string[];
}
