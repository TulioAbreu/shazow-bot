import { ChatClient } from "./environment";
import { Maybe } from "./types";

export class Chat {
    private clients: Map<string, ChatClient>;
    private isRunning: boolean;

    constructor() {
        this.clients = new Map<string, ChatClient>();
        this.isRunning = false;
    }

    addClient(client: Maybe<ChatClient>): void {
        if (!client) {
            console.error("[ERROR] Attempt to add empty client.");
            return;
        }
        const clientID = client.getID();
        if (this.clients.get(clientID)) {
            console.error(`[ERROR] Chat already contains ID ${clientID}.`);
            return;
        }
        this.clients.set(clientID, client);
    }

    getClientByID(ID: string): Maybe<ChatClient> {
        return this.clients.get(ID);
    }

    getClients(): ChatClient[] {
        return Array.from(this.clients.values());
    }

    async sendMessage(clientID: string, channelID: string, message: string): Promise<boolean> {
        const client = this.getClientByID(clientID);
        if (!client) {
            return false;
        }
        client.sendMessage(channelID, message);
        return true;
    }

    getIsRunning(): boolean {
        return this.isRunning;
    }

    listen(): void {
        this.isRunning = true;
        this.clients.forEach((client: ChatClient) => client.listen());
    }

    async stop(): Promise<void> {
        const clients = Array.from(this.clients.values());
        await Promise.all(clients.map(async (client: ChatClient) => client.stop()));
    }
}
