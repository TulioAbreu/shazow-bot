import { ChatClient } from "./environment";
import { Maybe } from "./types";

export class Chat {
    private environments: ChatClient[];

    constructor(...environments: Maybe<ChatClient>[]) {
        this.environments = environments.filter((x: ChatClient): ChatClient => x);
    }

    listen(): void {
        for (const env of this.environments) {
            env.listen();
        }
    }
}
