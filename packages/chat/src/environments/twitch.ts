import { ChatUserstate, Client, client } from "tmi.js";
import {
    Action,
    ActionId,
    ChatEnvironment,
    Message,
    OnMessageCallback,
    Source,
} from "../types";
import { getDummyCallback } from "../utils";

export class TwitchEnvironment implements ChatEnvironment {
    private client: Client;
    private channels: string[];
    private onMessageCallback: OnMessageCallback;

    constructor(channels: string[]) {
        this.client = null;
        this.channels = channels;
        this.onMessageCallback = (getDummyCallback() as unknown) as OnMessageCallback;
    }

    public async authenticate(
        username: string,
        token: string
    ): Promise<TwitchEnvironment> {
        this.client = client({
            identity: {
                username,
                password: token,
            },
            channels: this.channels,
        });
        await this.client.connect();
        return this;
    }

    public setOnMessageCallback(onMessageCallback: OnMessageCallback): void {
        this.onMessageCallback = onMessageCallback;
        this.listenEvents();
    }

    private listenEvents() {
        this.client.on(
            "message",
            async (
                target: string,
                context: ChatUserstate,
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
                const responseAction: Action = await this.onMessageCallback(
                    message
                );
                this.execute(target, context, responseAction);
            }
        );
    }

    private parseMessage(
        context: ChatUserstate,
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

    private execute(target: string, context: ChatUserstate, action: Action) {
        switch (action.id) {
        case ActionId.Reply:
            return this.replyMessage(
                target,
                context,
                action.body as string
            );
        }
    }

    private replyMessage(
        target: string,
        context: ChatUserstate,
        response: string
    ) {
        this.client.say(target, `@${context.username} ${response}`);
    }
}
