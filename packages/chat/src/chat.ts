import { ChatClient } from "./environment";
import { Maybe } from "./types";

export class Chat {
    private environments: ChatClient[];

    constructor() {
        this.environments = [];
    }

    addClient(environment: Maybe<ChatClient>): void {
        if (!environment) {
            return;
        }
        this.environments.push(environment);
    }

    listen(): void {
        for (const env of this.environments) {
            env.listen();
        }
    }
}
