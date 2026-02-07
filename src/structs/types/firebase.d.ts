import { DocumentData } from "firebase-admin/firestore";

export interface UserData extends DocumentData {
  xp: number;
  level: number;
  reputation: number;
  souls: number;
  messages: number;
  userId: string;
  lastDaily: number;
  createAt: Date;
  updateAt?: Date;
  inventory: [];
}

export interface GuildData extends DocumentData {
  guildId: string;
  ownerId: string;
  guildName: string;
  modules: {
    moderation: {
      enable: boolean;
      logChannelId: string | null;
      staffRoleId: string | null;
    };
  };
  createAt: Date;
  UpdateAt?: Date;
}
