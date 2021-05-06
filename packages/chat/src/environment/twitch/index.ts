import * as Tmi from "tmi.js";
import { ChatClient, OnMessageCallback } from "..";
import { Action, ActionId, Message, Source } from "../../types";
import { replyMessage } from "./actions";

interface TwitchCredentials {
    username: string;
    token: string;
    channels: string[];
}

export class TwitchClient implements ChatClient {
    private client: Tmi.Client;
    private onMessageCallback: OnMessageCallback;

    // TODO: Call this from Client
    constructor(onMessageCallback: OnMessageCallback) {
        this.client = null;
        this.onMessageCallback = onMessageCallback;
    }

    public async authenticate(
        credentials: TwitchCredentials
    ): Promise<ChatClient> {
        if (!credentials?.token || !credentials?.username) {
            return;
        }
        const { token, username } = credentials;
        try {
            this.client = Tmi.client({
                identity: {
                    username,
                    password: token,
                },
                channels: credentials.channels,
            });
            await this.client.connect();
            return this;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    public listen(): void {
        this.client.on(
            "message",
            async (
                target: string,
                context: Tmi.ChatUserstate,
                msg: string,
                self: boolean
            ) => {
                if (self) {
                    return;
                }
                const message: Message = this.parseMessage(
                    context,
                    target,
                    msg
                );
                const responseAction = await this.onMessageCallback(
                    this,
                    message
                );
                this.execute(target, context, responseAction);
            }
        );
    }

    private execute(
        target: string,
        context: Tmi.ChatUserstate,
        action: Action
    ) {
        switch (action.id) {
            case ActionId.Reply: {
                return replyMessage(
                    this.client,
                    target,
                    context.username,
                    action.body as string
                );
            }
        }
    }

    private parseMessage(
        context: Tmi.ChatUserstate,
        target: string,
        content: string
    ): Message {
        return {
            channelId: target,
            source: Source.Twitch,
            userId: context["user-id"],
            userName: context["username"],
            content: content,
            sentAt: new Date(),
        };
    }
}
