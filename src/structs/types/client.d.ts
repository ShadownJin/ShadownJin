import {
  Client,
  Collection,
  GatewayIntentBits,
  Interaction,
  Snowflake,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder
} from "discord.js";

export interface CustomClient extends Client {
  commands: Collection<string, Command>;
  cooldown: Collection<string, number>;
}
export interface Event {
  name: string;
  once?: boolean;
  execute: (client: CustomClient, ...args: any[]) => void | Promise<void>;
}

export interface Command {
  cooldown?: number;
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
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
