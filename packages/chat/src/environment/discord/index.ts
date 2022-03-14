import * as DiscordJs from "discord.js";
import { ChatClient, ChatClientID, OnMessageCallback } from "..";
import { Action, ActionId, Maybe, Message, Source } from "../../types";

export type DiscordCredentials = {
    token: string;
};

export class DiscordClient implements ChatClient {
    private client: DiscordJs.Client;
    private onMessageCallback: OnMessageCallback;

    constructor(onMessageCallback: OnMessageCallback) {
        this.client = new DiscordJs.Client();
        this.onMessageCallback = onMessageCallback;
    }

    getID(): ChatClientID {
        return ChatClientID.Discord;
    }

    async stop(): Promise<void> {
        this.client.destroy();
    }

    async authenticate(credentials: DiscordCredentials): Promise<Maybe<ChatClient>> {
        try {
            await this.client.login(credentials.token);
            return this;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    listen(): void {
        const internalMessageHandler = async (discordMessage: DiscordJs.Message) => {
            if (discordMessage.author.bot) {
                return;
            }
            const message = this.parseMessage(discordMessage);
            const response = await this.onMessageCallback(this, message);
            this.execute(discordMessage, response);
        };
        this.client.on("message", internalMessageHandler);
    }

    async sendMessage(channelId: string, message: string, embed?: DiscordJs.MessageEmbed |  DiscordJs.MessageEmbedOptions): Promise<void> {
        const channel = await this.client.channels.fetch(channelId);
        if (channel.type !== "text") {
            return;
        }
        await (channel as DiscordJs.TextChannel).send(message, { embed });
    }

    private async execute(discordMessage: DiscordJs.Message, action: Maybe<Action>) {
        if (!action?.id || !action?.body) {
            return;
        }
        switch (action.id) {
            case ActionId.Reply:
                return this.replyMessage(discordMessage, action.body);
        }
    }

    private replyMessage(discordMessage: DiscordJs.Message, response: string) {
        discordMessage.reply(response);
    }

    private parseMessage(discordMessage: DiscordJs.Message): Message {
        return {
            userId: discordMessage.author.id,
            userName: discordMessage.author.username,
            channelId: discordMessage.channel.id,
            content: discordMessage.content,
            serverId: discordMessage.guild?.id ?? "unknown",
            source: Source.Discord,
            sentAt: new Date(),
            isPing: this.isPingMessage(discordMessage),
        };
    }

    private isPingMessage(discordMessage: DiscordJs.Message): boolean {
        const botUserId = this.client.user?.id;
        if (!botUserId) {
            return false;
        }
        return discordMessage.mentions.has(botUserId);
    }
}
