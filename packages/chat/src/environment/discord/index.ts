import * as DiscordJs from "discord.js";
import { ChatClient, OnMessageCallback } from "..";
import { Action, ActionId, Message, Source } from "../../types";
import { replyMessage } from "./actions";

export interface DiscordCredentials {
    token: string;
}

export class DiscordClient implements ChatClient {
    private client: DiscordJs.Client;
    private onMessageCallback: OnMessageCallback;

    constructor(onMessageCallback: OnMessageCallback) {
        this.client = new DiscordJs.Client();
        this.onMessageCallback = onMessageCallback;
    }

    public async authenticate(
        credentials: DiscordCredentials
    ): Promise<ChatClient> {
        if (!credentials?.token) {
            return;
        }
        try {
            await this.client.login(credentials.token);
            return this;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public listen(): void {
        this.client.on(
            "message",
            async (discordMessage: DiscordJs.Message): Promise<void> => {
                if (discordMessage.author.bot) {
                    return;
                }
                const message = this.parseMessage(discordMessage);
                const responseAction = await this.onMessageCallback(
                    this,
                    message
                );
                this.handleOutput(discordMessage, responseAction);
            }
        );
    }

    private async handleOutput(
        discordMessage: DiscordJs.Message,
        action: Action
    ): Promise<void> {
        if (!action?.id) {
            return;
        }
        switch (action.id) {
            case ActionId.Reply:
                return replyMessage(discordMessage, action.body);
        }
    }

    private parseMessage(discordMessage: DiscordJs.Message): Message {
        return {
            userId: discordMessage.author.id,
            userName: discordMessage.author.username,
            channelId: discordMessage.channel.id,
            content: discordMessage.content,
            source: Source.Discord,
            sentAt: new Date(),
        };
    }
}
