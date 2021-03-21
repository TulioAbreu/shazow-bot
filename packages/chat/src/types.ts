export enum Source {
    Discord = 0,
    Twitch = 1,
}

export enum ActionId {
    None = 0,
    Reply = 1,
}

export interface Action {
    id: ActionId;
    body?: string;
}

export interface Message {
    source: Source;
    channelId: string;
    userId: string;
    userName: string;
    content: string;
    sentAt: Date;
}

export enum Event {
    OnMessage = 0,
}

export type OnMessageCallback = (message: Message) => Promise<Action>;

export type Maybe<T> = T | undefined;

export interface ChatEnvironment {
    setOnMessageCallback(onMessageCallback: OnMessageCallback): void;
}
