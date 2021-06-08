import { ChatClient } from "./environment";
import { Maybe } from "./types";

export class Chat {
    private environments: ChatClient[];

    constructor(...environments: Maybe<ChatClient>[]) {
        function filterEmptyValues<T>(array: Maybe<T>[]): T[] {
            return array.filter((el) => el) as T[];
        }

        this.environments = filterEmptyValues(environments);
    }

    listen(): void {
        for (const env of this.environments) {
            env.listen();
        }
    }
}
