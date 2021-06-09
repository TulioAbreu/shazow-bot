import * as Tmi from "tmi.js";
import { ChatClient, OnMessageCallback } from "..";
import { Action, ActionId, Maybe, Message, Source } from "../../types";

interface TwitchCredentials {
    username: string;
    token: string;
    channels: string[];
}

export class TwitchClient implements ChatClient {
    private client?: Tmi.Client;
    private onMessageCallback: OnMessageCallback;

    // TODO: Call this from Client
    constructor(onMessageCallback: OnMessageCallback) {
        this.onMessageCallback = onMessageCallback;
    }

    public async authenticate(
        credentials: TwitchCredentials
    ): Promise<Maybe<ChatClient>> {
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
            return this as ChatClient;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    public listen(): void {
        if (!this.client) {
            console.error("ERROR - Authentication is required before listening messages.");
            return;
        }

        const botUsername = this.client.getUsername();
        const internalMessageHandler = async (
            target: string,
            ctx: Tmi.ChatUserstate,
            msg: string,
            sentFromBot: boolean,
        ) => {
            if (sentFromBot) {
                return;
            }
            const message: Message = this.parseMessage(ctx, botUsername, target, msg);
            const response = await this.onMessageCallback(this as ChatClient, message);
            this.execute(target, ctx, response);
        };

        this.client.on("message", internalMessageHandler);
    }

    public async sendMessage(channelId: string, message: string): Promise<void> {
        if (!this.client) {
            return;
        }
        await this.client.say(channelId, message);
    }

    private execute(
        target: string,
        context: Tmi.ChatUserstate,
        action: Maybe<Action>
    ) {
        if (!this.client || !action?.id || !context?.username || !action) {
            return;
        }
        switch (action.id) {
            case ActionId.Reply: return this.replyMessage(
                target,
                context.username,
                action.body ?? "",
            );
        }
    }

    private async replyMessage(target: string, username: string, response: string) {
        if (!this.client || !response) {
            return;
        }
        this.client.say(target, `@${username} ${response}`);
    }

    private parseMessage(
        context: Tmi.ChatUserstate,
        botUsername: string,
        target: string,
        content: string
    ): Message {
        return {
            channelId: target,
            source: Source.Twitch,
            userId: context["user-id"],
            userName: context["username"],
            content: content,
            serverId: target,
            sentAt: new Date(),
            isPing: this.isPingMessage(botUsername, content),
        };
    }

    private isPingMessage(botUsername: string, content: string): boolean {
        return content.includes(`@${botUsername}`);
    }
}
