import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { AppError } from "./AppError.js";

export async function handlerError(
    error: unknown,
    interaction?: ChatInputCommandInteraction
) {
    console.error("🔥 ERROR: ", error);

    if (error instanceof AppError) {
        if (interaction && !interaction.replied) {
            await interaction.reply({
                content: error.message,
                flags: MessageFlags.Ephemeral
            });
        }
        return;
    }

    if (interaction && !interaction.replied) {
        await interaction.reply({
                content: 'Ocorreu um erro inesperado. A equipe foi notificado pelo erro!',
                flags: MessageFlags.Ephemeral
        })
    }
}

export function logError(context: string, error: unknown) {
    console.error(`[${context}]`, error);
}