import { Guild, Client } from "discord.js";
import type { CustomClient, Event } from "../structs/types/client.js";
import admin from "firebase-admin";
import { createOnEnter } from "../lib/database/defaultGuild.schema.js";

const guildCreate: Event = {
  name: "guildCreate",
  async execute(client: CustomClient, guild: Guild) {
    const guildId = guild.id;
    const ownerId = guild.ownerId;
    const guildName = guild.name;

    try {
      await createOnEnter(guildId, ownerId, guildName);
    } catch (error) {
      console.error("[GUILD] Erro ao adicionar guild!", {
        guildId: guild.id,
        error,
      });
    }
  },
};

export default guildCreate;
