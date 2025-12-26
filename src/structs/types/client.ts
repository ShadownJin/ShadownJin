import { 
    Client,
    Collection,
    PermissionResolvable,
    ClientEvents,
    Snowflake,
    ApplicationCommandType,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from 'discord.js';
import { DocumentData } from 'firebase-admin/firestore';

// --- Interface para Objeto de Comandos (ICommand) ---
export interface ICommand {
    name: string;
    description: string;
    category: string;
    meta: {
        cooldown: number;
        type: ApplicationCommandType;
        permissions: PermissionResolvable[];
        guildOnly: boolean;
    };
    _filePath?: string;
    execute: (client: Client, ...args: any[]) => Promise<void> | void;
}

// --- Interface para Objeto de eventos (IEvent) ---
export interface IEvent {
    name: keyof ClientEvents;
    once?: boolean;
    execute: (client: Client, ...args: any[]) => Promise<void> | void;
}


// --- Interface de Cooldown
export interface CooldownParams {
    guildId?: Snowflake | null;
    userId: Snowflake;
    command: string;
}
export interface CooldownResult {
    ok: boolean;
    left?: number; // Tempo restante em segundos
}


// --- Estender a Interface Client ---
declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, ICommand>;
    }
}

export interface UserData extends DocumentData {
    xp: number;
    level: number;
    messages: number;
    userId: Snowflake
    guildId: Snowflake;
    createAt: Date;
    updateAt?: Date;
}