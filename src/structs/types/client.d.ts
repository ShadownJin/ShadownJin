import {
  Client,
  Collection,
  GatewayIntentBits,
  Interaction,
  Snowflake,
} from "discord.js";

export interface CustomClient extends Client {
  commands: Collection<string, any>;
  cooldown: Collection<number, void>;
}
declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
  }
}
export interface Event {
  name: string;
  execute: (client: CustomClient, ...args: any[]) => void | Promise<void>;
}

export interface Command {
  cooldown: number;
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: any) => Promise<void>;
}

export interface CooldownParams {
  guildId?: Snowflake | null;
  userId: Snowflake;
  command: string;
}
export interface CooldownResult {
  ok: boolean;
  left?: number; // Tempo restante em segundos;
}
