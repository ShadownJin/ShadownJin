import admin from "firebase-admin";
import { GuildData } from "../../structs/types/firebase.js";

export async function createOnEnter(
  guildId: string,
  ownerId: string,
  guildName: string,
): Promise<GuildData> {
  const defaultGuild = (
    guildId: string,
    ownerId: string,
    guildName: string,
  ): GuildData => ({
    guildId,
    ownerId,
    guildName,
    modules: {
      moderation: {
        enabled: true,
        logChannelId: null,
        staffRoleId: null,
      },
    },
    createAt: new Date(),
  });

  const db = admin.firestore();
  const ref = db.collection("guilds").doc(String(guildId));
  const snap = await ref.get();

  if (!snap.exists) {
    const data = defaultGuild(guildId, ownerId, guildName);
    await ref.set(data);
    return data;
  }
  return snap.data() as GuildData;
}
