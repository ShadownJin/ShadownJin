import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} from "discord.js";
import type { Command } from "../../structs/types/client.js";
import { sloganConfig } from "./handler/sloganConfig.js";
import { initFirestore } from "../../lib/database/firestore.js";
const db = initFirestore();

const userConfigCommand: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription("[CONFIG] Configuração do usuário")
        // GRUPO: PERFIL
        .addSubcommandGroup(sub =>
            sub
                .setName("perfil")
                .setDescription("Realiza modificações do perfil do usuário")
                // SUB: Configura Frase
                .addSubcommand(cmd => 
                    cmd
                    .setName("frase")
                    .setDescription("Modifica a frase exibida no perfil")
                    .addStringOption(option => 
                        option
                        .setName("frase")
                        .setDescription("Escreva a frase que deseja adicionar")
                        .setRequired(true)
                    )
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const group = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const userRef = db.collection("users").doc(userId);
        

        if (group === "perfil") {
            if (subcommand == "frase") {
                await sloganConfig(interaction, userRef);
            }
        }
    }
}

export default userConfigCommand;