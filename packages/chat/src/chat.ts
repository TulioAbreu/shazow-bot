import { ChatEnvironment, Maybe, OnMessageCallback } from "./types";

export class Chat {
    private environments: ChatEnvironment[] = [];

    constructor(...environments: Maybe<ChatEnvironment>[]) {
        this.environments = environments.filter((x) => x) as ChatEnvironment[];
    }

    setOnMessageCallback(onMessageCallback: OnMessageCallback): void {
        for (const env of this.environments) {
            env.setOnMessageCallback(onMessageCallback);
        }
    }
}
