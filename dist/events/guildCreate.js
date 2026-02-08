import { createOnEnter } from "../lib/database/defaultGuild.schema.js";
const guildCreate = {
    name: "guildCreate",
    async execute(client, guild) {
        const guildId = guild.id;
        const ownerId = guild.ownerId;
        const guildName = guild.name;
        try {
            await createOnEnter(guildId, ownerId, guildName);
        }
        catch (error) {
            console.error("[GUILD] Erro ao adicionar guild!", {
                guildId: guild.id,
                error,
            });
        }
    },
};
export default guildCreate;
