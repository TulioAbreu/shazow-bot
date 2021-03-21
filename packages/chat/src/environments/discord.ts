import * as Discord from "discord.js";
import {
    Action,
    ActionId,
    ChatEnvironment,
    Maybe,
    Message,
    OnMessageCallback,
    Source,
} from "../types";
import { getDummyCallback } from "../utils";

export class DiscordEnvironment implements ChatEnvironment {
    private client: Discord.Client;
    private onMessageCallback: OnMessageCallback;

    constructor() {
        this.client = new Discord.Client();
        this.onMessageCallback = (getDummyCallback() as unknown) as OnMessageCallback;
    }

    public async authenticate(
        token: string
    ): Promise<Maybe<DiscordEnvironment>> {
        try {
            await this.client.login(token);
            return this;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    public setOnMessageCallback(onMessageCallback: OnMessageCallback): void {
        this.onMessageCallback = onMessageCallback;
        this.listenEvents();
    }

    private listenEvents() {
        this.client.on(
            "message",
            async (discordMessage: Discord.Message): Promise<void> => {
                if (discordMessage.author.bot) {
                    return;
                }
                const message = this.parseMessage(discordMessage);
                const responseAction: Action = await this.onMessageCallback(
                    message
                );
                this.execute(discordMessage, responseAction);
            }
        );
    }

    private execute(discordMessage: Discord.Message, action: Action): void {
        if (!action) {
            return;
        }
        switch (action.id) {
        case ActionId.Reply:
            return this.replyMessage(discordMessage, action.body);
        }
    }

    private replyMessage(
        discordMessage: Discord.Message,
        response: Maybe<string>
    ) {
        if (response === null || response === undefined) {
            return;
        }
        discordMessage.reply(response);
    }

    private parseMessage(discordMessage: Discord.Message): Message {
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
