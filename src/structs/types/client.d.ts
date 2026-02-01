import { Client, Collection, GatewayIntentBits, Interaction } from "discord.js";

export interface CustomClient extends Client {
    commands: Collection<string, any>;
}

export interface Event {
    name: string;
    execute: (client: CustomClient, ...args: any[]) => void | Promise<void>;
}

export interface Command {
    data: {
        name: string,
        description: string
    };
    execute: (interaction: any) => Promise<void>;
}